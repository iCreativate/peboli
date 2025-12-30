import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { promises as fs } from 'fs';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function convertUsdToZar(amount: number) {
  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=USD&to=ZAR&amount=${encodeURIComponent(amount)}`
    );
    if (res.ok) {
      const data = (await res.json()) as { result?: number };
      const r = data?.result;
      if (typeof r === 'number' && Number.isFinite(r)) return r;
    }
  } catch {
    // ignore
  }
  return amount * 19;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name: unknown = body?.name;
    const brand: unknown = body?.brand;
    const description: unknown = body?.description;
    const price: unknown = body?.price;
    const compareAtPrice: unknown = body?.compareAtPrice;
    const stock: unknown = body?.stock;
    const images: unknown = body?.images;
    const categorySlug: unknown = body?.categorySlug;
    const skuInput: unknown = body?.sku;
    const isSplashSale: unknown = body?.isSplashSale;
    const currencyInput: unknown = body?.currency;
    const origin: unknown = body?.origin;
    const standardDeliveryPrice: unknown = body?.standardDeliveryPrice;
    const expressDeliveryPrice: unknown = body?.expressDeliveryPrice;

    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    if (typeof brand !== 'string' || !brand.trim()) {
      return NextResponse.json({ error: 'brand is required' }, { status: 400 });
    }
    if (typeof description !== 'string' || !description.trim()) {
      return NextResponse.json({ error: 'description is required' }, { status: 400 });
    }
    if (typeof price !== 'number' || !(price > 0)) {
      return NextResponse.json({ error: 'price must be a positive number' }, { status: 400 });
    }
    const imgs = Array.isArray(images) ? (images as unknown[]).filter((i): i is string => typeof i === 'string') : [];
    if (imgs.length === 0) {
      return NextResponse.json({ error: 'images must include at least one image' }, { status: 400 });
    }
    const catSlug = typeof categorySlug === 'string' && categorySlug.trim() ? categorySlug.trim().toLowerCase() : 'electronics';

    const slug = slugify(name);
    const sku = typeof skuInput === 'string' && skuInput.trim() ? skuInput.trim() : `${slug}-${Date.now()}`;
    const currency = typeof currencyInput === 'string' ? currencyInput.toUpperCase() : 'ZAR';
    let finalPrice = price as number;
    let rawCompare = typeof compareAtPrice === 'number' ? (compareAtPrice as number) : undefined;
    if (currency === 'USD') {
      finalPrice = await convertUsdToZar(finalPrice);
      rawCompare = rawCompare != null ? await convertUsdToZar(rawCompare) : undefined;
    }
    const compare = typeof rawCompare === 'number' && rawCompare > finalPrice ? rawCompare : undefined;
    const finalStock = typeof stock === 'number' ? stock : 0;
    const savings = compare ? Number(compare) - finalPrice : 0;
    const savingsPercentage = compare ? Math.round(((Number(compare) - finalPrice) / Number(compare)) * 100) : 0;

    try {
      let category = await prisma.category.findUnique({ where: { slug: catSlug } });
      if (!category) {
        category = await prisma.category.create({
          data: { name: catSlug, slug: catSlug },
        });
      }

      let vendor = await prisma.vendor.findFirst({});
      if (!vendor) {
        // Create a default user and vendor if none exists
        const user = await prisma.user.upsert({
             where: { email: 'admin@peboli.com' },
             update: {},
             create: {
                 email: 'admin@peboli.com',
                 name: 'Peboli Admin',
                 role: 'VENDOR'
             }
         });

        vendor = await prisma.vendor.create({
          data: {
            userId: user.id,
            name: 'Peboli Official',
            email: 'admin@peboli.com',
            isVerified: true,
            verificationTier: 'ELITE',
            rating: 5.0,
            reviewCount: 0,
            positiveRating: 100,
          },
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          brand: brand.trim(),
          description,
          price: finalPrice,
          compareAtPrice: compare,
          savings,
          savingsPercentage,
          images: {
            create: imgs.map((url) => ({ url }))
          },
          categoryId: category.id,
          condition: 'NEW',
          stock: finalStock,
          origin: typeof origin === 'string' && (origin === 'Local' || origin === 'International') ? origin : 'Local',
          standardDeliveryPrice: typeof standardDeliveryPrice === 'number' ? standardDeliveryPrice : null,
          expressDeliveryPrice: typeof expressDeliveryPrice === 'number' ? expressDeliveryPrice : null,
          sku,
          rating: 0,
          reviewCount: 0,
          soldCount: 0,
          vendorId: vendor.id,
          isFlashSale: Boolean(isSplashSale),
          isSplashDeal: Boolean(isSplashSale),
        } as any,
      });
      return NextResponse.json({ success: true, product });
    } catch (dbError) {
      // Fallback for local dev when DB is not available: write to public/live-products.json
      const product = {
        id: `offline-${Date.now()}`,
        name,
        slug,
        brand: brand.trim(),
        description,
        price: finalPrice,
        compareAtPrice: compare,
        savings,
        savingsPercentage,
        images: imgs,
        category: catSlug,
        subcategory: undefined,
        condition: 'new' as const,
        stock: finalStock,
        sku,
        rating: 0,
        reviewCount: 0,
        soldCount: 0,
        vendorId: 'offline',
        vendor: {
          id: 'offline',
          name: 'Peboli Vendor (Offline)',
          email: 'offline@peboli.local',
          rating: 0,
          reviewCount: 0,
          positiveRating: 0,
          verificationTier: 'basic' as const,
          isVerified: false,
          joinedAt: new Date(),
        },
        specifications: undefined,
        deliveryTime: undefined,
        isFlashSale: Boolean(isSplashSale),
        flashSaleEndsAt: undefined,
        isSplashDeal: Boolean(isSplashSale),
        splashSaleEndsAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const filePath = path.join(process.cwd(), 'public', 'live-products.json');
      let existing: Array<Record<string, unknown>> = [];
      try {
        const raw = await fs.readFile(filePath, 'utf8');
        const parsed = JSON.parse(raw) as unknown;
        existing = Array.isArray(parsed) ? (parsed as Array<Record<string, unknown>>) : [];
      } catch {
        existing = [];
      }
      const idx = existing.findIndex((p) => (p as { slug?: string })?.slug === slug);
      if (idx >= 0) {
        existing[idx] = product;
      } else {
        existing.push(product);
      }
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8');
      return NextResponse.json({
        success: true,
        product,
        warning:
          (dbError as unknown as { message?: string })?.message ||
          'Using offline storage (database unavailable)',
      });
    }
  } catch (error) {
    console.error('Push product error:', error);
    const message =
      typeof (error as unknown as { message?: string })?.message === 'string'
        ? (error as unknown as { message: string }).message
        : 'Failed to push product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
