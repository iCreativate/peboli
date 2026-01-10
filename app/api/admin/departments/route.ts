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
    console.log('[API /api/admin/departments PUT] Request received');
    
    const session = await getServerSession(authOptions);
    console.log('[API /api/admin/departments PUT] Session:', session ? 'exists' : 'none');
    console.log('[API /api/admin/departments PUT] User email:', session?.user?.email);

    if (!session || !session.user) {
      console.error('[API /api/admin/departments PUT] No session found');
      return NextResponse.json(
        { 
          error: 'Unauthorized - Please log in', 
          success: false,
          message: 'You must be logged in to save departments. Please log in as admin@peboli.store',
        },
        { status: 401 }
      );
    }

    if (session.user.email !== 'admin@peboli.store') {
      console.error('[API /api/admin/departments PUT] Unauthorized access attempt by:', session.user.email);
      return NextResponse.json(
        { 
          error: 'Unauthorized - Admin access required', 
          success: false,
          message: `You are logged in as ${session.user.email}, but you need to be logged in as admin@peboli.store to save departments.`,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('[API /api/admin/departments PUT] Request body:', JSON.stringify(body, null, 2));
    
    const { departments } = body;

    console.log('[API /api/admin/departments PUT] Received departments:', departments);
    console.log('[API /api/admin/departments PUT] Departments type:', typeof departments);
    console.log('[API /api/admin/departments PUT] Is array:', Array.isArray(departments));

    if (!Array.isArray(departments)) {
      console.error('[API /api/admin/departments PUT] Invalid data format - not an array');
      return NextResponse.json(
        { error: 'Invalid departments data - must be an array', success: false },
        { status: 400 }
      );
    }

    if (departments.length === 0) {
      console.warn('[API /api/admin/departments PUT] Empty array received - will save empty array');
    }

    const jsonValue = JSON.parse(JSON.stringify(departments));
    console.log('[API /api/admin/departments PUT] JSON value to save:', JSON.stringify(jsonValue, null, 2));

    try {
      const result = await prisma.setting.upsert({
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
      console.log('[API /api/admin/departments PUT] Upsert result:', result.id);
      console.log('[API /api/admin/departments PUT] Data saved to database successfully');
    } catch (prismaError: any) {
      console.error('[API /api/admin/departments PUT] Prisma error:', prismaError);
      console.error('[API /api/admin/departments PUT] Prisma error message:', prismaError.message);
      console.error('[API /api/admin/departments PUT] Prisma error code:', prismaError.code);
      throw prismaError;
    }

    // Verify the save by reading it back
    const saved = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    console.log('[API /api/admin/departments PUT] Verification query result:', saved ? 'found' : 'not found');
    console.log('[API /api/admin/departments PUT] Verified saved data:', saved?.value);
    console.log('[API /api/admin/departments PUT] Saved data type:', typeof saved?.value);
    console.log('[API /api/admin/departments PUT] Saved data is array:', Array.isArray(saved?.value));

    if (!saved) {
      console.error('[API /api/admin/departments PUT] CRITICAL: Data was not saved - verification failed!');
      return NextResponse.json(
        { error: 'Data was not saved - verification failed', success: false },
        { status: 500 }
      );
    }

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    return NextResponse.json({
      success: true,
      message: 'Departments saved successfully',
      departments: (saved.value as Array<{ name: string; slug: string }>) || departments,
    }, { headers });
  } catch (error: any) {
    console.error('[API /api/admin/departments PUT] Error saving departments:', error);
    console.error('[API /api/admin/departments PUT] Error message:', error.message);
    console.error('[API /api/admin/departments PUT] Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to save departments: ' + (error.message || 'Unknown error'),
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

