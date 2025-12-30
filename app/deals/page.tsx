import Link from 'next/link';
import { Bolt, ChevronRight, Tag, Truck } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const DEAL_SECTIONS = [
  {
    title: 'Splash deals',
    description: 'Limited time drops with premium savings — refreshed regularly.',
    icon: <Bolt className="h-5 w-5" />,
    href: '/deals',
  },
  {
    title: 'Category promos',
    description: 'Best deals by category to help you shop faster.',
    icon: <Tag className="h-5 w-5" />,
    href: '/categories/electronics',
  },
  {
    title: 'Fast delivery picks',
    description: 'Products that ship fast with reliable tracking.',
    icon: <Truck className="h-5 w-5" />,
    href: '/shipping',
  },
];

export default function DealsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Deals</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Deals & promotions</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  A premium deals hub inspired by marketplace best practices: clear sections, quick entry points, and easy scanning.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/categories/electronics"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    Browse categories
                  </Link>
                  <Link
                    href="/search?q=deals"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    Search deals
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DEAL_SECTIONS.map((s) => (
                  <Link
                    key={s.title}
                    href={s.href}
                    className="group rounded-2xl border border-gray-100 bg-white premium-shadow hover:premium-shadow-lg transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-black text-[#1A1D29] group-hover:text-gradient transition-all">{s.title}</div>
                        <div className="mt-2 text-sm text-[#8B95A5] leading-relaxed">{s.description}</div>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                          Explore
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                        {s.icon}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#FF6B4A]/5 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-black text-[#1A1D29]">Recommended next</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">Shop top categories or head back to the homepage.</div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      href="/categories/electronics"
                      className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Electronics
                    </Link>
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
