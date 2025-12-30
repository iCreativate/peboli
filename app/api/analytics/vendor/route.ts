import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let vendorId = searchParams.get('vendorId');

    // If no vendorId, find first one (mock auth)
    if (!vendorId) {
      const vendor = await prisma.vendor.findFirst();
      if (!vendor) {
        return NextResponse.json({ error: 'No vendor found' }, { status: 404 });
      }
      vendorId = vendor.id;
    }

    // 1. Total Sales (Items Sold)
    const salesAgg = await prisma.orderItem.aggregate({
      where: { vendorId },
      _sum: { quantity: true },
    });
    const totalSales = salesAgg._sum.quantity || 0;

    // 2. Total Revenue
    const revenueAgg = await prisma.orderItem.aggregate({
      where: { vendorId },
      _sum: { total: true },
    });
    const totalRevenue = Number(revenueAgg._sum.total || 0);

    // 3. Products Stats
    const totalProducts = await prisma.product.count({
      where: { vendorId },
    });

    const lowStockProducts = await prisma.product.count({
      where: { 
        vendorId,
        stock: { lt: 5 } 
      },
    });

    // 4. Recent Orders (Items)
    const recentSales = await prisma.orderItem.findMany({
      where: { vendorId },
      take: 5,
      orderBy: { order: { createdAt: 'desc' } },
      include: {
        product: { select: { name: true, images: true } },
        order: { select: { orderNumber: true, createdAt: true, status: true } }
      }
    });

    // 5. Monthly Revenue for Chart
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const monthlySales = await prisma.orderItem.findMany({
      where: {
        vendorId,
        order: {
          createdAt: {
            gte: startOfYear,
            lte: endOfYear
          }
        }
      },
      select: {
        total: true,
        order: {
          select: {
            createdAt: true
          }
        }
      }
    });

    const monthlyRevenue = Array(12).fill(0);
    monthlySales.forEach(sale => {
      const month = new Date(sale.order.createdAt).getMonth();
      monthlyRevenue[month] += Number(sale.total);
    });

    return NextResponse.json({
      totalSales,
      totalRevenue,
      totalProducts,
      lowStockProducts,
      recentSales,
      monthlyRevenue
    });

  } catch (error) {
    console.error('Error fetching vendor analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
