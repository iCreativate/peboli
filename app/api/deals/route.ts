import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'ACTIVE';
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured') === 'true';

    const where: any = {
      status: status.toUpperCase(),
    };

    if (type) {
      where.type = type.toUpperCase();
    }

    if (featured) {
      where.isFeatured = true;
    }

    // For active deals, only show those that haven't ended
    if (status === 'ACTIVE') {
      where.OR = [
        { endsAt: null },
        { endsAt: { gte: new Date() } },
      ];
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            compareAtPrice: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return NextResponse.json(deals);
  } catch (error: any) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching deals.' },
      { status: 500 }
    );
  }
}

