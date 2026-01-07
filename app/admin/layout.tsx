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
      redirect('/login?callbackUrl=/admin');
    }

    // Simplified: Check if user email is admin@peboli.store
    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      // Redirect to unauthorized page
      redirect('/admin/unauthorized');
    }

    // Check if admin password is verified
    const cookieStore = await cookies();
    const adminPasswordVerified = cookieStore.get('admin_password_verified');
    
    if (!adminPasswordVerified || adminPasswordVerified.value !== 'true') {
      // Redirect to admin password page
      redirect('/admin/password?callbackUrl=/admin');
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  } catch (error) {
    console.error('[Admin Layout] Error:', error);
    redirect('/login?callbackUrl=/admin');
  }
}
