import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { DepartmentSidebar } from '@/components/home/DepartmentSidebar';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ShopByDepartment } from '@/components/home/ShopByDepartment';
import { PeboliDeals } from '@/components/home/PeboliDeals';
import { prisma } from '@/lib/prisma';
import { HeroSettings } from '@/lib/stores/admin';

async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'hero_settings' },
    });
    
    if (setting?.value) {
      return setting.value as HeroSettings;
    }
  } catch (error) {
    console.error('Failed to fetch hero settings:', error);
  }

  return {
    title: 'Best deals. Zero hassle.',
    subtitle: 'Discover premium picks and splash sales across top categories.',
    imageUrls: [],
    ctaLabel: 'Shop Now',
    ctaHref: '/deals',
  };
}

export default async function Home() {
  const hero = await getHeroSettings();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />
      <main className="flex-1 flex flex-col">
        {/* Hero Section with Sidebar */}
        <div className="flex flex-col lg:flex-row relative">
          {/* Left Sidebar - Hidden on mobile/tablet */}
          <div className="hidden lg:block flex-shrink-0 relative z-40">
            <DepartmentSidebar />
          </div>
          
          {/* Hero Carousel */}
          <div className="flex-1 relative z-0 w-full">
            <HeroCarousel hero={hero} />
          </div>
        </div>
        
        {/* Shop By Department */}
        <ShopByDepartment />

        {/* PeboliDeals - Full Width, extends under sidebar */}
        <div className="w-full relative">
          <PeboliDeals />
        </div>
      </main>
      <Footer />
    </div>
  );
}
