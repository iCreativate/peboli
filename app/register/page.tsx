'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, X, Chrome, Facebook, Lock, Mail, User, Phone, Loader2 } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/stores/auth';

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  const canSubmit = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      password.trim().length >= 8
    );
  }, [firstName, lastName, email, phone, password]);

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (submitting || socialLoading) return;
    
    setSocialLoading(provider);
    try {
      // Simulate network delay for social auth
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
    try {
      await new Promise((r) => setTimeout(r, 650));
      router.push('/account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 premium-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.10),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_55%,rgba(0,196,140,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative container mx-auto px-4 lg:px-6 py-10 md:py-14">
          <div className="max-w-lg mx-auto">
            <div className="rounded-3xl border border-white/15 bg-white/90 backdrop-blur-xl premium-shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-black text-[#1A1D29]">Register</h1>
                  <p className="text-xs text-[#8B95A5] mt-0.5">Create your PEBOLI account</p>
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
                <div className="grid grid-cols-2 gap-4">
                  <Button 
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#1A1D29]">First name</label>
                      <div className="mt-2 relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="h-11 rounded-xl pl-10 bg-white"
                          autoComplete="given-name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#1A1D29]">Last name</label>
                      <div className="mt-2 relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Thembu"
                          className="h-11 rounded-xl pl-10 bg-white"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                  </div>

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
                    <label className="text-sm font-semibold text-[#1A1D29]">Mobile number</label>
                    <div className="mt-2 relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        placeholder="+27 82 123 4567"
                        className="h-11 rounded-xl pl-10 bg-white"
                        autoComplete="tel"
                      />
                    </div>
                    <p className="mt-2 text-xs text-[#8B95A5]">We may use this for delivery updates and account security.</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Password</label>
                    <div className="mt-2 relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B95A5]" />
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        className="h-11 rounded-xl pl-10 pr-10 bg-white"
                        autoComplete="new-password"
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
                    <p className="mt-2 text-xs text-[#8B95A5]">Use 8+ characters. Add a number or symbol for stronger security.</p>
                  </div>

                  <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-[#1A1D29]">
                      I want to receive offers, wishlist updates, and newsletters.
                      <span className="block text-xs text-[#8B95A5] mt-1">You can unsubscribe at any time.</span>
                    </span>
                  </label>

                  <Button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="w-full h-11 rounded-xl premium-gradient text-white font-bold"
                  >
                    {submitting ? 'Creating account…' : 'Create account'}
                  </Button>

                  <div className="text-center text-sm text-[#8B95A5]">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-[#0B1220] hover:underline">
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-white/70">
              By creating an account, you agree to our{' '}
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
