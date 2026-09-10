'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Truck, Lock, Banknote } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';

type PaymentInstructions = {
  method: string;
  eft: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
    reference: string;
    amount: number;
  };
  whatsappUrl: string;
  note: string;
};

type PlacedOrder = {
  id: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
};

export function CheckoutFlow() {
  const { data: session } = useSession();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [step, setStep] = useState(items.length === 0 ? 0 : 1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [paymentInstructions, setPaymentInstructions] = useState<PaymentInstructions | null>(null);

  const [fullName, setFullName] = useState(session?.user?.name ?? '');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'collection' | 'delivery'>('collection');
  const [paymentMethod, setPaymentMethod] = useState<'eft' | 'whatsapp'>('eft');

  useEffect(() => {
    if (session?.user?.name) setFullName(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const delivery = deliveryMethod === 'delivery' && items.length > 0 ? 99 : 0;
  const total = subtotal + delivery;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(price);

  const canProceedDelivery =
    fullName.trim() && email.trim() && phone.trim() && line1.trim() && city.trim() && province.trim();

  const placeOrder = async () => {
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    const missingVendor = items.some((i) => !i.vendorId);
    if (missingVendor) {
      setError('Some cart items are missing product data. Remove them and add products from the shop again.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.qty,
            price: i.price,
            vendorId: i.vendorId,
          })),
          subtotal,
          delivery,
          savings: 0,
          total,
          paymentMethod: paymentMethod === 'whatsapp' ? 'WhatsApp EFT' : 'Bank EFT',
          deliveryMethod: deliveryMethod === 'collection' ? 'Collection (Gauteng)' : 'Standard delivery',
          guest: {
            email: email.trim(),
            name: fullName.trim(),
            phone: phone.trim(),
            address: {
              fullName: fullName.trim(),
              phone: phone.trim(),
              line1: line1.trim(),
              line2: line2.trim() || undefined,
              city: city.trim(),
              province: province.trim(),
              postalCode: postalCode.trim(),
              country: 'South Africa',
            },
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Could not place order. Please try again.');
        return;
      }

      setPlacedOrder(data.order);
      setPaymentInstructions(data.paymentInstructions);
      clearCart();
      setStep(3);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 0 || items.length === 0 && !placedOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-[#1A1D29] mb-2">Your cart is empty</h2>
          <p className="text-[#8B95A5] mb-6">Add Local Shelf products before checkout.</p>
          <Button asChild className="bg-[#0B1220] hover:bg-[#050A14] text-white">
            <Link href="/">Browse Peboli</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#1A1D29] mb-2">Checkout</h1>
        <p className="text-[#8B95A5] mb-8">Peboli Local Shelf — buy after pay via EFT or WhatsApp. Prices shown are final sell prices.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>
            )}

            {step === 1 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="h-5 w-5 text-[#0B1220]" />
                  <h2 className="text-xl font-bold text-[#1A1D29]">Contact & delivery</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1D29] mb-2">Full name</label>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Mthembu" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1A1D29] mb-2">Email</label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={Boolean(session?.user?.email)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D29] mb-2">WhatsApp / phone</label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 123 4567" />
                    <p className="text-xs text-[#8B95A5] mt-1">We&apos;ll confirm payment and collection on WhatsApp</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D29] mb-2">Street address</label>
                    <Input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="123 Main Rd" className="mb-2" />
                    <Input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Suburb (optional)" className="mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                      <Input value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Province" />
                    </div>
                    <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal code" className="mt-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D29] mb-2">Fulfillment</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                        <input type="radio" name="delivery" checked={deliveryMethod === 'collection'} onChange={() => setDeliveryMethod('collection')} />
                        <div className="flex-1">
                          <p className="font-semibold">Collection (Gauteng)</p>
                          <p className="text-sm text-[#8B95A5]">Free — arrange after payment</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                        <input type="radio" name="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} />
                        <div className="flex-1">
                          <p className="font-semibold">Delivery (Gauteng)</p>
                          <p className="text-sm text-[#8B95A5]">{formatPrice(99)}</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-[#0B1220] hover:bg-[#050A14] text-white"
                    disabled={!canProceedDelivery}
                    onClick={() => setStep(2)}
                  >
                    Continue to payment
                  </Button>
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Banknote className="h-5 w-5 text-[#0B1220]" />
                  <h2 className="text-xl font-bold text-[#1A1D29]">Pay after order</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-[#8B95A5]">
                    No card charge at checkout. Place your order, then pay by EFT or WhatsApp. We release goods once payment clears.
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                      <input type="radio" name="payment" checked={paymentMethod === 'eft'} onChange={() => setPaymentMethod('eft')} />
                      <div className="flex-1">
                        <p className="font-semibold">Bank EFT</p>
                        <p className="text-sm text-[#8B95A5]">Use reference shown after placing order</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                      <input type="radio" name="payment" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} />
                      <div className="flex-1">
                        <p className="font-semibold">WhatsApp first</p>
                        <p className="text-sm text-[#8B95A5]">Message us to confirm and get EFT details</p>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#8B95A5]">
                    <Lock className="h-4 w-4" />
                    <span>Peboli Local Shelf — honest Gauteng resale, not a dropship marketplace</span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={submitting}>
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-[#0B1220] hover:bg-[#050A14] text-white"
                      onClick={placeOrder}
                      disabled={submitting}
                    >
                      {submitting ? 'Placing order…' : 'Place order'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {step === 3 && placedOrder && (
              <Card className="p-6">
                <div className="w-16 h-16 bg-[#00C48C] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-[#1A1D29] mb-2 text-center">Order placed</h2>
                <p className="text-[#8B95A5] mb-6 text-center">
                  Order <strong>#{placedOrder.orderNumber}</strong> — total {formatPrice(placedOrder.total)}. Pay to confirm.
                </p>

                {paymentInstructions && (
                  <div className="rounded-xl bg-[#F7F8FA] p-5 mb-6 text-sm space-y-2">
                    <p className="font-semibold text-[#1A1D29]">Payment instructions</p>
                    <p className="text-[#8B95A5]">{paymentInstructions.note}</p>
                    {paymentInstructions.eft.bankName && (
                      <ul className="space-y-1 text-[#1A1D29]">
                        <li>Bank: {paymentInstructions.eft.bankName}</li>
                        <li>Account: {paymentInstructions.eft.accountName}</li>
                        <li>Number: {paymentInstructions.eft.accountNumber}</li>
                        {paymentInstructions.eft.branchCode && <li>Branch: {paymentInstructions.eft.branchCode}</li>}
                        <li>Reference: <strong>{paymentInstructions.eft.reference}</strong></li>
                        <li>Amount: <strong>{formatPrice(paymentInstructions.eft.amount)}</strong></li>
                      </ul>
                    )}
                    {!paymentInstructions.eft.bankName && (
                      <p className="text-amber-700">EFT bank details not configured yet — use WhatsApp below or contact the shop.</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {paymentInstructions?.whatsappUrl && (
                    <Button asChild className="w-full bg-[#25D366] hover:bg-[#1da851] text-white">
                      <a href={paymentInstructions.whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 mr-2 inline" />
                        Pay via WhatsApp
                      </a>
                    </Button>
                  )}
                  <Button className="w-full bg-[#0B1220] hover:bg-[#050A14] text-white" onClick={() => router.push('/orders')}>
                    View my orders
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">Continue shopping</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#1A1D29] mb-4">Order summary</h2>
              <div className="space-y-4">
                <div className="space-y-3">
                  {(step === 3 ? [] : items).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 bg-[#F7F8FA] rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-[#1A1D29]">{item.name}</p>
                        <p className="text-sm text-[#8B95A5]">Qty: {item.qty}</p>
                        <p className="font-bold text-[#1A1D29]">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                  {step === 3 && placedOrder && (
                    <p className="text-sm text-[#8B95A5]">Cart cleared — order #{placedOrder.orderNumber} saved.</p>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B95A5]">Subtotal</span>
                    <span className="text-[#1A1D29]">{formatPrice(step === 3 && placedOrder ? placedOrder.total - delivery : subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B95A5]">Delivery</span>
                    <span className="text-[#1A1D29]">{formatPrice(delivery)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-[#1A1D29]">Total</span>
                    <span className="text-[#1A1D29]">{formatPrice(step === 3 && placedOrder ? placedOrder.total : total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
