/* eslint-disable @next/next/no-img-element */

'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Trash2, Lock } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { useAuthStore } from '@/lib/stores/auth';
import { useUIStore } from '@/lib/stores/ui';

const formatZar = (n: number) => `R ${n.toLocaleString('en-ZA')}`;

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const addItem = useWishlistStore((s) => s.addItem);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const updateItem = useWishlistStore((s) => s.updateItem);
  const clear = useWishlistStore((s) => s.clear);

  const addToCart = useCartStore((s) => s.addItem);
  
  const { user } = useAuthStore();
  const { openLogin } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftPrice, setDraftPrice] = useState('');
  const [draftCategoryHref, setDraftCategoryHref] = useState('/categories/electronics');

  const canAdd = useMemo(() => {
    return draftName.trim().length > 0 && Number(draftPrice) > 0;
  }, [draftName, draftPrice]);

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
           <p className="text-gray-500 mt-2 mb-8 max-w-md">Please sign in to view and manage your wishlist.</p>
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
            <div className="p-6 md:p-10 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Wishlist</h1>
                  <p className="mt-1 text-sm text-[#8B95A5]">Your saved items — ready when you are.</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#1A1D29]">Add item</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">Create a saved item. Changes persist in your browser.</div>
                  </div>
                  {items.length > 0 && (
                    <button
                      onClick={clear}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                    >
                      Clear wishlist
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Name</label>
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Price</label>
                    <input
                      value={draftPrice}
                      onChange={(e) => setDraftPrice(e.target.value)}
                      className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                      placeholder="299"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Category link</label>
                    <input
                      value={draftCategoryHref}
                      onChange={(e) => setDraftCategoryHref(e.target.value)}
                      className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                      placeholder="/categories/electronics"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      if (!canAdd) return;
                      addItem({
                        id: crypto.randomUUID(),
                        name: draftName.trim(),
                        price: Number(draftPrice),
                        categoryHref: draftCategoryHref.trim() || undefined,
                      });
                      setDraftName('');
                      setDraftPrice('');
                    }}
                    disabled={!canAdd}
                    className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Add to wishlist
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-44 w-full rounded-2xl border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="h-44 rounded-2xl bg-gray-100 border border-gray-200" />
                    )}

                    <div className="mt-4">
                      <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Name</div>
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                        className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                      />
                    </div>

                    <div className="mt-3">
                      <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Price</div>
                      <div className="mt-2 text-lg font-bold text-[#1A1D29]">{formatZar(item.price)}</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        href={item.categoryHref || '/categories/electronics'}
                        className="text-sm font-semibold text-[#0B1220] hover:underline"
                      >
                        View category
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          vendor: item.vendor,
                          image: item.image,
                        });
                      }}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl premium-gradient px-5 py-3 text-sm font-semibold text-white"
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-[#8B95A5]">
                  Your wishlist is empty. Add an item above or browse deals.
                </div>
              )}

              <div className="mt-10 rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#FF6B4A]/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#0B1220]" />
                  </div>
                  <div>
                    <div className="font-black text-[#1A1D29]">Discover more</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">Browse deals or explore categories to save more items.</div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/deals" className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white">Browse deals</Link>
                      <Link href="/categories/electronics" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors">Explore electronics</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/" className="text-sm font-semibold text-[#0B1220] hover:underline">Back to home</Link>
                <Link href="/cart" className="text-sm font-semibold text-[#0B1220] hover:underline">Go to cart</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
