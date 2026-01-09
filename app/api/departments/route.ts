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

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    console.log('[API /api/departments] Setting found:', setting ? 'yes' : 'no');
    
    if (setting && setting.value) {
      // Prisma JSON fields might need parsing
      let departments: Array<{ name: string; slug: string }>;
      if (typeof setting.value === 'string') {
        try {
          departments = JSON.parse(setting.value);
        } catch (e) {
          console.error('[API /api/departments] Failed to parse JSON string:', e);
          departments = [];
        }
      } else if (Array.isArray(setting.value)) {
        departments = setting.value as Array<{ name: string; slug: string }>;
      } else {
        console.error('[API /api/departments] Unexpected value type:', typeof setting.value);
        departments = [];
      }
      
      console.log('[API /api/departments] Returning departments:', departments);
      console.log('[API /api/departments] Departments count:', departments.length);
      console.log('[API /api/departments] Raw setting value:', setting.value);
      console.log('[API /api/departments] Setting value type:', typeof setting.value);
      
      if (departments.length > 0) {
        return NextResponse.json(departments, { headers });
      }
    }

    // Return empty array if not found (no mock data)
    console.log('[API /api/departments] No setting found, returning empty array');
    return NextResponse.json([], { headers });
  } catch (error: any) {
    console.error('[API /api/departments] Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

