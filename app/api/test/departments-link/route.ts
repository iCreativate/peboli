import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Test endpoint to verify the connection between admin console and frontend
 * This endpoint tests:
 * 1. Database connection
 * 2. Setting retrieval
 * 3. Data format
 */
export async function GET() {
  try {
    // Test database connection
    let dbConnected = false;
    try {
      await prisma.$connect();
      dbConnected = true;
    } catch (e: any) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: e.message,
      }, { status: 500 });
    }

    // Test setting retrieval
    const setting = await prisma.setting.findUnique({
      where: { key: 'departments' },
    });

    // Test public API endpoint format
    const publicApiFormat = setting?.value 
      ? (Array.isArray(setting.value) ? setting.value : [])
      : [];

    // Test admin API endpoint format
    const adminApiFormat = setting?.value
      ? { success: true, departments: setting.value }
      : { success: true, departments: [] };

    return NextResponse.json({
      success: true,
      connectionStatus: {
        database: dbConnected ? 'connected' : 'disconnected',
        settingExists: !!setting,
        dataFormat: {
          publicApi: Array.isArray(publicApiFormat) ? 'correct' : 'incorrect',
          adminApi: adminApiFormat.success ? 'correct' : 'incorrect',
        },
      },
      data: {
        found: !!setting,
        count: Array.isArray(setting?.value) ? setting.value.length : 0,
        sample: Array.isArray(setting?.value) && setting.value.length > 0
          ? setting.value[0]
          : null,
      },
      endpoints: {
        adminSave: '/api/admin/departments (PUT)',
        adminGet: '/api/admin/departments (GET)',
        publicGet: '/api/departments (GET)',
        frontendComponent: 'components/home/ShopByDepartment.tsx',
      },
      instructions: {
        step1: 'Go to Admin Console → Platform Configuration → Departments',
        step2: 'Add a department (e.g., Name: "Toys", Slug: "toys")',
        step3: 'Click "Save Changes" button',
        step4: 'Check this endpoint again to verify data was saved',
        step5: 'Visit the landing page to see departments displayed',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

