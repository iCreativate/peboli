'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  CreditCard,
  Heart,
  HelpCircle,
  MapPin,
  Package,
  Shield,
  Star,
  Truck,
  User,
  Lock,
} from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';

type DashboardTile = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
};

const TILES: DashboardTile[] = [
  {
    title: 'Orders',
    description: 'Track orders, download invoices, and start returns.',
    href: '/orders',
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: 'Payments & credit',
    description: 'Manage saved payment methods and refunds (coming soon).',
    href: '/account/payments',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: 'Personal Details',
    description: 'Update name, email, and phone number.',
    href: '/account',
    icon: <User className="h-5 w-5" />,
  },
  {
    title: 'Login & Security',
    description: 'Manage password and 2-step verification.',
    href: '/account/security',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: 'Addresses',
    description: 'Manage delivery addresses and pickup preferences (coming soon).',
    href: '/account',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: 'My lists',
    description: 'Saved items and wishlists.',
    href: '/account',
    icon: <Heart className="h-5 w-5" />,
  },
  {
    title: 'Support',
    description: 'Help centre, contact, returns, and shipping info.',
    href: '/help',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

const QUICK_ACTIONS = [
  { label: 'Returns', href: '/returns', icon: <Truck className="h-4 w-4" /> },
  { label: 'Shipping info', href: '/shipping', icon: <Truck className="h-4 w-4" /> },
  { label: 'Privacy', href: '/privacy', icon: <Shield className="h-4 w-4" /> },
  { label: 'Top deals', href: '/deals', icon: <Star className="h-4 w-4" /> },
];

export default function AccountPage() {
  const { openLogin, openRegister } = useUIStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TakealotHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
           <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Lock className="h-10 w-10 text-gray-400" />
           </div>
           <h1 className="text-2xl font-bold text-gray-900">Login Required</h1>
           <p className="text-gray-500 mt-2 mb-8 max-w-md">Please sign in to manage your account settings and preferences.</p>
           <Button onClick={openLogin} className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all">
             Sign In / Register
           </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">My Account</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Welcome back</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Manage orders, returns, and account settings. This dashboard is inspired by marketplace best
                  practices, with a cleaner premium experience.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {QUICK_ACTIONS.map((a) => (
                    <Link
                      key={a.href + a.label}
                      href={a.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                    >
                      {a.icon}
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {TILES.map((tile) => (
                  <Link
                    key={tile.title}
                    href={tile.href}
                    className="group rounded-2xl border border-gray-100 bg-white premium-shadow hover:premium-shadow-lg transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-[#1A1D29] group-hover:text-gradient transition-all">
                          {tile.title}
                        </div>
                        <div className="mt-2 text-sm text-[#8B95A5] leading-relaxed">{tile.description}</div>
                      </div>
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                        {tile.icon}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#FF6B4A]/5 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#1A1D29]">Need to sign in?</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">
                      Authentication is UI-only for now. Use the premium login page.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={openLogin}
                      className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Login
                    </button>
                    <button
                      onClick={openRegister}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
