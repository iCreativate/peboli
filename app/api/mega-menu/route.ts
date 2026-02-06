import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { promises as fs } from 'fs';

// Types for the Mega Menu structure
interface MegaMenuCategory {
  subcategories: { title: string; links: { name: string; slug: string }[] }[];
  featuredStores: string[];
  featuredProduct: {
    brand: string;
    name: string;
    slug: string;
    price: string;
    image: string;
    model?: string;
    validUntil?: string;
  };
}

export async function GET() {
  try {
    let products: any[] = [];

    // 1. Try fetching from Database
    try {
      products = await prisma.product.findMany({
        include: {
          category: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (dbError) {
      console.warn('Database fetch failed, falling back to JSON:', dbError);
    }

    // 2. Fallback to JSON if DB is empty or failed
    if (products.length === 0) {
      // No products found in DB, and mock data is removed.
      console.warn('No products found in database for mega menu.');
    }

    // 3. Process products into Mega Menu structure
    const megaMenuData: Record<string, MegaMenuCategory> = {};

    // Group products by category slug
    const productsByCategory: Record<string, any[]> = {};

    products.forEach((product) => {
      // Determine category slug
      let categorySlug = '';
      if (product.category && typeof product.category === 'object' && product.category.slug) {
        categorySlug = product.category.slug;
      } else if (typeof product.category === 'string') {
        categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
      } else {
        return; // Skip if no category
      }

      if (!productsByCategory[categorySlug]) {
        productsByCategory[categorySlug] = [];
      }
      productsByCategory[categorySlug].push(product);
    });

    // Build the menu data for each category
    Object.keys(productsByCategory).forEach((slug) => {
      const categoryProducts = productsByCategory[slug];
      
      // A. Extract Subcategories
      const subcats = new Set<string>();
      categoryProducts.forEach(p => {
        if (p.subcategory) subcats.add(p.subcategory);
      });
      
      // If no subcategories defined, create generic ones or group by other means? 
      // For now, let's just take top 3 subcategories found, or if none, maybe "General"
      let subcategoryList = Array.from(subcats).slice(0, 3);
      if (subcategoryList.length === 0) {
        subcategoryList = ['New Arrivals', 'Best Sellers', 'Deals'];
      }

      const formattedSubcategories = subcategoryList.map(sub => {
         // Find products in this subcategory
         const productsInSub: { name: string; slug: string }[] = [];
         categoryProducts.forEach(p => {
            if ((!p.subcategory && subcategoryList.includes('New Arrivals')) || p.subcategory === sub) {
                // Add product if not already added (simple dedupe by slug)
                if (!productsInSub.some(existing => existing.slug === p.slug)) {
                    productsInSub.push({ name: p.name, slug: p.slug });
                }
            }
         });
         
         return {
            title: sub,
            links: productsInSub.slice(0, 5) // Top 5 products in this subcat
         };
      });


      // B. Extract Featured Stores (Brands)
      const allBrands = new Set<string>();
      categoryProducts.forEach(p => { if (p.brand) allBrands.add(p.brand); });
      const featuredStores = Array.from(allBrands).slice(0, 4);

      // C. Featured Product (Pick the most expensive one or just the first one)
      // Let's sort by price desc to find a "premium" featured product
      const sortedByPrice = [...categoryProducts].sort((a, b) => Number(b.price) - Number(a.price));
      const feature = sortedByPrice[0];

      if (feature) {
          megaMenuData[slug] = {
              subcategories: formattedSubcategories,
              featuredStores,
              featuredProduct: {
                  brand: feature.brand || 'Generic',
                  name: feature.name,
                  slug: feature.slug,
                  price: `R${Number(feature.price).toLocaleString()}`,
                  image: (feature.images && feature.images.length > 0) ? feature.images[0].url : '/products/placeholder.svg',
                  model: feature.sku || feature.model,
                  validUntil: (feature.isFlashSale || feature.isSplashDeal) ? 'While stocks last' : undefined
              }
          };
      }
    });

    return NextResponse.json(megaMenuData);

  } catch (error) {
    console.error('Error generating mega menu:', error);
    return NextResponse.json({ error: 'Failed to generate mega menu' }, { status: 500 });
  }
}
