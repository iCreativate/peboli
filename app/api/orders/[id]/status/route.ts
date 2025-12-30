import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id: orderId } = await context.params;

    // Validate status if needed
    // const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true }
    });

    if (status === 'DELIVERED') {
      // Release funds for all vendors in this order
      const transactions = await (prisma as any).walletTransaction.findMany({
        where: {
          referenceId: orderId,
          status: 'PENDING'
        }
      });

      for (const tx of transactions) {
        // Update transaction status
        await (prisma as any).walletTransaction.update({
          where: { id: tx.id },
          data: { status: 'COMPLETED' }
        });

        // Move funds
        await (prisma as any).vendor.update({
          where: { id: tx.vendorId },
          data: {
            pendingBalance: { decrement: tx.amount },
            walletBalance: { increment: tx.amount }
          }
        });

        // Notify Vendor
        const vendor = await prisma.vendor.findUnique({
          where: { id: tx.vendorId },
          select: { userId: true }
        });

        if (vendor) {
           await (prisma as any).notification.create({
            data: {
              userId: vendor.userId,
              title: 'Funds Released',
              message: `Order #${order.orderNumber} delivered. ${tx.amount} has been added to your available balance.`,
              type: 'system',
              link: '/vendor/dashboard/wallet'
            }
          });
        }
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
