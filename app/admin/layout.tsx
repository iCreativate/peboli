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

    // Check if user email is admin@peboli.store
    const userEmail = session.user.email;
    
    if (!userEmail || userEmail !== 'admin@peboli.store') {
      // Redirect to unauthorized page
      redirect('/admin/unauthorized');
    }

    // No password verification required - user just needs to be logged in as admin@peboli.store
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
  } catch (error) {
    console.error('[Admin Layout] Error:', error);
    redirect('/login?callbackUrl=/admin');
  }
}
