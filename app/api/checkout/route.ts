import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { buildWhatsAppOrderUrl, getEftDetails } from '@/lib/local-shelf';
import { notifyAdmins } from '@/lib/notifications';

type CheckoutItem = {
  productId: string;
  quantity: number;
  price: number;
  vendorId: string;
};

type CheckoutAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  country?: string;
};

function generateOrderNumber(): string {
  return `PEB-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      subtotal,
      delivery,
      savings = 0,
      total,
      paymentMethod,
      deliveryMethod,
      guest,
    } = body as {
      items: CheckoutItem[];
      subtotal: number;
      delivery: number;
      savings?: number;
      total: number;
      paymentMethod: string;
      deliveryMethod: string;
      guest?: { email: string; name: string; phone: string; address: CheckoutAddress };
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!paymentMethod || !deliveryMethod) {
      return NextResponse.json({ error: 'Payment and delivery method required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    let userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      if (!guest?.email || !guest?.name || !guest?.phone || !guest?.address) {
        return NextResponse.json({ error: 'Contact details required for guest checkout' }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email: guest.email } });
      if (existing) {
        userId = existing.id;
        if (guest.phone && !existing.phone) {
          await prisma.user.update({ where: { id: existing.id }, data: { phone: guest.phone } });
        }
      } else {
        const created = await prisma.user.create({
          data: {
            email: guest.email,
            name: guest.name,
            phone: guest.phone,
            role: 'BUYER',
          },
        });
        userId = created.id;
      }
    }

    const addr = guest?.address;
    const address = await prisma.address.create({
      data: {
        fullName: addr?.fullName || String(session?.user?.name ?? 'Customer'),
        phone: addr?.phone || guest?.phone || '',
        line1: addr?.line1 || '',
        line2: addr?.line2 || null,
        city: addr?.city || '',
        province: addr?.province || '',
        postalCode: addr?.postalCode || '',
        country: addr?.country || 'South Africa',
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: userId!,
        subtotal,
        delivery,
        savings: savings ?? 0,
        total,
        paymentMethod,
        paymentStatus: 'PENDING',
        deliveryMethod,
        addressId: address.id,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            vendorId: item.vendorId,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    for (const item of items) {
      try {
        const updatedProduct = await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
          select: { name: true, vendorId: true },
        });

        const vendor = await prisma.vendor.findUnique({
          where: { id: item.vendorId },
          select: { id: true, userId: true },
        });

        if (vendor) {
          await prisma.notification.create({
            data: {
              userId: vendor.userId,
              title: 'New Local Shelf sale',
              message: `Sold ${item.quantity} × ${updatedProduct.name}. Awaiting EFT payment.`,
              type: 'sale',
              link: '/admin/orders',
            },
          });

          const amount = item.price * item.quantity;
          await prisma.vendor.update({
            where: { id: vendor.id },
            data: { pendingBalance: { increment: amount } },
          });

          await prisma.walletTransaction.create({
            data: {
              vendorId: vendor.id,
              amount,
              type: 'CREDIT',
              status: 'PENDING',
              description: `Sale of ${item.quantity} × ${updatedProduct.name}`,
              referenceId: order.id,
            },
          });
        }
      } catch (err) {
        console.error(`Post-order update failed for product ${item.productId}:`, err);
      }
    }

    try {
      const userName = order.user?.name || 'Customer';
      await notifyAdmins({
        title: 'New order — pay after order',
        message: `Order #${order.orderNumber} from ${userName}. Total R${Number(order.total).toFixed(2)}. Payment: ${paymentMethod}.`,
        type: 'order',
        link: `/admin/orders/${order.id}`,
      });
    } catch (err) {
      console.error('Admin notification failed:', err);
    }

    const eft = getEftDetails();
    const eftReference = `${eft.referencePrefix}-${order.orderNumber}`;
    const whatsappUrl = buildWhatsAppOrderUrl(order.orderNumber, Number(order.total), order.user?.phone ?? undefined);

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: Number(order.total),
          subtotal: Number(order.subtotal),
          delivery: Number(order.delivery),
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          createdAt: order.createdAt,
        },
        paymentInstructions: {
          method: paymentMethod,
          eft: {
            bankName: eft.bankName,
            accountName: eft.accountName,
            accountNumber: eft.accountNumber,
            branchCode: eft.branchCode,
            reference: eftReference,
            amount: Number(order.total),
          },
          whatsappUrl,
          note: 'Buy after pay: complete your EFT or message us on WhatsApp with your order number. We confirm once payment is received.',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
