import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const adminPasswordVerified = cookieStore.get('admin_password_verified');
    
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user ? {
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role,
      } : null,
      adminPasswordVerified: adminPasswordVerified?.value === 'true',
      allCookies: Object.fromEntries(
        cookieStore.getAll().map(c => [c.name, c.value])
      ),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      hasSession: false,
    }, { status: 500 });
  }
}

