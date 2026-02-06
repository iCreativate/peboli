import Link from 'next/link';
import { ChevronRight, Gift, Sparkles } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const PICKS = [
  { title: 'Gifts under R500', href: '/search?q=gifts%20under%20500' },
  { title: 'Home & hosting', href: '/categories/home' },
  { title: 'Tech gifts', href: '/categories/electronics' },
  { title: 'Beauty sets', href: '/categories/beauty' },
];

export default function ChristmasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Collections</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Christmas</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  A premium Christmas hub inspired by marketplace layouts: curated entry points, clear categories, and quick gifting ideas.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PICKS.map((p) => (
                  <Link
                    key={p.title}
                    href={p.href}
                    className="group rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-black text-[#1A1D29] transition-all">{p.title}</div>
                        <div className="mt-2 text-sm text-[#8B95A5]">Curated picks to help you shop faster.</div>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                          Explore
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B1220]">
                        <Gift className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#0B1220]" />
                  </div>
                  <div>
                    <div className="font-black text-[#1A1D29]">Premium tip</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">
                      Use search to find gifting ideas quickly: try “gift set”, “wireless earbuds”, or “kitchen essentials”.
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/deals" className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] hover:bg-[#1a283a] transition-colors px-5 py-2.5 text-sm font-semibold text-white">View deals</Link>
                      <Link href="/search?q=gifts" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors">Search gifts</Link>
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
