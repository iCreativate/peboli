/**
 * Manual script to fix database schema
 * Run this locally: npx ts-node scripts/fix-database.ts
 * Or on Vercel: Add as a build command
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database connection...');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Check if Setting table exists by trying to query it
    try {
      const count = await prisma.setting.count();
      console.log(`✅ Setting table exists (${count} records)`);
    } catch (error: any) {
      console.error('❌ Setting table does not exist!');
      console.error('Error:', error.message);
      console.log('\n📋 To fix this, run one of:');
      console.log('  1. npx prisma db push (for development)');
      console.log('  2. npx prisma migrate deploy (for production)');
      console.log('  3. Check Vercel build logs to ensure migrations run');
      process.exit(1);
    }
    
    // Test creating a setting
    const testKey = `__test_${Date.now()}`;
    try {
      await prisma.setting.upsert({
        where: { key: testKey },
        update: { value: { test: true } },
        create: {
          key: testKey,
          value: { test: true },
        },
      });
      console.log('✅ Can create settings');
      
      // Clean up
      await prisma.setting.delete({ where: { key: testKey } });
      console.log('✅ Can delete settings');
    } catch (error: any) {
      console.error('❌ Cannot create/update settings');
      console.error('Error:', error.message);
      process.exit(1);
    }
    
    // Check departments setting
    const departments = await prisma.setting.findUnique({
      where: { key: 'departments' },
    });
    
    if (departments) {
      console.log('✅ Departments setting exists');
      console.log('   Value:', JSON.stringify(departments.value, null, 2));
    } else {
      console.log('⚠️  Departments setting does not exist (this is OK if you haven\'t saved any yet)');
    }
    
    console.log('\n✅ All database checks passed!');
    
  } catch (error: any) {
    console.error('❌ Database error:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.log('  1. Check DATABASE_URL environment variable');
    console.log('  2. Ensure database is accessible');
    console.log('  3. Run: npx prisma db push');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

