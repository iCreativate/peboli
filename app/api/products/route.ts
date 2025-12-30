import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const isSplashSale = searchParams.get('isSplashSale') === 'true' || searchParams.get('isFlashSale') === 'true';
        const limit = parseInt(searchParams.get('limit') || '20');

        const where: Record<string, unknown> = {};
        if (category) where.category = { slug: category };
        if (brand) where.brand = brand;
        if (isSplashSale) where.isSplashDeal = true;

        const products = await prisma.product.findMany({
            where,
            take: limit,
            include: {
                category: true,
                vendor: true,
                images: true,
            } as any,
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (products.length === 0) {
            return NextResponse.json([]);
        }

        const normalized = products.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            brand: p.brand,
            description: p.description,
            price: Number(p.price),
            compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : undefined,
            savings: p.savings != null ? Number(p.savings) : (p.compareAtPrice != null ? Number(p.compareAtPrice) - Number(p.price) : 0),
            savingsPercentage:
                p.savingsPercentage != null
                    ? Number(p.savingsPercentage)
                    : p.compareAtPrice != null
                    ? Math.round(((Number(p.compareAtPrice) - Number(p.price)) / Number(p.compareAtPrice)) * 100)
                    : 0,
            images: Array.isArray(p.images) ? p.images.map((img: any) => img.url) : [],
            category: p.category?.slug || 'electronics',
            subcategory: undefined,
            condition: 'new' as const,
            stock: p.stock,
            sku: p.sku,
            rating: p.rating,
            reviewCount: p.reviewCount,
            soldCount: p.soldCount,
            vendorId: p.vendorId,
            vendor: p.vendor
                ? {
                        id: p.vendor.id,
                        name: p.vendor.name,
                        email: p.vendor.email,
                        phone: undefined,
                        rating: p.vendor.rating,
                        reviewCount: p.vendor.reviewCount,
                        positiveRating: p.vendor.positiveRating,
                        verificationTier: String(p.vendor.verificationTier).toLowerCase() as 'basic' | 'premium' | 'elite',
                        isVerified: p.vendor.isVerified,
                        joinedAt:
                            ((p.vendor as unknown as { joinedAt?: Date; createdAt?: Date }).joinedAt ??
                                (p.vendor as unknown as { joinedAt?: Date; createdAt?: Date }).createdAt ??
                                new Date()),
                    }
                : {
                        id: 'unknown',
                        name: 'Unknown Vendor',
                        email: 'unknown@peboli.local',
                        phone: undefined,
                        rating: 0,
                        reviewCount: 0,
                        positiveRating: 0,
                        verificationTier: 'basic' as const,
                        isVerified: false,
                        joinedAt: new Date(),
                    },
            specifications: undefined,
            deliveryTime: undefined,
            isFlashSale: p.isFlashSale ?? undefined,
            flashSaleEndsAt: p.flashSaleEndsAt ?? undefined,
            isSplashDeal: p.isFlashSale ?? false,
            splashSaleEndsAt: p.flashSaleEndsAt ?? undefined,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
        return NextResponse.json(normalized);

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: {
                ...body,
                images: {
                    create: (body.images || []).map((url: string) => ({ url }))
                }
            },
            include: {
                category: true,
                vendor: true,
                images: true,
            } as any,
        });
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
