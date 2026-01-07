import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { cookies } from 'next/headers';
import { readFile } from 'fs/promises';
import { join } from 'path';

const ADMIN_PASSWORD_FILE = join(process.cwd(), 'data', 'admin-password.txt');
const DEFAULT_PASSWORD = 'admin123';

async function getCurrentPassword(): Promise<string> {
  try {
    const password = await readFile(ADMIN_PASSWORD_FILE, 'utf-8');
    return password.trim() || process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  } catch {
    return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  }
}

export async function POST(request: Request) {
  try {
    // First check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to access the admin area.', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can access this area.', success: false },
        { status: 403 }
      );
    }

    // Get password from request
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required.', success: false },
        { status: 400 }
      );
    }

    // Get current password (from file or env or default)
    const currentPassword = await getCurrentPassword();

    // Verify password
    if (password !== currentPassword) {
      return NextResponse.json(
        { error: 'Invalid password.', success: false },
        { status: 401 }
      );
    }

    // Set admin password verified cookie (expires in 24 hours)
    const cookieStore = await cookies();
    cookieStore.set('admin_password_verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/admin',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return NextResponse.json(
      { error: 'An error occurred while verifying the password.', success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const verified = cookieStore.get('admin_password_verified');
    
    return NextResponse.json({ 
      verified: verified?.value === 'true' 
    });
  } catch (error) {
    return NextResponse.json({ verified: false });
  }
}

