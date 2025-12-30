import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEYWORDS: Record<string, string> = {
  phone: 'electronics',
  smartphone: 'electronics',
  tv: 'electronics',
  television: 'electronics',
  laptop: 'electronics',
  sneakers: 'fashion',
  shoes: 'fashion',
  dress: 'fashion',
  skincare: 'beauty',
  makeup: 'beauty',
  fridge: 'home',
  freezer: 'home',
  blender: 'home',
  pram: 'baby',
  stroller: 'baby',
  dumbbell: 'sports',
  treadmill: 'sports',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    if (!q) return NextResponse.json({ normalizedQuery: '', suggestions: [] });

    let normalizedQuery = q;
    for (const [k, v] of Object.entries(KEYWORDS)) {
      if (q.includes(k)) {
        normalizedQuery = v;
        break;
      }
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { brand: { contains: q } },
        ],
      },
      take: 5,
      select: { id: true, name: true, brand: true },
    });

    const suggestions = products.map((p) => ({
      id: p.id,
      title: p.name,
      subtitle: p.brand,
    }));

    return NextResponse.json({ normalizedQuery, suggestions });
  } catch (error) {
    return NextResponse.json({ normalizedQuery: '', suggestions: [] });
  }
}
