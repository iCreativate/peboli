import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    // Get session - in App Router, getServerSession should work with authOptions
    const session = await getServerSession(authOptions);
    
    // Also check cookies directly for debugging
    const cookieStore = await cookies();
    const nextAuthSession = cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token');
    
    console.log('[Admin Layout] Session check:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      hasCookie: !!nextAuthSession,
      cookieName: nextAuthSession?.name,
    });
    
    // Check if user is authenticated
    if (!session || !session.user) {
      console.log('[Admin Layout] No session found, redirecting to login');
      redirect('/login?callbackUrl=/admin');
    }

    // Check if user email is admin@peboli.store
    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      console.log('[Admin Layout] User email mismatch:', userEmail, 'expected: admin@peboli.store');
      // Redirect to unauthorized page
      redirect('/admin/unauthorized');
    }

    // No password verification required - user just needs to be logged in as admin@peboli.store
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  } catch (error: any) {
    console.error('[Admin Layout] Error:', error);
    console.error('[Admin Layout] Error message:', error.message);
    console.error('[Admin Layout] Error stack:', error.stack);
    redirect('/login?callbackUrl=/admin');
  }
}
