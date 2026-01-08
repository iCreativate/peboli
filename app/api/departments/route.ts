import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTING_KEY = 'departments';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    console.log('[API /api/departments] Setting found:', !!setting);
    if (setting) {
      console.log('[API /api/departments] Setting value:', JSON.stringify(setting.value));
    }

    if (setting && setting.value) {
      const departments = setting.value as Array<{ name: string; slug: string }>;
      console.log('[API /api/departments] Returning', departments.length, 'departments from database');
      return NextResponse.json(departments, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    // Return empty array if not found (no defaults)
    console.log('[API /api/departments] No setting found, returning empty array');
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

