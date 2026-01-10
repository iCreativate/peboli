import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

/**
 * Test endpoint to check if user is authenticated as admin
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    const isAuthenticated = !!session;
    const userEmail = session?.user?.email;
    const isAdmin = userEmail === 'admin@peboli.store';
    
    return NextResponse.json({
      authenticated: isAuthenticated,
      userEmail: userEmail || null,
      isAdmin: isAdmin,
      canSaveDepartments: isAdmin,
      message: isAdmin 
        ? '✅ You are authenticated as admin. You can save departments.'
        : !isAuthenticated
        ? '❌ You are not logged in. Please log in as admin@peboli.store'
        : `❌ You are logged in as ${userEmail}, but you need to be logged in as admin@peboli.store`,
      instructions: !isAdmin ? [
        '1. Go to /login',
        '2. Log in with email: admin@peboli.store',
        '3. Use your password or sign in with Google/Facebook if that email is linked',
        '4. Then try saving departments again',
      ] : [],
    });
  } catch (error: any) {
    return NextResponse.json({
      authenticated: false,
      error: error.message,
      message: 'Error checking session',
    }, { status: 500 });
  }
}

