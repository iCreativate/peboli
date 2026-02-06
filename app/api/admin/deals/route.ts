import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { notifyAdmins } from '@/lib/notifications';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status.toUpperCase();
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
    });

    return NextResponse.json({
      success: true,
      deals,
    });
  } catch (error: any) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching deals.', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
        { error: 'Only admin@peboli.store can create deals.', success: false },
        { status: 403 }
      );
    }

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

    // Validate required fields
    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required.', success: false },
        { status: 400 }
      );
    }

    // Validate productId for Product Campaign
    if (type === 'PRODUCT_CAMPAIGN' && !productId) {
      return NextResponse.json(
        { error: 'Product ID is required for Product Campaign.', success: false },
        { status: 400 }
      );
    }

    // Validate imageUrl for Advert
    if (type === 'ADVERT' && !imageUrl && !bannerUrl) {
      return NextResponse.json(
        { error: 'Image or banner URL is required for Advert.', success: false },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.create({
      data: {
        type,
        title,
        description,
        status: status || 'DRAFT',
        discountPercentage,
        discountAmount: discountAmount ? parseFloat(discountAmount) : null,
        itemsCount,
        productId,
        imageUrl,
        bannerUrl,
        linkUrl,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        priority: priority || 0,
        isFeatured: isFeatured || false,
      },
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
    if (deal.productId) {
      const isActive = deal.status === 'ACTIVE';
      try {
        await prisma.product.update({
          where: { id: deal.productId },
          data: { isSplashDeal: isActive }
        });
      } catch (error) {
        console.error('Error syncing product splash deal status:', error);
      }
    }

    // Notify admins about new deal
    if (status === 'ACTIVE') {
      try {
        await notifyAdmins({
          title: `New ${type.replace('_', ' ')} Campaign`,
          message: `${title} has been created and is now active.`,
          type: 'deal',
          link: `/admin/deals`,
        });
      } catch (error) {
        console.error('Error notifying admins about deal:', error);
      }
    }

    return NextResponse.json({
      success: true,
      deal,
      message: 'Deal created successfully.',
    });
  } catch (error: any) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'An error occurred while creating deal.',
        success: false 
      },
      { status: 500 }
    );
  }
}

