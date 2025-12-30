import { ProductDetails } from '@/components/product/ProductDetails';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { promises as fs } from 'fs';
import type { Product } from '@/types';

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await (prisma as any).product.findUnique({
      where: { slug },
      include: { vendor: true, category: true, images: true },
    });
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      description: p.description,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : undefined,
      savings: p.savings != null ? Number(p.savings) : undefined,
      savingsPercentage: p.savingsPercentage != null ? Number(p.savingsPercentage) : undefined,
      images: p.images?.map((img: any) => img.url) || [],
      category: p.category?.slug || 'electronics',
      subcategory: undefined,
      condition: 'new',
      stock: p.stock,
      origin: p.origin,
      standardDeliveryPrice: p.standardDeliveryPrice ? Number(p.standardDeliveryPrice) : undefined,
      expressDeliveryPrice: p.expressDeliveryPrice ? Number(p.expressDeliveryPrice) : undefined,
      sku: p.sku,
      rating: p.rating,
      reviewCount: p.reviewCount,
      soldCount: p.soldCount,
      vendorId: p.vendorId,
      vendor: {
        id: p.vendor.id,
        name: p.vendor.name,
        email: p.vendor.email,
        phone: undefined,
        rating: p.vendor.rating,
        reviewCount: p.vendor.reviewCount,
        positiveRating: p.vendor.positiveRating,
        verificationTier: p.vendor.verificationTier as 'basic' | 'premium' | 'elite',
        isVerified: p.vendor.isVerified,
        joinedAt: p.vendor.joinedAt,
      },
      specifications: undefined,
      deliveryTime: undefined,
      isFlashSale: p.isFlashSale ?? undefined,
      flashSaleEndsAt: p.flashSaleEndsAt ?? undefined,
      isSplashDeal: p.isSplashDeal ?? p.isFlashSale ?? false,
      splashSaleEndsAt: p.flashSaleEndsAt ?? undefined,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  } catch {
    try {
      const filePath = path.join(process.cwd(), 'public', 'live-products.json');
      const raw = await fs.readFile(filePath, 'utf8');
      const list = JSON.parse(raw) as unknown[];
      if (!Array.isArray(list)) return null;
      const found = list.find((x) => (x as { slug?: string })?.slug === slug) as Product | undefined;
      return found || null;
    } catch {
      return null;
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-xl w-full rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-bold text-[#1A1D29]">Product coming soon</h1>
          <p className="mt-2 text-sm text-[#8B95A5]">This product page isn&apos;t available yet.</p>
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-[#8B95A5]">Requested product</div>
            <div className="mt-1 font-mono text-sm text-[#1A1D29] break-all">{slug}</div>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
