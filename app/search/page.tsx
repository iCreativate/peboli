import Link from 'next/link';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type SearchItem = {
  title: string;
  href: string;
  meta: string;
};

const SEARCH_INDEX: SearchItem[] = [
  { title: 'Deals & promotions', href: '/deals', meta: 'Browse splash deals and promos' },
  { title: 'Electronics', href: '/categories/electronics', meta: 'Phones, TVs, audio, and more' },
  { title: 'Fashion', href: '/categories/fashion', meta: 'Clothing, shoes, and accessories' },
  { title: 'Home & Kitchen', href: '/categories/home', meta: 'Homeware, appliances, and storage' },
  { title: 'Beauty', href: '/categories/beauty', meta: 'Skincare, makeup, and personal care' },
  { title: 'Sports & Fitness', href: '/categories/sports', meta: 'Training gear and fitness equipment' },
  { title: 'Baby & Kids', href: '/categories/baby', meta: 'Baby essentials and kids items' },
  { title: 'Books, Games & Media', href: '/categories/books', meta: 'Books and entertainment' },
  { title: 'Brand store', href: '/brands', meta: 'Browse top brands' },
  { title: 'Help Centre', href: '/help', meta: 'Support and FAQs' },
  { title: 'Orders', href: '/orders', meta: 'Track and manage orders' },
  { title: 'My Account', href: '/account', meta: 'Profile and preferences' },
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || '').trim();
  const normalized = query.toLowerCase();

  const results = query
    ? SEARCH_INDEX.filter((item) => {
        const haystack = `${item.title} ${item.meta}`.toLowerCase();
        return haystack.includes(normalized);
      })
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-10">
            <h1 className="text-2xl md:text-3xl font-black text-[#1A1D29]">Search</h1>
            <p className="mt-2 text-sm md:text-base text-[#8B95A5]">
              {query ? (
                <>
                  Results for <span className="font-semibold text-[#1A1D29]">{query}</span>
                </>
              ) : (
                'Type a keyword in the search bar to find categories, deals, and pages.'
              )}
            </p>

            {query && (
              <div className="mt-8">
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-2xl border border-gray-200 bg-white p-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-bold text-[#1A1D29]">{item.title}</div>
                        <div className="mt-1 text-sm text-[#8B95A5]">{item.meta}</div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="font-bold text-[#1A1D29]">No results found</div>
                    <div className="mt-2 text-sm text-[#8B95A5]">
                      Try searching for:
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['deals', 'electronics', 'fashion', 'help', 'orders'].map((s) => (
                          <Link
                            key={s}
                            href={`/search?q=${encodeURIComponent(s)}`}
                            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                          >
                            {s}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
              >
                Back to home
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1A1D29] transition-colors"
              >
                View deals
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
