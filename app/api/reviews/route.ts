import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, userId, rating, title, comment, userName } = body;

    if (!productId || !userId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user exists (optional, but good practice)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has purchased the product (for verified purchase badge)
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED', // Assuming we only count delivered orders
        },
      },
    });

    const isVerifiedPurchase = !!orderItem;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        userName: userName || user.name || 'Anonymous',
        rating: Number(rating),
        title,
        comment,
        isVerifiedPurchase,
      },
    });

    // Update product rating and review count
    const productReviews = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: productReviews._avg.rating || 0,
        reviewCount: productReviews._count.id || 0,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 10, // Pagination limit
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
