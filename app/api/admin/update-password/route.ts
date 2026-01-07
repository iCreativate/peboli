import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile, readFile } from 'fs/promises';
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

async function savePassword(password: string): Promise<void> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const dataDir = path.join(process.cwd(), 'data');
    
    // Create data directory if it doesn't exist
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
    
    await fs.writeFile(ADMIN_PASSWORD_FILE, password, 'utf-8');
  } catch (error) {
    console.error('Error saving password:', error);
    // Fallback: try to update environment variable (but this won't persist)
    // In production, you'd want to use a database or secure storage
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in.', success: false },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      return NextResponse.json(
        { error: 'Only admin@peboli.store can change the password.', success: false },
        { status: 403 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required.', success: false },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.', success: false },
        { status: 400 }
      );
    }

    // Verify current password
    const currentAdminPassword = await getCurrentPassword();
    
    if (currentPassword !== currentAdminPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect.', success: false },
        { status: 401 }
      );
    }

    // Save new password
    await savePassword(newPassword);

    // Update environment variable (for current session)
    // Note: This won't persist across server restarts, but the file will
    process.env.ADMIN_PASSWORD = newPassword;

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully. Please note: You may need to update the ADMIN_PASSWORD environment variable in your deployment settings for persistence across restarts.'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the password.', success: false },
      { status: 500 }
    );
  }
}

