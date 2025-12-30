import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const {
      name,
      brand,
      description,
      price,
      compareAtPrice,
      images,
      categorySlug,
      categoryId,
      sku,
      isSplashSale,
      vendorId: providedVendorId,
      collectionIds,
      stock,
    } = body;

    if (!name || !brand || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let vendorId = providedVendorId;
    if (!vendorId) {
      // In a real app, we get vendor from session. For now, we try to find one.
      const vendor = await prisma.vendor.findFirst();
      if (!vendor) {
        return NextResponse.json({ error: 'No vendor found' }, { status: 404 });
      }
      vendorId = vendor.id;
    }

    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    if (vendor.status !== 'APPROVED') {
        return NextResponse.json({ error: 'Vendor account is pending approval. You cannot post products yet.' }, { status: 403 });
    }

    // Resolve category by id or slug; create slugged category if missing
    let category: { id: string } | null = null;
    if (categoryId) {
      category = await prisma.category.findUnique({ where: { id: categoryId } });
    }
    if (!category) {
      const catSlug = categorySlug || 'electronics';
      category = await prisma.category.findUnique({ where: { slug: catSlug } });
      if (!category) {
        category = await prisma.category.create({ data: { name: catSlug, slug: catSlug } });
      }
    }

    const slug = slugify(name);
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        brand,
        description: description || '',
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        images: { create: (images || []).map((url: string) => ({ url })) } as any,
        categoryId: category.id,
        vendorId,
        stock: stock ? Number(stock) : 0,
        sku: sku || `${slug}-${Date.now()}`,
        isFlashSale: isSplashSale || false, // Default to false for vendor uploads
        isSplashDeal: isSplashSale || false,
        collections: collectionIds && Array.isArray(collectionIds) && collectionIds.length > 0 
          ? { connect: collectionIds.map((id: string) => ({ id })) }
          : undefined,
      } as any,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const vendorId = searchParams.get('vendorId');

        // If no vendorId provided, try to find the default one for now
        let targetVendorId = vendorId;
        if (!targetVendorId) {
             const vendor = await prisma.vendor.findFirst();
             if (vendor) targetVendorId = vendor.id;
        }

        if (!targetVendorId) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        const products = await prisma.product.findMany({
            where: { vendorId: targetVendorId },
            include: { 
                images: true,
                category: true
            } as any,
            orderBy: { createdAt: 'desc' }
        });

        // Transform images to array of strings for frontend
        const transformedProducts = (products as any[]).map((p: any) => ({
            ...p,
            images: p.images.map((img: any) => img.url)
        }));

        return NextResponse.json(transformedProducts);
    } catch (error) {
        console.error('Error fetching vendor products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      brand,
      description,
      price,
      compareAtPrice,
      images,
      categoryId,
      stock,
      collectionIds
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Verify ownership (simplified for now)
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (typeof name === 'string' && name.trim()) updateData.name = name.trim();
    if (typeof brand === 'string' && brand.trim()) updateData.brand = brand.trim();
    if (typeof description === 'string') updateData.description = description;
    if (price !== undefined && price !== '') {
      const n = Number(price);
      if (!Number.isNaN(n)) updateData.price = n;
    }
    if (compareAtPrice === '' || compareAtPrice === null) {
      updateData.compareAtPrice = null;
    } else if (compareAtPrice !== undefined) {
      const n = Number(compareAtPrice);
      if (!Number.isNaN(n)) updateData.compareAtPrice = n;
    }
    if (stock !== undefined && stock !== '') {
      const n = Number(stock);
      if (!Number.isNaN(n)) updateData.stock = n;
    }

    if (categoryId) updateData.categoryId = categoryId;

    // Handle collections update if provided
    if (Array.isArray(collectionIds)) {
      if (collectionIds.length > 0) {
        updateData.collections = { set: collectionIds.map((cid: string) => ({ id: cid })) };
      }
    }

    // Handle images: if provided, replace all
    // In a real app, we might want to add/remove specific images
    if (Array.isArray(images)) {
      await (prisma as any).productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        updateData.images = { create: images.map((url: string) => ({ url })) } as any;
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData as any,
      include: { images: true } as any
    });

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body as { id?: string };
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
