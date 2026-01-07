import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      console.log('[Admin Layout] No session found, redirecting to login');
      redirect('/login?callbackUrl=/admin');
    }

    // Simplified: Check if user email is admin@peboli.store
    const userEmail = session.user.email;
    console.log('[Admin Layout] User email:', userEmail);
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      console.log('[Admin Layout] User is not admin, redirecting to unauthorized');
      // Redirect to unauthorized page
      redirect('/admin/unauthorized');
    }

    // Check if admin password is verified
    const cookieStore = await cookies();
    const adminPasswordVerified = cookieStore.get('admin_password_verified');
    console.log('[Admin Layout] Password verified:', adminPasswordVerified?.value === 'true');
    
    if (!adminPasswordVerified || adminPasswordVerified.value !== 'true') {
      console.log('[Admin Layout] Password not verified, redirecting to password page');
      // Redirect to admin password page
      redirect('/admin/password?callbackUrl=/admin');
    }

    console.log('[Admin Layout] All checks passed, rendering admin layout');
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  } catch (error) {
    console.error('[Admin Layout] Error:', error);
    redirect('/login?callbackUrl=/admin');
  }
}
