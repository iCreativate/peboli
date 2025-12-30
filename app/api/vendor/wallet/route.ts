import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const vendor = await (prisma as any).vendor.findUnique({
      where: { userId },
      include: {
        walletTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({
      balance: vendor.walletBalance,
      pendingBalance: vendor.pendingBalance,
      transactions: vendor.walletTransactions
    });
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet data' }, { status: 500 });
  }
}
