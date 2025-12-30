'use client';

import Link from 'next/link';
import { useUIStore } from '@/lib/stores/ui';

export function SellAuthButtons() {
  const { openLogin } = useUIStore();

  return (
    <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
      <Link
        href="/sell/apply"
        className="inline-flex items-center justify-center rounded-xl bg-white text-[#1A1D29] px-8 py-4 text-base font-bold shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1"
      >
        Apply to Sell
      </Link>
      <Link
        href="/vendor/pricing"
        className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all"
      >
        Pricing
      </Link>
      <button
        onClick={openLogin}
        className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all"
      >
        Seller Login
      </button>
    </div>
  );
}

export function SellPricingAuthButton() {
  return (
    <Link
      href="/sell/apply"
      className="block w-full bg-[#1A1D29] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors text-center"
    >
      Get Started
    </Link>
  );
}
