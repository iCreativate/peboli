import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  console.log('[Admin Layout] Checking session:', session?.user?.email, session?.user?.role);

  if (!session || session.user.role !== 'ADMIN') {
    console.log('[Admin Layout] Redirecting to login');
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <main className="flex-1 lg:pl-0">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
