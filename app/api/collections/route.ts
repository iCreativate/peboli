import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTING_KEY = 'collections';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (setting && setting.value) {
      return NextResponse.json(setting.value as Array<{ id: string; name: string; href: string; color?: string }>);
    }

    // Return default collections if not found
    return NextResponse.json([
      { id: 'new-arrivals', name: 'New Arrivals', href: '/new' },
      { id: 'christmas', name: 'Christmas', href: '/christmas' },
      { id: 'summer', name: 'Summer', href: '/summer' },
      { id: 'deals', name: 'Deals & Promotions', href: '/deals' },
      { id: 'liquor', name: 'Festive Liquor', href: '/liquor' },
      { id: 'brands', name: 'Brands Store', href: '/brands' },
      { id: 'splash', name: 'PeboliSPLASH', href: '/more', color: '#db2777' },
      { id: 'clearance', name: 'Clearance', href: '/clearance' },
    ]);
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}
