'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Chrome, Facebook, User, Mail, Phone, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';

export function RegisterModal() {
  const router = useRouter();
  const { isRegisterOpen, closeRegister, openLogin } = useUIStore();
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
  const [error, setError] = useState<string | null>(null);

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
      await new Promise((r) => setTimeout(r, 800));
      
      // Simulate successful social login
      const mockUser = {
        id: `${provider}-${Date.now()}`,
        name: provider === 'google' ? 'Google User' : 'Facebook User',
        email: `user@${provider}.com`,
        role: 'BUYER',
      };
      
      login(mockUser);
      closeRegister();
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      login(data.user);
      closeRegister();
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isRegisterOpen} onClose={closeRegister}>
      <div className="relative overflow-hidden bg-white">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="px-8 pt-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-500 mt-2">
              Join Peboli today and start shopping smarter
            </p>
          </div>

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

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-medium tracking-wider">Or continue with</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="First Name"
                  className="h-12 pl-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all duration-200"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Last Name"
                  className="h-12 pl-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all duration-200"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-4">
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

              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="h-12 pl-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all duration-200"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="relative group">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password"
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
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="newsletter"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="newsletter" className="text-sm text-gray-500">
                Subscribe to our newsletter for exclusive deals
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200 mt-4"
              disabled={!canSubmit || submitting}
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center">
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => {
                closeRegister();
                openLogin();
              }}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
