import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Test endpoint to manually save a department for testing
 * This helps verify the save process works
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.email !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const testDepartment = body.department || { name: 'Test Department', slug: 'test-department' };

    const departments = [testDepartment];

    console.log('[Test API] Saving test department:', departments);

    const result = await prisma.setting.upsert({
      where: { key: 'departments' },
      update: {
        value: departments,
        updatedAt: new Date(),
      },
      create: {
        key: 'departments',
        value: departments,
      },
    });

    console.log('[Test API] Save result:', result.id);

    // Verify
    const saved = await prisma.setting.findUnique({
      where: { key: 'departments' },
    });

    return NextResponse.json({
      success: true,
      message: 'Test department saved',
      saved: !!saved,
      value: saved?.value,
    });
  } catch (error: any) {
    console.error('[Test API] Error:', error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}

