'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Heart, ChevronDown, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { useAdminStore } from '@/lib/stores/admin';
import { useAuthStore } from '@/lib/stores/auth';
import { useUIStore } from '@/lib/stores/ui';
import { AnimatePresence, motion } from 'framer-motion';

export function TakealotHeader() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { openLogin, openRegister } = useUIStore();
  const { user, logout } = useAuthStore();
  const [collections, setCollections] = useState<Array<{ id: string; name: string; href: string; color?: string }>>([]);
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([]);
  
  // Fetch departments and collections from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptRes = await fetch('/api/departments', { cache: 'no-store' });
        if (deptRes.ok) {
          const deptData = await deptRes.json();
          if (Array.isArray(deptData)) {
            setCategories(deptData);
          }
        }
        
        // Fetch collections
        const collRes = await fetch('/api/collections', { cache: 'no-store' });
        if (collRes.ok) {
          const collData = await collRes.json();
          if (Array.isArray(collData)) {
            setCollections(collData);
          }
        }
      } catch (error) {
        console.error('Error fetching header data:', error);
        // Fallback to defaults
        setCategories([
          'Appliances',
          'Automotive & DIY',
          'Baby & Toddler',
          'Beauty',
          'Books & Courses',
          'Camping & Outdoor',
          'Clothing & Shoes',
          'Electronics',
          'Gaming & Media',
          'Garden, Pool & Patio',
          'Groceries & Household',
          'Health & Personal Care',
          'Homeware',
          'Liquor',
          'Office & Stationery',
          'Pets',
          'Sport & Training',
          'Toys',
        ].map(name => ({ 
          name, 
          slug: name.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') 
        })));
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white z-50 relative">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between text-sm">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-black tracking-tight">PEBOLI</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/help" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                Help Centre
              </Link>
              <Link href="/sell" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                Sell on Peboli
              </Link>
            </div>

            {/* Right: Account Links */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
                    </div>
                    {user.email === 'admin@peboli.store' && (
                      <Link 
                        href="/admin" 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors font-medium"
                      >
                        <Shield className="h-4 w-4" />
                        Admin
                      </Link>
                    )}
                    <Link href="/orders" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                      Orders
                    </Link>
                    <Link href="/account" className="text-gray-700 hover:text-[#0B1220] transition-colors font-medium">
                      My Account
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-[#0B1220] transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </>
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
                    <Link href="/orders" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                      Orders
                    </Link>
                    <Link href="/account" className="text-gray-700 hover:text-[#0B1220] transition-colors">
                      My Account
                    </Link>
                  </>
                )}
              </div>

              {/* Icons visible on both mobile and desktop */}
              <Link
                href="/wishlist"
                className="hidden md:inline-flex h-8 w-8 items-center justify-center text-pink-500 hover:text-pink-600 transition-colors"
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{user.name || user.email}</span>
                  </div>
                  {user.email === 'admin@peboli.store' && (
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-2 text-red-700 bg-red-50 py-2 px-3 rounded-lg font-medium mb-2" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/account" className="text-gray-700 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    My Account
                  </Link>
                  <Link href="/orders" className="text-gray-700 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    Orders
                  </Link>
                  <Link href="/wishlist" className="text-gray-700 py-2 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-left text-red-600 py-2 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => { openLogin(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full">
                    Login
                  </Button>
                  <Button onClick={() => { openRegister(); setIsMobileMenuOpen(false); }} className="w-full bg-[#0B1220]">
                    Register
                  </Button>
                </div>
              )}
              
              <div className="border-t border-gray-100 pt-4 mt-2">
                <button 
                  onClick={() => setIsDepartmentsOpen(!isDepartmentsOpen)}
                  className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
                >
                  <span>Shop by Department</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDepartmentsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isDepartmentsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 py-2 flex flex-col gap-2 border-l-2 border-gray-100 ml-1">
                        {categories.map((cat) => (
                          <Link 
                            key={cat.slug} 
                            href={`/categories/${cat.slug}`}
                            className="text-sm text-gray-600 py-1.5 block hover:text-[#0B1220]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
                <Link href="/help" className="text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  Help Centre
                </Link>
                <Link href="/sell" className="text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                  Sell on Peboli
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="h-12 w-12 md:w-auto md:px-8 bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] hover:from-[#FF5530] hover:to-[#FF7A5B] text-white rounded-2xl font-bold shadow-lg shadow-[#FF6B4A]/20 hover:shadow-xl hover:shadow-[#FF6B4A]/30 hover:scale-105 transition-all duration-300 border-0 flex items-center justify-center"
            >
              <Search className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Search</span>
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
