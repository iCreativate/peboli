import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const SOCIAL_MEDIA_FILE = join(process.cwd(), 'data', 'social-media.json');

async function ensureDataDir() {
  try {
    const dataDir = join(process.cwd(), 'data');
    await mkdir(dataDir, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

async function getSocialMedia(): Promise<Record<string, string>> {
  try {
    await ensureDataDir();
    const content = await readFile(SOCIAL_MEDIA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function saveSocialMedia(socialMedia: Record<string, string>): Promise<void> {
  try {
    await ensureDataDir();
    await writeFile(SOCIAL_MEDIA_FILE, JSON.stringify(socialMedia, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving social media:', error);
    throw error;
  }
}

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

    const socialMedia = await getSocialMedia();
    
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

    await saveSocialMedia(socialMedia);

    return NextResponse.json({ 
      success: true,
      message: 'Social media handles updated successfully.'
    });
  } catch (error) {
    console.error('Error updating social media:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating social media.', success: false },
      { status: 500 }
    );
  }
}

