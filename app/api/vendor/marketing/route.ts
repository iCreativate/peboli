import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // In a real app, get from session
    const vendor = await prisma.vendor.findFirst();
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        isBoosted: true,
        boostExpiresAt: true,
        boostLevel: true,
        boostReach: true,
        boostClicks: true,
        boostSpend: true,
        soldCount: true,
        rating: true,
        stock: true,
      }
    });

    const boostedProducts = products.filter(p => p.isBoosted);
    const nonBoostedProducts = products.filter(p => !p.isBoosted);

    const totalSpend = boostedProducts.reduce((sum, p) => sum + Number(p.boostSpend || 0), 0);
    const totalReach = boostedProducts.reduce((sum, p) => sum + (p.boostReach || 0), 0);
    const totalClicks = boostedProducts.reduce((sum, p) => sum + (p.boostClicks || 0), 0);
    
    // Calculate CTR
    const totalCtr = totalReach > 0 ? (totalClicks / totalReach) * 100 : 0;

    return NextResponse.json({
      stats: {
        spend: totalSpend,
        reach: totalReach,
        clicks: totalClicks,
        ctr: totalCtr,
      },
      boostedProducts,
      nonBoostedProducts
    });
  } catch (error) {
    console.error('Error fetching marketing data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
