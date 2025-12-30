import Link from 'next/link';
import { ChevronRight, Sun, Waves } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const PICKS = [
  { title: 'Outdoor & braai', href: '/categories/home' },
  { title: 'Summer fashion', href: '/categories/fashion' },
  { title: 'Fitness & hydration', href: '/categories/sports' },
  { title: 'Cooling & fans', href: '/search?q=fan' },
];

export default function SummerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Collections</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Summer</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Inspired by seasonal campaign pages: clear category shortcuts, premium layout, and quick discovery.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PICKS.map((p) => (
                  <Link
                    key={p.title}
                    href={p.href}
                    className="group rounded-2xl border border-gray-100 bg-white premium-shadow hover:premium-shadow-lg transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-black text-[#1A1D29] group-hover:text-gradient transition-all">{p.title}</div>
                        <div className="mt-2 text-sm text-[#8B95A5]">Curated for hot days, weekend plans, and summer savings.</div>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                          Explore
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                        <Sun className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#00C48C]/8 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                    <Waves className="h-5 w-5 text-[#0B1220]" />
                  </div>
                  <div>
                    <div className="font-black text-[#1A1D29]">Quick actions</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">Shop deals or search for something specific.</div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/deals" className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white">View deals</Link>
                      <Link href="/search?q=summer" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors">Search “summer”</Link>
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
