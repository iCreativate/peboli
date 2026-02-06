import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const HERO_SETTINGS_KEY = 'hero_settings';

const DEFAULT_HERO = {
  title: 'Best deals. Zero hassle.',
  subtitle: 'Discover premium picks and splash sales across top categories.',
  imageUrls: [],
  ctaLabel: 'Shop Now',
  ctaHref: '/deals',
};

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: HERO_SETTINGS_KEY },
    });

    if (!setting) {
      return NextResponse.json(DEFAULT_HERO);
    }

    return NextResponse.json(setting.value);
  } catch (error) {
    console.error('Failed to fetch hero settings:', error);
    return NextResponse.json(DEFAULT_HERO, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate body structure if needed, or trust admin input for now
    const value = {
      title: body.title || DEFAULT_HERO.title,
      subtitle: body.subtitle || DEFAULT_HERO.subtitle,
      imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls : [],
      ctaLabel: body.ctaLabel || DEFAULT_HERO.ctaLabel,
      ctaHref: body.ctaHref || DEFAULT_HERO.ctaHref,
    };

    const setting = await prisma.setting.upsert({
      where: { key: HERO_SETTINGS_KEY },
      update: { value },
      create: {
        key: HERO_SETTINGS_KEY,
        value,
      },
    });

    return NextResponse.json(setting.value);
  } catch (error) {
    console.error('Failed to save hero settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
