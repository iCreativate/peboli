import { VendorSidebar } from '@/components/vendor/VendorSidebar';

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <VendorSidebar />
      </div>
      <main className="flex-1 lg:pl-0">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
