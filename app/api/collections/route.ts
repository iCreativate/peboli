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

    console.log('[API /api/collections] Setting found:', !!setting);
    if (setting) {
      console.log('[API /api/collections] Setting value:', JSON.stringify(setting.value));
    }

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (setting && setting.value) {
      const collections = setting.value as Array<{ id: string; name: string; href: string; color?: string }>;
      console.log('[API /api/collections] Returning', collections.length, 'collections from database');
      return NextResponse.json(collections, { headers });
    }

    // Return empty array if not found (no defaults)
    console.log('[API /api/collections] No setting found, returning empty array');
    return NextResponse.json([], { headers });
      { id: 'new-arrivals', name: 'New Arrivals', href: '/new' },
      { id: 'christmas', name: 'Christmas', href: '/christmas' },
      { id: 'summer', name: 'Summer', href: '/summer' },
      { id: 'deals', name: 'Deals & Promotions', href: '/deals' },
      { id: 'liquor', name: 'Festive Liquor', href: '/liquor' },
      { id: 'brands', name: 'Brands Store', href: '/brands' },
      { id: 'splash', name: 'PeboliSPLASH', href: '/more', color: '#db2777' },
      { id: 'clearance', name: 'Clearance', href: '/clearance' },
    ], { headers });
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}
