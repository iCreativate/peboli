import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      redirect('/login?callbackUrl=/admin');
    }

    // Check if user has ADMIN role - use type assertion to access role
    const userRole = (session.user as any)?.role;
    
    // Log for debugging
    console.log('[Admin Layout] Session check:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userRole: userRole,
      expectedRole: 'ADMIN'
    });
    
    if (!userRole || userRole !== 'ADMIN') {
      // Redirect to unauthorized page instead of login to avoid redirect loops
      // This prevents redirect loops when user is logged in but not admin
      redirect('/admin/unauthorized');
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  } catch (error) {
    console.error('[Admin Layout] Error:', error);
    redirect('/login?callbackUrl=/admin');
  }
}
