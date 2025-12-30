'use client';

import Link from 'next/link';
import { ChevronRight, Sparkles, Store } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { useAdminStore } from '@/lib/stores/admin';

export default function BrandsPage() {
  const brands = useAdminStore((s) => s.brands);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Brands</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Brand store</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Discover trusted brands with a cleaner premium browsing experience.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/search?q=brand"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    Search brands
                  </Link>
                  <Link
                    href="/deals"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    View deals
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {brands.map((b) => (
                  <Link
                    key={b.id}
                    href={`/brands/${b.slug}`}
                    className="group rounded-2xl border border-gray-100 bg-white premium-shadow hover:premium-shadow-lg transition-all duration-200 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-[#1A1D29] group-hover:text-gradient transition-all line-clamp-1">{b.name}</div>
                        <div className="h-10 w-10 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220] overflow-hidden">
                          {b.logo ? (
                             <img src={b.logo} alt={b.name} className="w-full h-full object-contain p-1.5" />
                          ) : (
                             <Store className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-[#8B95A5] line-clamp-2">
                        {b.description || `Explore latest from ${b.name}.`}
                      </div>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                      Open brand
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>


              <div className="mt-10 rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#00C48C]/8 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#0B1220]" />
                  </div>
                  <div>
                    <div className="font-black text-[#1A1D29]">Premium tip</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">
                      Want to shop faster? Use the header search and filter by brand name.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                >
                  Back to home
                </Link>
                <Link
                  href="/categories/electronics"
                  className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Browse electronics
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
