'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hero = useAdminStore((s) => s.hero);
  const images = Array.isArray(hero.imageUrls) ? hero.imageUrls : [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(images.length, 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(images.length, 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
  };

  return (
    <div className="relative w-full h-[600px] bg-black overflow-hidden">
      <div className="relative w-full h-full">
        {images.length > 0 ? (
          <div className="absolute inset-0">
            <Image src={images[currentSlide]} alt="Hero" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="text-center px-6">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                  {hero.title}
                </h2>
                {hero.subtitle && (
                  <p className="mt-4 text-lg md:text-2xl text-white/90 font-medium">
                    {hero.subtitle}
                  </p>
                )}
                {hero.ctaHref && hero.ctaLabel && (
                  <Link
                    href={hero.ctaHref}
                    className="inline-flex items-center justify-center mt-8 rounded-xl bg-white text-[#0B1220] hover:bg-white/95 font-bold text-base md:text-lg px-6 md:px-10 py-3 md:py-4 premium-shadow-lg transition-all duration-200"
                  >
                    {hero.ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 premium-gradient">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="text-center px-6">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                  {hero.title}
                </h2>
                {hero.subtitle && (
                  <p className="mt-4 text-lg md:text-2xl text-white/90 font-medium">
                    {hero.subtitle}
                  </p>
                )}
                {hero.ctaHref && hero.ctaLabel && (
                  <Link
                    href={hero.ctaHref}
                    className="inline-flex items-center justify-center mt-8 rounded-xl bg-white text-[#0B1220] hover:bg-white/95 font-bold text-base md:text-lg px-6 md:px-10 py-3 md:py-4 premium-shadow-lg transition-all duration-200"
                  >
                    {hero.ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
