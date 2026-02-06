'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MyListsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { items: wishlistItems, removeItem, clear } = useWishlistStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?callbackUrl=/account/lists');
      return;
    }
  }, [user]);

  const handleRemoveItem = (id: string) => {
    if (confirm('Remove this item from your wishlist?')) {
      removeItem(id);
    }
  };

  const handleAddToCart = (item: any) => {
    // This would integrate with cart store
    alert('Add to cart functionality coming soon!');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <Link href="/account" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Account
                </Link>
                <div className="text-white/80 text-sm font-semibold">My Lists</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Saved Items</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Your wishlist and saved items. Add items you love and come back to them later.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1A1D29]">
                  Wishlist ({wishlistItems.length})
                </h2>
                {wishlistItems.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Clear your entire wishlist?')) {
                        clear();
                      }
                    }}
                    className="h-10 px-4 rounded-xl text-sm"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-gray-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1D29]">Loading...</h3>
                </div>
              ) : wishlistItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1D29] mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-6">Start adding items you love to your wishlist.</p>
                  <Link href="/">
                    <Button className="flex items-center gap-2 h-11 px-6 rounded-xl bg-[#0B1220] hover:bg-[#1a283a] text-white font-semibold mx-auto transition-colors">
                      <Package className="h-4 w-4" />
                      Browse Products
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-400 transition-colors bg-white"
                    >
                      <Link href={item.categoryHref || `/product/${item.id}`}>
                        <div className="relative aspect-square bg-gray-100">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={item.categoryHref || `/product/${item.id}`}>
                          <h3 className="font-bold text-[#1A1D29] mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        {item.vendor && (
                          <p className="text-sm text-gray-500 mb-2">by {item.vendor}</p>
                        )}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold text-[#1A1D29]">
                            R {item.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 h-10 rounded-lg bg-[#0B1220] hover:bg-[#0B1220]/90 transition-colors text-white font-semibold text-sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-10 w-10 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

