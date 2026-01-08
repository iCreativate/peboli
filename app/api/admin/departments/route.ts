import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTING_KEY = 'departments';

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
        departments: setting.value as Array<{ name: string; slug: string }>,
      }, { headers });
    }

    // Return empty array if not found (no mock data)
    return NextResponse.json({
      success: true,
      departments: [],
    }, { headers });
  } catch (error: any) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments', success: false },
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

    const { departments } = await request.json();

    console.log('[API /api/admin/departments PUT] Received departments:', departments);
    console.log('[API /api/admin/departments PUT] Departments type:', typeof departments);
    console.log('[API /api/admin/departments PUT] Is array:', Array.isArray(departments));

    if (!Array.isArray(departments)) {
      return NextResponse.json(
        { error: 'Invalid departments data', success: false },
        { status: 400 }
      );
    }

    const jsonValue = JSON.parse(JSON.stringify(departments));
    console.log('[API /api/admin/departments PUT] JSON value to save:', jsonValue);

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

    console.log('[API /api/admin/departments PUT] Data saved to database');

    // Verify the save by reading it back
    const saved = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    console.log('[API /api/admin/departments PUT] Verified saved data:', saved?.value);
    console.log('[API /api/admin/departments PUT] Saved data type:', typeof saved?.value);

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    return NextResponse.json({
      success: true,
      message: 'Departments saved successfully',
      departments: (saved?.value as Array<{ name: string; slug: string }>) || departments,
    }, { headers });
  } catch (error: any) {
    console.error('Error saving departments:', error);
    return NextResponse.json(
      { error: 'Failed to save departments', success: false },
      { status: 500 }
    );
  }
}

