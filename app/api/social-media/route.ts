import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTING_KEY = 'social_media';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });
    
    const socialMedia = setting?.value || {};
    
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    return NextResponse.json({ 
      success: true,
      socialMedia 
    }, { headers });
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json(
      { error: 'An error occurred.', success: false },
      { status: 500 }
    );
  }
}
