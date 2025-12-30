'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, X, Chrome, Facebook, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/lib/stores/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 2FA State
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const canSubmit = useMemo(() => {
    if (twoFactorStep) return twoFactorCode.length === 6;
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password, twoFactorStep, twoFactorCode]);

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (submitting || socialLoading) return;
    setSocialLoading(provider);
    try {
      await new Promise((r) => setTimeout(r, 800));
      
      // Simulate successful social login
      const mockUser = {
        id: `${provider}-${Date.now()}`,
        name: provider === 'google' ? 'Google User' : 'Facebook User',
        email: `user@${provider}.com`,
        role: 'BUYER',
      };
      
      login(mockUser);
      router.push('/account');
    } finally {
      setSocialLoading(null);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        code: twoFactorStep ? twoFactorCode : undefined
      });

      if (result?.error) {
        if (result.error === '2FA_REQUIRED') {
            setTwoFactorStep(true);
            // Don't stop loading? No, we need to let user input code.
            return;
        }
        throw new Error(result.error);
      }

      // Fetch session to update client store
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      
      if (sessionData?.user) {
        login(sessionData.user);
        router.push(callbackUrl);
        router.refresh();
      } else {
        throw new Error('Failed to retrieve session');
      }
    } catch (err: any) {
        setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 premium-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.10),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(255,107,74,0.10),transparent_45%)]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative container mx-auto px-4 lg:px-6 py-10 md:py-14">
          <div className="max-w-md mx-auto">
            <div className="rounded-3xl border border-white/15 bg-white/90 backdrop-blur-xl premium-shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-black text-[#1A1D29]">Login</h1>
                  <p className="text-xs text-[#8B95A5] mt-0.5">Welcome back to PEBOLI</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-[#1A1D29]" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="h-11 rounded-xl bg-white relative"
                    onClick={() => handleSocialLogin('google')}
                    disabled={submitting || !!socialLoading}
                  >
                    {socialLoading === 'google' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Chrome className="h-4 w-4 mr-2" />
                        Google
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-11 rounded-xl bg-white relative"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={submitting || !!socialLoading}
                  >
                    {socialLoading === 'facebook' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </>
                    )}
                  </Button>
                </div>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <div className="text-xs font-semibold text-[#8B95A5]">OR</div>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  {error && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                          {error}
                      </div>
                  )}

                  {!twoFactorStep ? (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-[#1A1D29]">Email address</label>
                        <div className="mt-2 relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            className="h-11 rounded-xl pl-10 bg-white"
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-[#1A1D29]">Password</label>
                        <div className="mt-2 relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                          <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="h-11 rounded-xl pl-10 pr-10 bg-white"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-[#8B95A5]" />
                            ) : (
                              <Eye className="h-4 w-4 text-[#8B95A5]" />
                            )}
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-[#8B95A5]">Forgot password? (coming soon)</span>
                          <Link href="/help" className="text-xs font-semibold text-[#0B1220] hover:underline">
                            Need help
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <label className="text-sm font-semibold text-[#1A1D29]">Two-Factor Authentication Code</label>
                      <div className="mt-2 relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                        <Input
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          type="text"
                          placeholder="123456"
                          className="h-11 rounded-xl pl-10 bg-white text-center tracking-[0.5em] font-mono text-lg"
                          autoFocus
                          maxLength={6}
                        />
                      </div>
                      <p className="mt-2 text-xs text-[#8B95A5] text-center">
                        Enter the 6-digit code from your authenticator app.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="w-full h-11 rounded-xl premium-gradient text-white font-bold"
                  >
                    {submitting ? 'Verifying...' : (twoFactorStep ? 'Verify Code' : 'Login')}
                  </Button>

                  {twoFactorStep && (
                    <button 
                      type="button" 
                      onClick={() => { setTwoFactorStep(false); setSubmitting(false); setError(null); }}
                      className="w-full text-sm text-[#8B95A5] hover:text-[#1A1D29] mt-2"
                    >
                      Back to Login
                    </button>
                  )}

                  {!twoFactorStep && (
                    <div className="text-center text-sm text-[#8B95A5]">
                      New to PEBOLI?{' '}
                      <Link href="/register" className="font-bold text-[#0B1220] hover:underline">
                        Register
                      </Link>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-white/70">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-2">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
