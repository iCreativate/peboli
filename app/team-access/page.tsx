'use client';

import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

export default function TeamAccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 premium-gradient" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 lg:px-6 py-12">
          <div className="max-w-xl mx-auto rounded-3xl border border-white/15 bg-white/90 backdrop-blur-xl premium-shadow-xl overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#8B95A5]">Peboli Team</div>
                  <h1 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Admin access</h1>
                  <p className="mt-2 text-sm text-[#8B95A5]">
                    Bookmark this page for team access. It is not linked from the public website.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-3 text-sm font-semibold text-white"
                >
                  Go to Admin
                </Link>
                <Link
                  href="/vendor/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/70 px-5 py-3 text-sm font-semibold text-[#1A1D29] hover:bg-white transition-colors"
                >
                  Vendor Dashboard
                </Link>
              </div>

              <div className="mt-6 text-xs text-[#8B95A5]">
                Note: This does not replace real authentication. It is a private entry point for your team during development.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
