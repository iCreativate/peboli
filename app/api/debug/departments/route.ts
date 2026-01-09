import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'departments' },
    });

    return NextResponse.json({
      found: !!setting,
      rawValue: setting?.value,
      valueType: typeof setting?.value,
      isArray: Array.isArray(setting?.value),
      parsed: setting?.value ? (typeof setting?.value === 'string' ? JSON.parse(setting.value) : setting.value) : null,
      createdAt: setting?.createdAt,
      updatedAt: setting?.updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

