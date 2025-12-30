import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

// Fetch new arrivals directly from database
async function getNewArrivals(): Promise<Product[]> {
  try {
    const products = await (prisma as any).product.findMany({
      take: 20, // Limit to 20 items
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        vendor: true,
        images: true,
      },
    });

    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      description: p.description,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      savings: p.savings ? Number(p.savings) : undefined,
      savingsPercentage: p.savingsPercentage ? Number(p.savingsPercentage) : undefined,
      images: p.images.map((img: any) => img.url),
      category: p.category.slug,
      subcategory: undefined,
      condition: 'new',
      stock: p.stock,
      sku: p.sku,
      rating: p.rating,
      reviewCount: p.reviewCount,
      soldCount: p.soldCount,
      vendorId: p.vendorId,
      vendor: {
        id: p.vendor.id,
        name: p.vendor.name,
        email: p.vendor.email,
        rating: p.vendor.rating,
        reviewCount: p.vendor.reviewCount,
        positiveRating: p.vendor.positiveRating,
        verificationTier: p.vendor.verificationTier as 'basic' | 'premium' | 'elite',
        isVerified: p.vendor.isVerified,
        joinedAt: p.vendor.joinedAt,
      },
      specifications: undefined,
      deliveryTime: undefined,
      isFlashSale: p.isFlashSale,
      flashSaleEndsAt: p.flashSaleEndsAt || undefined,
      isSplashDeal: p.isFlashSale, // Mapping flash sale to splash deal as per previous logic
      splashSaleEndsAt: p.flashSaleEndsAt || undefined,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Collections</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">New arrivals</h1>
                <p className="mt-3 text-white/75 max-w-2xl">Fresh picks across categories — laid out with a premium, modern feel.</p>
              </div>
            </div>
            <div className="p-6 md:p-10">
              <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#00C48C]/8 p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#0B1220]" />
                  </div>
                  <div>
                    <div className="font-black text-[#1A1D29]">What’s new</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">Explore the latest products added to our catalog.</div>
                  </div>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="h-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">No new products available at the moment.</p>
                  <Link href="/" className="inline-block mt-4 text-[#0B1220] font-semibold hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              )}

              <div className="mt-12 pt-6 border-t border-gray-100">
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
