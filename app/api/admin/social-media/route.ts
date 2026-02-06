import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const SETTING_KEY = 'social_media';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can access this.', success: false },
        { status: 403 }
      );
    }

    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });
    
    const socialMedia = setting?.value || {};
    
    return NextResponse.json({ 
      success: true,
      socialMedia 
    });
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json(
      { error: 'An error occurred.', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can update social media.', success: false },
        { status: 403 }
      );
    }

    const { socialMedia } = await request.json();

    if (!socialMedia || typeof socialMedia !== 'object') {
      return NextResponse.json(
        { error: 'Invalid social media data.', success: false },
        { status: 400 }
      );
    }

    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: { value: socialMedia },
      create: { key: SETTING_KEY, value: socialMedia },
    });

    return NextResponse.json({
      success: true,
      message: 'Social media settings updated successfully.'
    });

  } catch (error) {
    console.error('Error updating social media:', error);
    return NextResponse.json(
      { error: 'An error occurred.', success: false },
      { status: 500 }
    );
  }
}
