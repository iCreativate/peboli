import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user ? {
        email: session.user.email,
        name: session.user.name,
        id: (session.user as any)?.id,
        role: (session.user as any)?.role,
        vendorStatus: (session.user as any)?.vendorStatus,
        provider: (session.user as any)?.provider,
      } : null,
      sessionKeys: session ? Object.keys(session) : [],
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

