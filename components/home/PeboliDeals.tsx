'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { motion } from 'framer-motion';

export function PeboliDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState<Product[]>([]);
  const [latestError, setLatestError] = useState<string | null>(null);
  const [latestLoading, setLatestLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?isSplashSale=true&limit=48`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          setError('Failed to load deals');
          setProducts([]);
          return;
        }
        setProducts(data as Product[]);
      } catch {
        setError('Failed to load deals');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadLatest = async () => {
      setLatestLoading(true);
      setLatestError(null);
      try {
        const res = await fetch(`/api/products?limit=12`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          setLatest([]);
          setLatestError('Failed to load latest products');
          return;
        }
        setLatest(data as Product[]);
      } catch {
        setLatest([]);
        setLatestError('Failed to load latest products');
      } finally {
        setLatestLoading(false);
      }
    };
    loadLatest();
  }, []);

  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products]);

  const categoryNames: Record<string, string> = {
    electronics: 'Electronics & Tech',
    fashion: 'Fashion & Accessories',
    home: 'Home & Kitchen',
    beauty: 'Beauty & Personal Care',
    sports: 'Sports & Fitness',
    baby: 'Baby & Kids',
    books: 'Books, Games & Media',
    deals: 'Outlet & Deals',
  };

  const categoryId = (category: string) => `deals-${category}`;

  return (
    <section className="py-14 md:py-16 bg-[#F7F8FA] w-full">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1A1D29] tracking-tight">
                PeboliDeals
              </h2>
              <p className="mt-2 text-base md:text-lg text-[#8B95A5] font-medium max-w-2xl">
                Browse deals by category. Jump to a section, scan quickly, and open any product for details.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/deals"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
              >
                View all deals
              </Link>
              <a
                href="#deals-top"
                className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A1D29]"
              >
                Browse categories
              </a>
            </div>
          </div>

          <div id="deals-top" className="mt-8 flex flex-wrap gap-2">
            {Object.keys(productsByCategory).map((category) => (
              <a
                key={category}
                href={`#${categoryId(category)}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
              >
                <span>{categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <span className="text-xs font-bold text-[#8B95A5]">{productsByCategory[category].length}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Latest products</h3>
              <Link href="/new" className="text-sm font-semibold text-[#0B1220] hover:underline">View all</Link>
            </div>
            {latest.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {latest.map((p, index) => (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-[#8B95A5]">
                {latestLoading ? 'Loading latest products…' : (latestError || 'No products yet.')}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {Object.entries(productsByCategory).map(([category, group], categoryIndex) => (
            <div
              key={category}
              id={categoryId(category)}
              className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div>
                  <div className="text-xs font-bold tracking-wide uppercase text-[#8B95A5]">Category deals</div>
                  <h3 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">
                    {categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <p className="mt-2 text-sm text-[#8B95A5] font-medium">
                    {group.length} {group.length === 1 ? 'product' : 'products'} on sale
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="#deals-top"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                  >
                    Back to categories
                  </a>
                  <Link
                    href={`/categories/${category}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1A1D29]"
                  >
                    View category
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {group.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: categoryIndex * 0.06 + index * 0.03 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
            </div>
          ))}

          <div className="text-center pt-2">
            {loading && <div className="text-sm text-[#8B95A5]">Loading deals…</div>}
            {error && <div className="text-sm font-semibold text-[#FF6B4A]">{error}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
