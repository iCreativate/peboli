import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Total Users
    const totalUsers = await prisma.user.count({
      where: { role: 'BUYER' }
    });

    // 2. Total Vendors
    const totalVendors = await prisma.vendor.count();

    // 3. Total Orders
    const totalOrders = await prisma.order.count();

    // 4. Total Revenue
    const revenueAgg = await prisma.order.aggregate({
      _sum: { total: true },
    });
    const totalRevenue = Number(revenueAgg._sum.total || 0);

    // 5. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { id: true } } // just to count items
      }
    });

    // 6. Monthly Revenue for Chart
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const monthlySales = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: startOfYear,
                lte: endOfYear
            }
        },
        select: {
            total: true,
            createdAt: true
        }
    });

    const monthlyRevenue = Array(12).fill(0);
    monthlySales.forEach(sale => {
        const month = new Date(sale.createdAt).getMonth();
        monthlyRevenue[month] += Number(sale.total);
    });

    return NextResponse.json({
      totalUsers,
      totalVendors,
      totalOrders,
      totalRevenue,
      recentOrders,
      monthlyRevenue
    });

  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
