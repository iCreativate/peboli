'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldX, Home, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth';

export default function UnauthorizedPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access the admin dashboard. Only administrators can view this page.
        </p>
        
        {user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Logged in as:</span> {user.email}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Role:</span> {(user as any).role || 'Not set'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              To access the admin dashboard, you need to log in with an account that has the ADMIN role.
              Use <span className="font-mono font-semibold">admin@peboli.store</span> to log in as an administrator.
            </p>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          {!user ? (
            <Button asChild className="w-full">
              <Link href="/login?callbackUrl=/admin">
                <LogIn className="h-4 w-4 mr-2" />
                Login as Admin
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href="/login?callbackUrl=/admin">
                <LogIn className="h-4 w-4 mr-2" />
                Switch Account
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Link>
          </Button>
          {user && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/account">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

