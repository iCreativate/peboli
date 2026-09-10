import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, GlassWater, PartyPopper } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { isLiquorEnabled } from '@/lib/local-shelf';

const PICKS = [
  { title: 'Cocktail essentials', href: '/search?q=cocktail' },
  { title: 'Home bar & glassware', href: '/categories/home' },
  { title: 'Hosting & snacks', href: '/search?q=snacks' },
  { title: 'Celebrate & gifts', href: '/christmas' },
];

export default function LiquorPage() {
  if (!isLiquorEnabled()) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Collections</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Festive liquor</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Available only when liquor sales are enabled and licensed. Contact Peboli to enable this collection.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PICKS.map((p) => (
                  <Link
                    key={p.title}
                    href={p.href}
                    className="group rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50 transition-colors duration-200 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-[#8B95A5]">Browse</div>
                        <div className="mt-1 text-lg font-black text-[#1A1D29] group-hover:text-[#0B1220]">{p.title}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#8B95A5] group-hover:text-[#0B1220]" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 flex gap-4">
                <PartyPopper className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1A1D29]">Licence required</p>
                  <p className="mt-1 text-sm text-[#8B95A5]">
                    Liquor is off by default for Local Shelf. Set <code className="text-xs">ENABLE_LIQUOR=true</code> only when you hold a valid licence.
                  </p>
                </div>
                <GlassWater className="h-8 w-8 text-amber-400 ml-auto hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
