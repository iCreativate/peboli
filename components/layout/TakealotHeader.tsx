'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { useAdminStore } from '@/lib/stores/admin';
import { useAuthStore } from '@/lib/stores/auth';
import { useUIStore } from '@/lib/stores/ui';

export function TakealotHeader() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const collections = useAdminStore((s) => s.collections);
  const { openLogin, openRegister } = useUIStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="w-full bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-12 items-center justify-between text-sm">
            {/* Left: Logo and Links */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-black tracking-tight">PEBOLI</span>
              </Link>
              <Link href="/help" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                Help Centre
              </Link>
              <Link href="/sell" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                Sell on Peboli
              </Link>
            </div>

            {/* Right: Account Links */}
            <div className="flex items-center gap-4">
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-[#0B1220] transition-colors font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button 
                    onClick={openLogin}
                    className="text-gray-700 hover:text-[#0B1220] transition-colors font-medium"
                  >
                    Login
                  </button>
                  <button 
                    onClick={openRegister}
                    className="text-gray-700 hover:text-[#0B1220] transition-colors font-medium"
                  >
                    Register
                  </button>
                </>
              )}
              <Link href="/orders" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                Orders
              </Link>
              <Link href="/account" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                My Account
              </Link>
              <Link
                href="/wishlist"
                className="inline-flex h-8 w-8 items-center justify-center text-pink-500 hover:text-pink-600 transition-colors"
                aria-label="Wishlist"
              >
                <span className="relative inline-flex">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </span>
              </Link>
              <Link
                href="/cart"
                className="relative inline-flex h-8 w-8 items-center justify-center text-green-600 hover:text-green-700 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {Math.min(cartCount, 9)}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-[#0B1220] via-[#1A2333] to-[#0B1220] py-4 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer"></div>
        <div className="container mx-auto px-4 relative z-10">
          <form onSubmit={onSubmit} className="flex items-center gap-3 w-full max-w-4xl mx-auto">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B4A] to-[#00C48C] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Input
                type="search"
                placeholder="Search for products, brands, and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="relative w-full h-12 bg-white/95 backdrop-blur-sm border-0 rounded-2xl text-base shadow-xl focus:ring-2 focus:ring-[#FF6B4A]/20 transition-all duration-300 pl-5 pr-4 placeholder:text-gray-400 text-gray-900"
              />
            </div>
            <Button 
              type="submit" 
              className="h-12 px-8 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] hover:from-[#FF5530] hover:to-[#FF7A5B] text-white rounded-2xl font-bold shadow-lg shadow-[#FF6B4A]/20 hover:shadow-xl hover:shadow-[#FF6B4A]/30 hover:scale-105 transition-all duration-300 border-0"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Quick Navigation (Featured Collections) */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className={`text-sm whitespace-nowrap transition-all duration-200 px-3 py-1.5 rounded-full hover:bg-gray-50 ${
                  c.color 
                    ? 'font-bold' 
                    : 'text-gray-600 hover:text-[#0B1220] font-medium'
                }`}
                style={c.color ? { color: c.color, backgroundColor: `${c.color}10` } : undefined}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
