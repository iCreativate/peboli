import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';
import { MAIN_CATEGORIES } from '@/lib/constants/categories';
import { Category } from '@/types';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = MAIN_CATEGORIES.find((cat) => cat.slug === slug);

  if (!category) {
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
