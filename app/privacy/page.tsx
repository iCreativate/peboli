import Link from 'next/link';
import { ChevronRight, Shield } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

const SECTIONS = [
  {
    title: 'What we collect',
    items: [
      'Account details (name, email, phone)',
      'Order history and delivery information',
      'Site usage analytics to improve performance',
    ],
  },
  {
    title: 'How we use it',
    items: [
      'Process orders and deliver products',
      'Improve search, discovery, and recommendations',
      'Prevent fraud and protect accounts',
    ],
  },
  {
    title: 'Your controls',
    items: [
      'Request access or correction of your information',
      'Opt out of marketing communications',
      'Request deletion where legally applicable',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Legal</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Privacy policy</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Clear and premium privacy communication — inspired by best practices, written for humans.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SECTIONS.map((s) => (
                  <div key={s.title} className="rounded-2xl border border-gray-100 bg-white p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-gray-100 flex items-center justify-center text-[#0B1220]">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-black text-[#1A1D29]">{s.title}</div>
                        <ul className="mt-3 space-y-2 text-sm text-[#8B95A5]">
                          {s.items.map((i) => (
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
                href="/terms"
                className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] hover:bg-[#0B1220]/90 transition-colors px-5 py-2.5 text-sm font-semibold text-white"
              >
                Terms of Service
              </Link>
                <Link
                  href="/popia"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                >
                  POPIA
                </Link>
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                >
                  Account
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
