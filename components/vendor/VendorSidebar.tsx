'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Settings, LogOut, Rocket, Wallet, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { name: 'Overview', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/vendor/dashboard/products', icon: Package },
  { name: 'Orders', href: '/vendor/dashboard/orders', icon: ShoppingBag },
  { name: 'Notifications', href: '/vendor/dashboard/notifications', icon: Bell },
  { name: 'Analytics', href: '/vendor/dashboard/analytics', icon: BarChart3 },
  { name: 'Marketing', href: '/vendor/dashboard/marketing', icon: Rocket },
  { name: 'Wallet', href: '/vendor/dashboard/wallet', icon: Wallet },
  { name: 'Settings', href: '/vendor/dashboard/settings', icon: Settings },
];

export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white/80 backdrop-blur border-r border-gray-100 shadow-sm min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">V</div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Vendor Portal</span>
        </div>

        <nav className="space-y-1">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
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
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">JD</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@peboli.com</p>
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
