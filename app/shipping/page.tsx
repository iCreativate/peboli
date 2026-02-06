import Link from 'next/link';
import { ChevronRight, MapPin, Truck } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const OPTIONS = [
  {
    title: 'Standard delivery',
    description: 'Reliable delivery with great value across major regions.',
    eta: '4–7 business days',
  },
  {
    title: 'Express delivery',
    description: 'Faster delivery where available for selected items.',
    eta: '2–3 business days',
  },
  {
    title: 'Pickup points',
    description: 'Collect from selected locations (coming soon).',
    eta: 'Varies by location',
  },
];

const NOTES = [
  'Delivery fees vary by region and basket size',
  'Some bulky items may require special handling',
  'Track delivery status from the Orders page',
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Shipping</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Delivery options</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Clear delivery choices with premium transparency — ETAs, fees, and tracking in one place.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/orders"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    Track orders
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                  >
                    Contact support
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {OPTIONS.map((o) => (
                  <div key={o.title} className="rounded-2xl border border-gray-100 bg-white p-6">
                    <div className="font-black text-[#1A1D29]">{o.title}</div>
                    <div className="mt-2 text-sm text-[#8B95A5] leading-relaxed">{o.description}</div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                      <Truck className="h-4 w-4" />
                      ETA: {o.eta}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-[#0B1220]" />
                    </div>
                    <div>
                      <div className="font-black text-[#1A1D29]">Good to know</div>
                      <div className="text-sm text-[#8B95A5]">Helpful delivery notes</div>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2 text-sm text-[#8B95A5]">
                    {NOTES.map((n) => (
                      <li key={n} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0B1220] flex-shrink-0" />
                        <span className="leading-relaxed">{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="font-black text-[#1A1D29]">Need help?</div>
                  <div className="mt-2 text-sm text-[#8B95A5] leading-relaxed">
                    For delivery issues, check Orders first. If you’re stuck, contact support.
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href="/orders"
                      className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] hover:bg-[#1a283a] transition-colors px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      View orders
                    </Link>
                    <Link
                      href="/help"
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                    >
                      Help Centre
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/account" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:underline">
                  Back to account
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
