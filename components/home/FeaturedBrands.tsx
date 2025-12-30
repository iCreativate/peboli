'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturedBrands() {
  const brands = [
    { name: 'chenshia', color: 'text-red-600' },
    { name: 'Bowers & Wilkins', color: 'text-black' },
    { name: 'SAMSUNG', color: 'text-black' },
    { name: 'Imou', color: 'text-orange-500' },
    { name: 'ESTÉE LAUDER', color: 'text-black' },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Featured Brands</h2>
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 border border-gray-200 rounded-lg flex items-center justify-center bg-white hover:shadow-md transition-shadow"
              >
                <span className={`font-bold text-lg ${brand.color}`}>{brand.name}</span>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-200"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

