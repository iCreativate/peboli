import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Test database connection and Setting model
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // Test 1: Database Connection
  try {
    await prisma.$connect();
    results.tests.databaseConnection = { status: 'success', message: 'Connected to database' };
  } catch (error: any) {
    results.tests.databaseConnection = { 
      status: 'failed', 
      message: error.message,
      error: error.toString(),
    };
    return NextResponse.json(results, { status: 500 });
  }

  // Test 2: Check if Setting table exists (by trying to query it)
  try {
    const count = await prisma.setting.count();
    results.tests.settingTableExists = { 
      status: 'success', 
      message: 'Setting table exists',
      recordCount: count,
    };
  } catch (error: any) {
    results.tests.settingTableExists = { 
      status: 'failed', 
      message: 'Setting table does not exist or is not accessible',
      error: error.message,
      hint: 'Run: npx prisma db push or npx prisma migrate dev',
    };
  }

  // Test 3: Try to create a test setting
  try {
    const testKey = `__test_${Date.now()}`;
    const testSetting = await prisma.setting.upsert({
      where: { key: testKey },
      update: { value: { test: true } },
      create: {
        key: testKey,
        value: { test: true },
      },
    });
    
    // Clean up test setting
    await prisma.setting.delete({ where: { key: testKey } });
    
    results.tests.settingCreate = { 
      status: 'success', 
      message: 'Can create and delete settings',
    };
  } catch (error: any) {
    results.tests.settingCreate = { 
      status: 'failed', 
      message: error.message,
      error: error.toString(),
      code: error.code,
    };
  }

  // Test 4: Try to query departments setting
  try {
    const departments = await prisma.setting.findUnique({
      where: { key: 'departments' },
    });
    results.tests.departmentsQuery = { 
      status: 'success', 
      message: departments ? 'Departments setting exists' : 'Departments setting does not exist',
      exists: !!departments,
      value: departments?.value,
    };
  } catch (error: any) {
    results.tests.departmentsQuery = { 
      status: 'failed', 
      message: error.message,
      error: error.toString(),
    };
  }

  // Test 5: Check DATABASE_URL
  results.environment = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
  };

  const allPassed = Object.values(results.tests).every((test: any) => test.status === 'success');
  
  return NextResponse.json({
    ...results,
    overall: allPassed ? 'success' : 'failed',
    recommendations: allPassed ? [] : [
      'If Setting table does not exist, run: npx prisma db push',
      'If database connection fails, check DATABASE_URL environment variable',
      'If create fails, check database permissions',
    ],
  }, { status: allPassed ? 200 : 500 });
}

