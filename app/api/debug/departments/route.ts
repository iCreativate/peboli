import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database connection
    let dbConnected = false;
    try {
      await prisma.$connect();
      dbConnected = true;
    } catch (e) {
      console.error('Database connection failed:', e);
    }

    const setting = await prisma.setting.findUnique({
      where: { key: 'departments' },
    });

    // Also check all settings to see if any exist
    const allSettings = await prisma.setting.findMany({
      take: 10,
    });

    return NextResponse.json({
      dbConnected,
      found: !!setting,
      rawValue: setting?.value,
      valueType: typeof setting?.value,
      isArray: Array.isArray(setting?.value),
      parsed: setting?.value ? (typeof setting?.value === 'string' ? JSON.parse(setting.value as string) : setting.value) : null,
      createdAt: setting?.createdAt,
      updatedAt: setting?.updatedAt,
      allSettingsCount: allSettings.length,
      allSettingsKeys: allSettings.map(s => s.key),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      name: error.name,
    }, { status: 500 });
  }
}

