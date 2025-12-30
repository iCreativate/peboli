'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 premium-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,107,74,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,196,140,0.2),transparent_50%)]"></div>
      </div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 lg:px-6 h-full flex flex-col justify-center items-start">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
            Best deals.
            <br />
            <span className="bg-gradient-to-r from-[#FF6B4A] via-[#FF8A6B] to-[#FF6B4A] bg-clip-text text-transparent animate-gradient">
              Zero hassle.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl leading-relaxed font-medium">
            Discover amazing products at unbeatable prices. Direct from suppliers, straight to you.
          </p>
          <Button 
            size="lg" 
            className="group bg-white text-[#0B1220] hover:bg-white/95 font-bold text-lg px-10 py-7 h-auto rounded-2xl premium-shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            <span>Shop Now</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}

