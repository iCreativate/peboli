'use client';

import { useState } from 'react';
import { Database, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SystemSettings() {
  const [cleared, setCleared] = useState(false);

  const clearLocal = () => {
    localStorage.removeItem('peboli_admin');
    localStorage.removeItem('peboli_cart');
    localStorage.removeItem('peboli_wishlist');
    localStorage.removeItem('peboli_admin_auth');
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">System Tools</h2>
        <p className="mt-1 text-sm text-gray-500">
          Developer tools and local environment configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Local Storage</h3>
              <p className="mt-1 text-sm text-gray-500">
                Data is currently persisted in browser localStorage.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Security</h3>
              <p className="mt-1 text-sm text-gray-500">
                Admin access is currently gated by a client-side passcode.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div>
            <h3 className="font-bold text-red-900">Reset Local Environment</h3>
            <p className="mt-1 text-sm text-red-700/80 max-w-md">
              This will clear all admin settings, cart data, wishlist items, and authentication tokens stored in this browser.
            </p>
          </div>
          <Button 
            onClick={clearLocal} 
            variant="destructive" 
            className="bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Data
          </Button>
        </div>
        {cleared && (
          <div className="mt-3 p-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg inline-block px-3 animate-in fade-in slide-in-from-bottom-1">
            ✓ Local storage cleared successfully.
          </div>
        )}
      </div>
    </div>
  );
}
