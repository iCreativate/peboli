import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateSellPrice, clampMarkupPercent, MARKUP_DEFAULT } from '@/lib/pricing';
import { isLocalShelfMode } from '@/lib/local-shelf';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name: unknown = body?.name;
    const brand: unknown = body?.brand;
    const description: unknown = body?.description;
    const price: unknown = body?.price;
    const cost: unknown = body?.cost;
    const landedCost: unknown = body?.landedCost;
    const markupPercent: unknown = body?.markupPercent;
    const compareAtPrice: unknown = body?.compareAtPrice;
    const stock: unknown = body?.stock;
    const images: unknown = body?.images;
    const categorySlug: unknown = body?.categorySlug;
    const skuInput: unknown = body?.sku;
    const isSplashSale: unknown = body?.isSplashSale;
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

    const imgs = Array.isArray(images) ? (images as unknown[]).filter((i): i is string => typeof i === 'string') : [];
    if (imgs.length === 0) {
      return NextResponse.json({ error: 'images must include at least one image' }, { status: 400 });
    }

    const catSlug =
      typeof categorySlug === 'string' && categorySlug.trim()
        ? categorySlug.trim().toLowerCase()
        : isLocalShelfMode()
          ? 'food'
          : 'electronics';

    const slug = slugify(name);
    const sku = typeof skuInput === 'string' && skuInput.trim() ? skuInput.trim() : `${slug}-${Date.now()}`;

    const markup = clampMarkupPercent(
      typeof markupPercent === 'number' ? markupPercent : MARKUP_DEFAULT
    );

    let finalCost: number | undefined =
      typeof cost === 'number' && cost > 0 ? cost : undefined;
    const finalLanded =
      typeof landedCost === 'number' && landedCost > 0 ? landedCost : undefined;

    let finalPrice: number;
    if (finalCost != null || finalLanded != null) {
      finalPrice = calculateSellPrice(finalCost ?? finalLanded!, markup, finalLanded);
      if (!finalCost && finalLanded) finalCost = finalLanded;
    } else if (typeof price === 'number' && price > 0) {
      finalPrice = price;
    } else {
      return NextResponse.json(
        { error: 'Provide cost (or landedCost) for Local Shelf pricing, or an explicit sell price' },
        { status: 400 }
      );
    }

    const rawCompare = typeof compareAtPrice === 'number' ? compareAtPrice : undefined;
    const compare = typeof rawCompare === 'number' && rawCompare > finalPrice ? rawCompare : undefined;
    const finalStock = typeof stock === 'number' ? stock : 0;
    const savings = compare ? Number(compare) - finalPrice : 0;
    const savingsPercentage = compare
      ? Math.round(((Number(compare) - finalPrice) / Number(compare)) * 100)
      : 0;

    let category = await prisma.category.findUnique({ where: { slug: catSlug } });
    if (!category) {
      category = await prisma.category.create({
        data: { name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1), slug: catSlug },
      });
    }

    let vendor = await prisma.vendor.findFirst({});
    if (!vendor) {
      const user = await prisma.user.upsert({
        where: { email: 'local-shelf@peboli.store' },
        update: {},
        create: {
          email: 'local-shelf@peboli.store',
          name: 'Peboli Local Shelf',
          role: 'VENDOR',
        },
      });

      vendor = await prisma.vendor.create({
        data: {
          userId: user.id,
          name: 'Peboli Local Shelf — Gauteng',
          email: 'local-shelf@peboli.store',
          isVerified: true,
          verificationTier: 'ELITE',
          rating: 5.0,
          reviewCount: 0,
          positiveRating: 100,
          status: 'APPROVED',
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString(36).slice(-4)}`,
        brand: brand.trim(),
        description,
        price: finalPrice,
        cost: finalCost ?? null,
        landedCost: finalLanded ?? finalCost ?? null,
        markupPercent: markup,
        compareAtPrice: compare,
        savings,
        savingsPercentage,
        images: {
          create: imgs.map((url) => ({ url })),
        },
        categoryId: category.id,
        condition: 'NEW',
        status: 'ACTIVE',
        stock: finalStock,
        origin:
          typeof origin === 'string' && (origin === 'Local' || origin === 'International')
            ? origin
            : 'Local',
        standardDeliveryPrice: typeof standardDeliveryPrice === 'number' ? standardDeliveryPrice : null,
        expressDeliveryPrice: typeof expressDeliveryPrice === 'number' ? expressDeliveryPrice : null,
        sku,
        rating: 0,
        reviewCount: 0,
        soldCount: 0,
        vendorId: vendor.id,
        isFlashSale: Boolean(isSplashSale),
        isSplashDeal: Boolean(isSplashSale),
        isSample: false,
      } as any,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Push product error:', error);
    const message =
      typeof (error as { message?: string })?.message === 'string'
        ? (error as { message: string }).message
        : 'Failed to push product — ensure DATABASE_URL is set and run npm run db:push';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
