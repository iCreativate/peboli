import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, boostType } = body;

    if (!productId || !boostType) {
      return NextResponse.json(
        { error: 'Product ID and Boost Type are required' },
        { status: 400 }
      );
    }

    let expiresAt = new Date();
    
    switch (boostType) {
      case 'hourly':
        expiresAt.setHours(expiresAt.getHours() + 1);
        break;
      case 'daily':
        expiresAt.setDate(expiresAt.getDate() + 1);
        break;
      case 'weekly':
        expiresAt.setDate(expiresAt.getDate() + 7);
        break;
      case 'monthly':
        expiresAt.setDate(expiresAt.getDate() + 30);
        break;
      default:
        return NextResponse.json({ error: 'Invalid boost type' }, { status: 400 });
    }

    // @ts-ignore: Schema updated but client not regenerated yet
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        isBoosted: true,
        boostExpiresAt: expiresAt,
        boostLevel: boostType,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Boost error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
