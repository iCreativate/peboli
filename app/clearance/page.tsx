import Link from 'next/link';
import { ChevronRight, Tag, TimerReset } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const PICKS = [
  { title: 'Last chance electronics', href: '/categories/electronics' },
  { title: 'Fashion markdowns', href: '/categories/fashion' },
  { title: 'Home clearance', href: '/categories/home' },
  { title: 'All deals', href: '/deals' },
];

export default function ClearancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Collections</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Clearance</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Markdown picks and last-chance offers — structured for fast scanning and premium browsing.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PICKS.map((p) => (
                  <Link
                    key={p.title}
                    href={p.href}
                    className="group rounded-2xl border border-gray-100 bg-white hover:border-gray-300 transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-black text-[#1A1D29] transition-all">{p.title}</div>
                        <div className="mt-2 text-sm text-[#8B95A5]">Limited stock. Limited time. Strong value.</div>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                          Explore
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B1220]">
                        <Tag className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                    <TimerReset className="h-5 w-5 text-[#0B1220]" />
                  </div>
                  <div>
                    <div className="font-black text-[#1A1D29]">Don’t miss it</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">Clearance offers change often — check back regularly.</div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/deals" className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] px-5 py-2.5 text-sm font-semibold text-white">Deals</Link>
                      <Link href="/search?q=clearance" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors">Search clearance</Link>
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
