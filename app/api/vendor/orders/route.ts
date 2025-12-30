import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    let targetVendorId = vendorId;
    if (!targetVendorId) {
        const vendor = await prisma.vendor.findFirst();
        if (vendor) targetVendorId = vendor.id;
    }

    if (!targetVendorId) {
        return NextResponse.json([]);
    }

    // Find order items for this vendor
    const orderItems = await (prisma as any).orderItem.findMany({
      where: { vendorId: targetVendorId },
      include: {
        order: {
            include: {
                address: true,
                user: true
            }
        },
        product: {
          include: {
            images: true
          }
        }
      },
      orderBy: { order: { createdAt: 'desc' } },
    });

    // Group by order? Or just return items?
    // Usually vendors want to see "Orders" containing their items.
    // Let's structure it as a list of "Vendor Orders"
    const formattedOrders = orderItems.map((item: any) => ({
        id: item.order.id, // Order ID
        orderNumber: item.order.orderNumber,
        createdAt: item.order.createdAt,
        status: item.order.status,
        customer: item.order.user ? { name: item.order.user.name, email: item.order.user.email } : { name: 'Guest', email: 'N/A' },
        product: {
          name: item.product.name,
          image: item.product.images[0]?.url || '/products/placeholder.svg',
          price: item.price,
          quantity: item.quantity,
          total: item.total
        },
        deliveryMethod: item.order.deliveryMethod,
        address: item.order.address
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
