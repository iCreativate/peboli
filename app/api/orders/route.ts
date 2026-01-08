import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
        }

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: true
                            }
                        },
                    },
                },
                address: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, items, subtotal, delivery, savings, total, paymentMethod, deliveryMethod, addressId } = body;

        const order = await prisma.order.create({
            data: {
                orderNumber: `PEB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                userId,
                subtotal,
                delivery,
                savings,
                total,
                paymentMethod,
                deliveryMethod,
                addressId,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity,
                        vendorId: item.vendorId,
                    })),
                },
            },
            include: {
                items: true,
                address: true,
            },
        });

        // Update stock, handle wallet and notify vendors/admin
        const { notifyAdmins } = await import('@/lib/notifications');

        for (const item of items) {
            try {
                // Update product stock and sold count
                const updatedProduct = await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        soldCount: { increment: item.quantity }
                    },
                    select: { name: true, stock: true, vendorId: true }
                });

                // Get vendor
                const vendor = await prisma.vendor.findUnique({
                    where: { id: item.vendorId },
                    select: { id: true, userId: true }
                });

                if (vendor) {
                    // 1. Notify Vendor
                    await (prisma as any).notification.create({
                        data: {
                            userId: vendor.userId,
                            title: 'New Sale!',
                            message: `You sold ${item.quantity} x ${updatedProduct.name}. Funds are pending until delivery.`,
                            type: 'sale',
                            link: `/vendor/dashboard/orders`
                        }
                    });

                    // 2. Credit Pending Balance & Create Transaction Record
                    const amount = item.price * item.quantity;
                    await (prisma as any).vendor.update({
                        where: { id: vendor.id },
                        data: {
                            pendingBalance: { increment: amount }
                        }
                    });

                    await (prisma as any).walletTransaction.create({
                        data: {
                            vendorId: vendor.id,
                            amount: amount,
                            type: 'CREDIT',
                            status: 'PENDING',
                            description: `Sale of ${item.quantity} x ${updatedProduct.name}`,
                            referenceId: order.id
                        }
                    });
                }
            } catch (err) {
                console.error(`Error processing post-order updates for item ${item.productId}:`, err);
            }
        }

        // Notify Admin
        try {
            await notifyAdmins({
                title: 'New Order Received',
                message: `Order #${order.orderNumber} has been placed by ${order.user.name}. Total: R${order.total.toFixed(2)}`,
                type: 'order',
                link: `/admin/orders/${order.id}`
            });
        } catch (error) {
            console.error('Error notifying admins about new order:', error);
        }

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
