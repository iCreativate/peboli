'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Chrome, Facebook, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';

export function LoginModal() {
  const router = useRouter();
  const { isLoginOpen, closeLogin, openRegister } = useUIStore();
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
  const [tempUserId, setTempUserId] = useState<string | null>(null);

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
      closeLogin();
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
      if (twoFactorStep && tempUserId) {
        // Step 2: Verify 2FA
        const res = await fetch('/api/auth/2fa/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: tempUserId, token: twoFactorCode }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Invalid 2FA code');
        }

        login(data.user);
        closeLogin();
        router.push('/account');

      } else {
        // Step 1: Login with Email/Password
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Login failed');
        }

        if (data.require2fa) {
          setTwoFactorStep(true);
          setTempUserId(data.userId);
        } else {
          login(data.user);
          closeLogin();
          router.push('/account');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isLoginOpen} onClose={closeLogin}>
      <div className="relative overflow-hidden bg-white">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
        
        <div className="px-8 pt-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {twoFactorStep ? 'Two-Factor Authentication' : 'Welcome back'}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {twoFactorStep 
                ? 'Enter the 6-digit code from your authenticator app'
                : 'Sign in to access your orders, wishlist and more'
              }
            </p>
          </div>

          {!twoFactorStep && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                onClick={() => handleSocialLogin('google')}
                disabled={submitting || !!socialLoading}
              >
                {socialLoading === 'google' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : (
                  <>
                    <Chrome className="h-5 w-5 mr-2 text-gray-700" />
                    <span className="text-gray-700 font-medium">Google</span>
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="h-12 rounded-xl bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                onClick={() => handleSocialLogin('facebook')}
                disabled={submitting || !!socialLoading}
              >
                {socialLoading === 'facebook' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : (
                  <>
                    <Facebook className="h-5 w-5 mr-2 text-[#1877F2]" />
                    <span className="text-gray-700 font-medium">Facebook</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {!twoFactorStep && (
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-medium tracking-wider">Or continue with</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {twoFactorStep ? (
              // 2FA Input
              <div className="space-y-2">
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="h-12 pl-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all duration-200 text-lg tracking-widest font-mono"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    disabled={submitting}
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              // Login Inputs
              <>
                <div className="space-y-2">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="h-12 pl-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative group">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="h-12 pl-4 pr-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200"
              disabled={!canSubmit || submitting}
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center">
                  {twoFactorStep ? 'Verify' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            {twoFactorStep ? (
              <button
                onClick={() => setTwoFactorStep(false)}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Back to Login
              </button>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    closeLogin();
                    openRegister();
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </Modal>
  );
}
