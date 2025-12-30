'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, Shield, Lock, CheckCircle, Smartphone, AlertTriangle, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/lib/stores/auth';

export default function SecurityPage() {
  const router = useRouter();
  const { user, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'initial' | 'setup' | 'verify'>('initial');
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    router.push('/');
    return null;
  }

  const handleStartSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/2fa/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate 2FA');

      setQrCode(data.qrCodeUrl);
      setSecret(data.secret);
      setStep('setup');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          token: verificationCode,
          secret: secret // Pass secret for mock mode fallback
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Verification failed');

      // Update user in store
      login({ ...user, isTwoFactorEnabled: true });
      setStep('initial');
      setQrCode(null);
      setSecret(null);
      setVerificationCode('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm('Are you sure you want to disable 2FA? Your account will be less secure.')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (!res.ok) throw new Error('Failed to disable 2FA');

      login({ ...user, isTwoFactorEnabled: false });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/account" className="hover:text-gray-900 transition-colors">Account</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-gray-900">Login & Security</span>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 premium-shadow p-6 md:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#1A1D29] tracking-tight">Login & Security</h1>
                  <p className="text-gray-500 mt-1">Manage your account security and 2-step verification.</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* 2FA Section */}
                <div className="border border-gray-200 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
                        {user.isTwoFactorEnabled ? (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Enabled
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Add an extra layer of security to your account by requiring a code from your authenticator app (like Google Authenticator) when you log in.
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {user.isTwoFactorEnabled ? (
                        <Button 
                          onClick={handleDisable}
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disable 2FA'}
                        </Button>
                      ) : (
                        step === 'initial' && (
                          <Button 
                            onClick={handleStartSetup}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                          >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enable 2FA'}
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Setup Flow */}
                  {step !== 'initial' && !user.isTwoFactorEnabled && (
                    <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* QR Code */}
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          {qrCode ? (
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <Image 
                                src={qrCode} 
                                alt="2FA QR Code" 
                                width={160} 
                                height={160}
                                className="rounded-lg" 
                              />
                            </div>
                          ) : (
                            <div className="h-40 w-40 bg-gray-200 rounded-lg animate-pulse" />
                          )}
                          <p className="text-xs text-gray-500 mt-4 text-center max-w-[200px]">
                            Scan this QR code with your authenticator app
                          </p>
                        </div>

                        {/* Instructions & Input */}
                        <div className="flex-[1.5] space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center">1</span>
                              <p className="text-sm text-gray-600">Download an authenticator app like Google Authenticator or Microsoft Authenticator.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center">2</span>
                              <p className="text-sm text-gray-600">Scan the QR code on the left.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center">3</span>
                              <p className="text-sm text-gray-600">Enter the 6-digit code from the app below.</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-900">Verification Code</label>
                            <div className="flex gap-3">
                              <Input 
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="max-w-[160px] text-center text-lg tracking-widest font-mono"
                              />
                              <Button 
                                onClick={handleVerify}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading || verificationCode.length !== 6}
                              >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify & Enable'}
                              </Button>
                            </div>
                          </div>

                          {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                              <AlertTriangle className="h-4 w-4" />
                              {error}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Section */}
                <div className="border border-gray-200 rounded-2xl p-6 opacity-60 pointer-events-none grayscale">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Password</h3>
                      <p className="text-gray-500 text-sm mt-1">Last changed: Never</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
