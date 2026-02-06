'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">A</div>
           <span className="font-bold text-lg text-gray-900">Admin Console</span>
        </div>
        <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="absolute top-0 bottom-0 left-0 w-64 bg-white border-r border-gray-100 animate-in slide-in-from-left duration-300">
             <AdminSidebar 
                className="!relative !h-full !w-full border-r-0" 
                onClose={() => setSidebarOpen(false)}
             /> 
          </div>
        </div>
      )}

      <main className="flex-1 lg:pl-0 pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
