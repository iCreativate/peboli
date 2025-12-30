import Link from 'next/link';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const COMMITMENTS = [
  'Process personal information lawfully and transparently',
  'Use appropriate security safeguards',
  'Limit data collection to what is necessary',
  'Respect access and correction requests where applicable',
];

export default function PopiaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Legal</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">POPIA compliance</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  A premium overview of how we approach personal information protection under South African law.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-black text-[#1A1D29]">Our commitments</div>
                    <ul className="mt-3 space-y-2 text-sm text-[#8B95A5]">
                      {COMMITMENTS.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0B1220] flex-shrink-0" />
                          <span className="leading-relaxed">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Privacy policy
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                >
                  Terms
                </Link>
              </div>

              <div className="mt-8">
                <Link href="/help" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:underline">
                  Back to help
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
