import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { DepartmentSidebar } from '@/components/home/DepartmentSidebar';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { PeboliDeals } from '@/components/home/PeboliDeals';


export default async function Home() {
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
            <HeroCarousel />
          </div>
        </div>
        
        {/* PeboliDeals - Full Width, extends under sidebar */}
        <div className="w-full relative">
          <PeboliDeals />
        </div>
      </main>
      <Footer />
    </div>
  );
}
