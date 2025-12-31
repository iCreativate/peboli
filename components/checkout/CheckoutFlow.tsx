'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Truck, Lock } from 'lucide-react';

export function CheckoutFlow() {
  const [step, setStep] = useState(1);
  const [isGuest, setIsGuest] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#1A1D29] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Step 1: Authentication */}
            {step === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-[#1A1D29] mb-4">Sign In or Continue as Guest</h2>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-[#0B1220] hover:bg-[#050A14] text-white"
                    onClick={() => setStep(2)}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsGuest(true);
                      setStep(2);
                    }}
                  >
                    Continue as Guest
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Delivery & Contact */}
            {step === 2 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="h-5 w-5 text-[#0B1220]" />
                  <h2 className="text-xl font-bold text-[#1A1D29]">Delivery & Contact</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D29] mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+27 82 123 4567"
                      className="w-full"
                    />
                    <p className="text-xs text-[#8B95A5] mt-1">
                      We&apos;ll send WhatsApp updates about your order
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D29] mb-2">
                      Delivery Address
                    </label>
                    <Input
                      type="text"
                      placeholder="Street address"
                      className="w-full mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="text" placeholder="City" />
                      <Input type="text" placeholder="Province" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Postal Code"
                      className="w-full mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D29] mb-2">
                      Delivery Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                        <input type="radio" name="delivery" value="standard" defaultChecked />
                        <div className="flex-1">
                          <p className="font-semibold">Standard Delivery (4-7 days)</p>
                          <p className="text-sm text-[#8B95A5]">R50</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                        <input type="radio" name="delivery" value="express" />
                        <div className="flex-1">
                          <p className="font-semibold">Express Delivery (2-3 days)</p>
                          <p className="text-sm text-[#8B95A5]">R100</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-[#0B1220] hover:bg-[#050A14] text-white"
                    onClick={() => setStep(3)}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-[#0B1220]" />
                  <h2 className="text-xl font-bold text-[#1A1D29]">Payment</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1D29] mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                        <input type="radio" name="payment" value="card" defaultChecked />
                        <div className="flex-1">
                          <p className="font-semibold">Credit/Debit Card</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                        <input type="radio" name="payment" value="eft" />
                        <div className="flex-1">
                          <p className="font-semibold">Instant EFT</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F7F8FA]">
                        <input type="radio" name="payment" value="bnpl" />
                        <div className="flex-1">
                          <p className="font-semibold">Buy Now Pay Later</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#8B95A5]">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                  <Button
                    className="w-full bg-[#0B1220] hover:bg-[#050A14] text-white"
                    onClick={() => setStep(4)}
                  >
                    Complete Order
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-[#00C48C] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-[#1A1D29] mb-2">Order Confirmed!</h2>
                <p className="text-[#8B95A5] mb-6">
                  Your order #SS-782934 has been placed successfully.
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-[#0B1220] hover:bg-[#050A14] text-white">
                    Track Order
                  </Button>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#1A1D29] mb-4">Order Summary</h2>
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-[#F7F8FA] rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-[#1A1D29]">Product Name</p>
                      <p className="text-sm text-[#8B95A5]">Qty: 1</p>
                      <p className="font-bold text-[#1A1D29]">{formatPrice(12999)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B95A5]">Subtotal</span>
                    <span className="text-[#1A1D29]">{formatPrice(12999)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B95A5]">Delivery</span>
                    <span className="text-[#1A1D29]">{formatPrice(50)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#00C48C]">
                    <span>Savings</span>
                    <span>-{formatPrice(7000)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-[#1A1D29]">Total</span>
                    <span className="text-[#1A1D29]">{formatPrice(6049)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="pt-4 border-t">
                  <Input
                    type="text"
                    placeholder="Promo code"
                    className="w-full mb-2"
                  />
                  <Button variant="outline" className="w-full text-sm">
                    Apply Code
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

