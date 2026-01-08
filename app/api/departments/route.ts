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

    if (setting && setting.value) {
      return NextResponse.json(setting.value as Array<{ name: string; slug: string }>, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    // Return default departments if not found
    return NextResponse.json([
      { name: 'Appliances', slug: 'appliances' },
      { name: 'Automotive & DIY', slug: 'automotive-diy' },
      { name: 'Baby & Toddler', slug: 'baby-toddler' },
      { name: 'Beauty', slug: 'beauty' },
      { name: 'Books & Courses', slug: 'books-courses' },
      { name: 'Camping & Outdoor', slug: 'camping-outdoor' },
      { name: 'Clothing & Shoes', slug: 'clothing-shoes' },
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Gaming & Media', slug: 'gaming-media' },
      { name: 'Garden, Pool & Patio', slug: 'garden-pool-patio' },
      { name: 'Groceries & Household', slug: 'groceries-household' },
      { name: 'Health & Personal Care', slug: 'health-personal-care' },
      { name: 'Homeware', slug: 'homeware' },
      { name: 'Liquor', slug: 'liquor' },
      { name: 'Office & Stationery', slug: 'office-stationery' },
      { name: 'Pets', slug: 'pets' },
      { name: 'Sport & Training', slug: 'sport-training' },
      { name: 'Toys', slug: 'toys' },
    ], {
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

