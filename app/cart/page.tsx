/* eslint-disable @next/next/no-img-element */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Shield, ShoppingCart, Trash2, Truck } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';

import { useCartStore } from '@/lib/stores/cart';

const formatZar = (n: number) => `R ${n.toLocaleString('en-ZA')}`;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);
  const updateItem = useCartStore((s) => s.updateItem);
  const clear = useCartStore((s) => s.clear);

  const [draftName, setDraftName] = useState('');
  const [draftPrice, setDraftPrice] = useState('');
  const [draftVendor, setDraftVendor] = useState('');

  const canAdd = useMemo(() => {
    return draftName.trim().length > 0 && Number(draftPrice) > 0;
  }, [draftName, draftPrice]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 1500 ? 0 : items.length > 0 ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Cart</h1>
                  <p className="mt-1 text-sm text-[#8B95A5]">Review items and checkout when you’re ready.</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <div className="font-bold text-[#1A1D29]">Add item</div>
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
                          placeholder="1299"
                          inputMode="numeric"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#1A1D29]">Vendor (optional)</label>
                        <input
                          value={draftVendor}
                          onChange={(e) => setDraftVendor(e.target.value)}
                          className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                          placeholder="Vendor name"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          if (!canAdd) return;
                          addItem({
                            id: crypto.randomUUID(),
                            name: draftName.trim(),
                            price: Number(draftPrice),
                            vendor: draftVendor.trim() || undefined,
                          });
                          setDraftName('');
                          setDraftPrice('');
                          setDraftVendor('');
                        }}
                        disabled={!canAdd}
                        className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        Add to cart
                      </button>
                      {items.length > 0 && (
                        <button
                          onClick={clear}
                          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                        >
                          Clear cart
                        </button>
                      )}
                    </div>
                  </div>

                  {items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-gray-100 bg-white premium-shadow p-5">
                      <div className="flex items-start gap-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 rounded-2xl border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-2xl bg-gray-100 border border-gray-200" />
                        )}
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                              <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Name</div>
                              <input
                                value={item.name}
                                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                                className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                              />
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Price</div>
                              <input
                                value={String(item.price)}
                                onChange={(e) => updateItem(item.id, { price: Number(e.target.value || 0) })}
                                className="mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-[#8B95A5]">
                            Sold by {item.vendor || '—'}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm font-black text-[#1A1D29]">{formatZar(item.price)}</div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setQty(item.id, item.qty - 1)}
                                className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                value={String(item.qty)}
                                onChange={(e) => setQty(item.id, Number(e.target.value || 1))}
                                className="h-10 w-16 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-[#1A1D29] text-center outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                                inputMode="numeric"
                                aria-label="Quantity"
                              />
                              <button
                                onClick={() => setQty(item.id, item.qty + 1)}
                                className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-[#0B1220]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1A1D29]">Delivery</div>
                        <div className="mt-1 text-sm text-[#8B95A5]">Shipping is {shipping === 0 ? 'free' : formatZar(shipping)} based on your basket.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6 h-fit">
                  <div className="font-black text-[#1A1D29]">Order summary</div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-[#8B95A5]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#1A1D29]">{formatZar(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8B95A5]">
                      <span>Shipping</span>
                      <span className="font-semibold text-[#1A1D29]">{shipping === 0 ? 'Free' : formatZar(shipping)}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-3" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1D29]">Total</span>
                      <span className="font-black text-[#1A1D29]">{formatZar(total)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-xl premium-gradient px-5 py-3 text-sm font-semibold text-white ${
                      items.length === 0 ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    Checkout
                  </Link>

                  <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-[#0B1220]" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#1A1D29]">Secure checkout</div>
                        <div className="mt-1 text-xs text-[#8B95A5]">Payments are encrypted and processed securely.</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/deals" className="text-sm font-semibold text-[#0B1220] hover:underline">Shop deals</Link>
                    <Link href="/wishlist" className="text-sm font-semibold text-[#0B1220] hover:underline">Wishlist</Link>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
