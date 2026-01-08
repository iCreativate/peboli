'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Store, 
  Tag, 
  LayoutDashboard, 
  Settings, 
  ShieldCheck, 
  LogOut,
  Bell,
  Package,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Vendor Approvals', href: '/admin/vendors', icon: Store },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Orders', href: '/admin/orders', icon: Package },
  { name: 'Deal Moderation', href: '/admin/deals', icon: Tag },
  { name: 'Banking', href: '/admin/banking', icon: CreditCard },
  { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className={cn("w-64 bg-white/80 backdrop-blur border-r border-gray-100 shadow-sm min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">A</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Admin Console</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-500">
              <span className="sr-only">Close sidebar</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-900/10 ring-1 ring-gray-900/10" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-700")} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gray-50">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Super Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@peboli.store</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
