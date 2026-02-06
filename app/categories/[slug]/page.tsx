import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';
import { Category } from '@/types';
import { prisma } from '@/lib/prisma';

async function getCategory(slug: string): Promise<Category | null> {
  try {
    // 1. Check in departments setting
    const setting = await prisma.setting.findUnique({
      where: { key: 'departments' },
    });
    
    if (setting?.value) {
      const departments = setting.value as any[];
      if (Array.isArray(departments)) {
        const found = departments.find((d: any) => d.slug === slug);
        if (found) {
          return {
            id: found.slug,
            name: found.name,
            slug: found.slug,
            icon: found.icon,
            productCount: 0 // Fetch real count if needed
          };
        }
      }
    }
    
    // 2. Fallback: Check if there are products with this category slug
    // This supports legacy categories or those not in the official list
    const product = await prisma.product.findFirst({
      where: { 
        category: {
          slug: slug
        }
      },
      select: { category: true }
    });
    
    if (product) {
       // Construct category from product data if possible, or just return basic
       return {
         id: slug,
         name: slug.charAt(0).toUpperCase() + slug.slice(1),
         slug: slug
       };
    }

  } catch (e) {
    console.error('Error fetching category:', e);
  }
  return null;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    // Return 404 or empty state? For now, render empty content or redirect
    // But to match previous behavior (render with fallback), we render a generic page
    const name = slug
      .split('-')
      .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
      .join(' ');
      
    const fallback: Category = {
      id: slug,
      name,
      slug,
    };
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <CategoryPageContent category={fallback} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryPageContent category={category} />
      </main>
      <Footer />
    </div>
  );
}
