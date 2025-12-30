import Link from 'next/link';
import { ChevronRight, Crown, Heart, Shield, Sparkles } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const BENEFITS = [
  { title: 'Early access deals', description: 'Get access to selected promos first (coming soon).', icon: <Sparkles className="h-5 w-5" /> },
  { title: 'Premium support', description: 'Priority support options (coming soon).', icon: <Shield className="h-5 w-5" /> },
  { title: 'Wishlist perks', description: 'Smarter price alerts and tracking (coming soon).', icon: <Heart className="h-5 w-5" /> },
];

export default function PeboliSplashPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">PEBOLI</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">PeboliSPLASH</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  A premium membership concept inspired by marketplaces — redesigned with cleaner UX and a modern layout.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                        {b.icon}
                      </div>
                      <div>
                        <div className="font-black text-[#1A1D29]">{b.title}</div>
                        <div className="mt-2 text-sm text-[#8B95A5] leading-relaxed">{b.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#FF6B4A]/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-[#0B1220]" />
                  </div>
                  <div>
                    <div className="font-black text-[#1A1D29]">Status</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">
                      PeboliSPLASH is a UI concept page right now. Membership flows will be added later.
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/deals" className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white">Explore deals</Link>
                      <Link href="/help" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors">Help Centre</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:underline">
                  Back to home
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
