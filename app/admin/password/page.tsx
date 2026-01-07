'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function AdminPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to the admin page or the callback URL
        const callbackUrl = searchParams.get('callbackUrl') || '/admin';
        router.push(callbackUrl);
      } else {
        setError(data.error || 'Invalid password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-gray-100 premium-shadow overflow-hidden">
            <div className="p-8 md:p-10 premium-gradient">
              <div className="text-center">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  Admin Password
                </h1>
                <p className="mt-3 text-white/75">
                  Enter the admin password to access the dashboard
                </p>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#1A1D29] mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Admin Password
                    </div>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      error ? 'border-red-300' : 'border-gray-200'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                    placeholder="Enter admin password"
                    autoFocus
                    disabled={loading}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !password.trim()}
                  className="w-full h-12 rounded-xl premium-gradient text-white font-semibold shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Access Admin Dashboard'}
                </Button>

                <div className="text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1A1D29] transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Homepage
                  </Link>
                </div>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs text-blue-800">
                  <strong>Security Note:</strong> This is an additional layer of security. You must be logged in as{' '}
                  <span className="font-mono">admin@peboli.store</span> and provide the admin password to access the dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

