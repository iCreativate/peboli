'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { DealBanner } from '@/components/deals/DealBanner';
import { SplashSaleTimer } from '@/components/deals/SplashSaleTimer';
import { Product } from '@/types';
import { Deal } from '@/types/deal';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function SplashDealsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active deals
        const dealsRes = await fetch('/api/deals?status=ACTIVE&featured=true&limit=4', { cache: 'no-store' });
        if (dealsRes.ok) {
          const dealsData = await dealsRes.json();
          if (Array.isArray(dealsData)) {
            setDeals(dealsData);
          }
        }

        // Also fetch products with splash deals as fallback
        const productsRes = await fetch('/api/products?isSplashSale=true&limit=4', { cache: 'no-store' });
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (Array.isArray(productsData)) {
            setProducts(productsData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch splash deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-4 lg:px-6">
           <div className="animate-pulse space-y-8">
             <div className="h-12 w-64 bg-gray-200 rounded"></div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl"></div>
               ))}
             </div>
           </div>
        </div>
      </section>
    );
  }

  // Show deals first, then products as fallback
  const hasDeals = deals.length > 0;
  const hasProducts = products.length > 0;

  if (!hasDeals && !hasProducts) {
    return null; // Don't show section if no deals
  }

  const featuredDeal = deals.find(d => d.isFeatured) || deals[0];
  const productDeals = deals.filter(d => d.type === 'PRODUCT_CAMPAIGN' && d.product);
  const advertDeals = deals.filter(d => d.type === 'ADVERT');

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-block mb-3">
              <span className="text-xs font-bold text-[#0B1220] bg-[#0B1220]/10 px-3 py-1.5 rounded-full uppercase tracking-wide">
                Limited Time
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1A1D29] mb-3 tracking-tight">
              Today&apos;s Splash Deals
            </h2>
            <p className="text-lg text-[#8B95A5] font-medium">Limited time offers you won&apos;t want to miss</p>
          </div>
          {featuredDeal?.endsAt && (
            <div className="flex-shrink-0">
              <SplashSaleTimer endTime={featuredDeal.endsAt} />
            </div>
          )}
        </div>

        {/* Featured Banner Deal */}
        {advertDeals.length > 0 && (
          <div className="mb-10">
            <DealBanner deal={advertDeals[0]} />
          </div>
        )}

        {/* Products Grid - Show product campaigns or fallback to products */}
        {(productDeals.length > 0 || hasProducts) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mb-10">
            {productDeals.length > 0
              ? productDeals.slice(0, 4).map((deal, index) => {
                  if (!deal.product) return null;
                  // Create a product-like object from the deal
                  const product = {
                    ...deal.product,
                    isSplashDeal: true,
                    splashSaleEndsAt: deal.endsAt,
                  } as Product;
                  
                  return (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  );
                })
              : products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/deals"
            className="group inline-flex items-center gap-2 text-[#0B1220] font-bold text-lg hover:gap-3 transition-all duration-200"
          >
            <span>View All Deals</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

