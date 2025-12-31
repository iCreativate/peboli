import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  console.log('[Admin Layout] Checking session:', session?.user?.email, session?.user?.role);

  if (!session || session.user.role !== 'ADMIN') {
    console.log('[Admin Layout] Redirecting to login');
    redirect('/login?callbackUrl=/admin');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
