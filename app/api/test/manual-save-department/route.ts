import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Manual test endpoint to save a department directly
 * This bypasses the admin page to test if the database save works
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('[Test Manual Save] Session check:', {
      hasSession: !!session,
      email: session?.user?.email,
    });
    
    if (!session || !session.user || session.user.email !== 'admin@peboli.store') {
      return NextResponse.json(
        { 
          error: 'Unauthorized - Please log in as admin@peboli.store', 
          success: false,
          hasSession: !!session,
          email: session?.user?.email,
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const testDepartments = body.departments || [
      { name: 'Test Department', slug: 'test-department' }
    ];

    console.log('[Test Manual Save] Attempting to save:', testDepartments);

    try {
      const result = await prisma.setting.upsert({
        where: { key: 'departments' },
        update: {
          value: testDepartments,
          updatedAt: new Date(),
        },
        create: {
          key: 'departments',
          value: testDepartments,
        },
      });

      console.log('[Test Manual Save] Upsert result ID:', result.id);

      // Verify immediately
      const saved = await prisma.setting.findUnique({
        where: { key: 'departments' },
      });

      console.log('[Test Manual Save] Verification:', {
        found: !!saved,
        value: saved?.value,
        valueType: typeof saved?.value,
        isArray: Array.isArray(saved?.value),
      });

      if (!saved) {
        return NextResponse.json({
          success: false,
          error: 'Save appeared to succeed but verification failed',
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Test department saved successfully',
        saved: {
          id: saved.id,
          key: saved.key,
          value: saved.value,
          valueType: typeof saved.value,
          isArray: Array.isArray(saved.value),
          updatedAt: saved.updatedAt,
        },
      });
    } catch (prismaError: any) {
      console.error('[Test Manual Save] Prisma error:', prismaError);
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: prismaError.message,
        code: prismaError.code,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[Test Manual Save] Error:', error);
    return NextResponse.json(
      { 
        error: error.message, 
        success: false,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

