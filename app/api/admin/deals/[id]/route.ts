import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can access deals.', success: false },
        { status: 403 }
      );
    }

    const { id } = await params;
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        },
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found.', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deal,
    });
  } catch (error: any) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching deal.', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can update deals.', success: false },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      type,
      title,
      description,
      status,
      discountPercentage,
      discountAmount,
      itemsCount,
      productId,
      imageUrl,
      bannerUrl,
      linkUrl,
      startsAt,
      endsAt,
      priority,
      isFeatured,
    } = body;

    // Check if deal exists
    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { error: 'Deal not found.', success: false },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (discountPercentage !== undefined) updateData.discountPercentage = discountPercentage;
    if (discountAmount !== undefined) updateData.discountAmount = discountAmount ? parseFloat(discountAmount) : null;
    if (itemsCount !== undefined) updateData.itemsCount = itemsCount;
    if (productId !== undefined) updateData.productId = productId;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (startsAt !== undefined) updateData.startsAt = startsAt ? new Date(startsAt) : null;
    if (endsAt !== undefined) updateData.endsAt = endsAt ? new Date(endsAt) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const deal = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        },
      },
    });

    // Sync with Product (set isSplashDeal for any deal with a product)
    // 1. Handle product change or status change for the current deal
    if (deal.productId) {
      const isActive = deal.status === 'ACTIVE';
      try {
        await prisma.product.update({
          where: { id: deal.productId },
          data: { isSplashDeal: isActive }
        });
      } catch (error) {
        console.error('Error syncing product splash deal status (update):', error);
      }
    }

    // 2. Handle case where productId changed (unset old product)
    // If the previous deal had a product ID that is different from the new one
    if (existingDeal.productId && existingDeal.productId !== deal.productId) {
      try {
        await prisma.product.update({
          where: { id: existingDeal.productId },
          data: { isSplashDeal: false }
        });
      } catch (error) {
        console.error('Error unsetting old product splash deal status:', error);
      }
    }


    return NextResponse.json({
      success: true,
      deal,
      message: 'Deal updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'An error occurred while updating deal.',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can delete deals.', success: false },
        { status: 403 }
      );
    }

    const { id } = await params;
    const deal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found.', success: false },
        { status: 404 }
      );
    }

    // Sync with Product (delete)
    if (deal.productId) {
      try {
        await prisma.product.update({
          where: { id: deal.productId },
          data: { isSplashDeal: false }
        });
      } catch (error) {
        console.error('Error unsetting product splash deal status (delete):', error);
      }
    }

    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting deal.', success: false },
      { status: 500 }
    );
  }
}

