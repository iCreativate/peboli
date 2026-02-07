import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Check the connection status between admin console and frontend
 */
export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'departments' },
    });

    const hasData = !!setting && setting.value !== null && setting.value !== undefined;
    
    let departments: Array<{ name: string; slug: string }> = [];
    if (hasData) {
      if (Array.isArray(setting.value)) {
        departments = setting.value as unknown as Array<{ name: string; slug: string }>;
      } else if (typeof setting.value === 'string') {
        try {
          departments = JSON.parse(setting.value);
        } catch (e) {
          // Ignore parse errors
        }
      }
    }

    return NextResponse.json({
      connected: true,
      database: {
        hasSetting: !!setting,
        hasData: hasData,
        departmentsCount: departments.length,
        lastUpdated: setting?.updatedAt,
      },
      endpoints: {
        adminSave: '/api/admin/departments (PUT) - Save departments from admin console',
        adminGet: '/api/admin/departments (GET) - Get departments in admin console',
        publicGet: '/api/departments (GET) - Get departments for frontend',
      },
      frontend: {
        component: 'components/home/ShopByDepartment.tsx',
        refreshInterval: '5 seconds',
        eventListeners: ['departmentsUpdated', 'storage'],
      },
      status: hasData && departments.length > 0 
        ? '✅ Connected - Departments are saved and available'
        : hasData && departments.length === 0
        ? '⚠️ Connected but no departments saved yet'
        : '❌ Not connected - No departments setting found in database',
      instructions: !hasData ? [
        '1. Go to Admin Console → Platform Configuration → Departments',
        '2. Add a department (e.g., Name: "Toys", Slug: "toys")',
        '3. Click "Save Changes"',
        '4. Check this endpoint again to verify connection',
      ] : [],
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message,
    }, { status: 500 });
  }
}

