import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const BLOCKS = [
  {
    title: 'Using the platform',
    items: [
      'Use the platform lawfully and respectfully',
      'Do not attempt fraudulent purchases or abuse promotions',
      'Content and pricing may change without notice',
    ],
  },
  {
    title: 'Orders & payments',
    items: [
      'Orders are confirmed when payment is completed',
      'Refunds follow the published returns policy',
      'We do not store raw card details',
    ],
  },
  {
    title: 'Returns',
    items: [
      'Eligibility depends on product type and return window',
      'Items should be returned in sellable condition unless faulty',
      'Refund timelines may vary by bank/provider',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Legal</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Terms of service</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  A premium, simplified terms layout with clear headings and short readable blocks.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BLOCKS.map((b) => (
                  <div key={b.title} className="rounded-2xl border border-gray-100 bg-white p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B1220]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-black text-[#1A1D29]">{b.title}</div>
                        <ul className="mt-3 space-y-2 text-sm text-[#8B95A5]">
                          {b.items.map((i) => (
                            <li key={i} className="flex gap-3">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0B1220] flex-shrink-0" />
                              <span className="leading-relaxed">{i}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] hover:bg-[#1a283a] transition-colors px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Privacy policy
                </Link>
                <Link
                  href="/popia"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                >
                  POPIA
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
