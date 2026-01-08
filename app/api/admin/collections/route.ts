import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTING_KEY = 'collections';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (setting && setting.value) {
      return NextResponse.json({
        success: true,
        collections: setting.value as Array<{ id: string; name: string; href: string; color?: string }>,
      }, { headers });
    }

    // Return default collections if not found
    return NextResponse.json({
      success: true,
      collections: [
        { id: 'new-arrivals', name: 'New Arrivals', href: '/new' },
        { id: 'christmas', name: 'Christmas', href: '/christmas' },
        { id: 'summer', name: 'Summer', href: '/summer' },
        { id: 'deals', name: 'Deals & Promotions', href: '/deals' },
        { id: 'liquor', name: 'Festive Liquor', href: '/liquor' },
        { id: 'brands', name: 'Brands Store', href: '/brands' },
        { id: 'splash', name: 'PeboliSPLASH', href: '/more', color: '#db2777' },
        { id: 'clearance', name: 'Clearance', href: '/clearance' },
      ],
    }, { headers });
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.email !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { collections } = await request.json();

    if (!Array.isArray(collections)) {
      return NextResponse.json(
        { error: 'Invalid collections data', success: false },
        { status: 400 }
      );
    }

    const jsonValue = JSON.parse(JSON.stringify(collections));

    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: {
        value: jsonValue,
        updatedAt: new Date(),
      },
      create: {
        key: SETTING_KEY,
        value: jsonValue,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Collections saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving collections:', error);
    return NextResponse.json(
      { error: 'Failed to save collections', success: false },
      { status: 500 }
    );
  }
}

