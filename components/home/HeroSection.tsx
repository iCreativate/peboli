'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden bg-[#0B1220]">
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 lg:px-6 h-full flex flex-col justify-center items-start">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
            Best deals.
            <br />
            <span className="text-[#FF6B4A]">
              Zero hassle.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl leading-relaxed font-medium">
            Discover amazing products at unbeatable prices. Direct from suppliers, straight to you.
          </p>
          <Button 
            size="lg" 
            className="group bg-white text-[#0B1220] hover:bg-white/95 font-bold text-lg px-10 py-7 h-auto rounded-2xl transition-all duration-300"
          >
            <span>Shop Now</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}

