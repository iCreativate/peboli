'use client';

import { useState } from 'react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { CreditCard, Plus, Wallet, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'cards' | 'credits'>('cards');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/account" className="hover:text-gray-900 transition-colors">Account</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-gray-900">Payments & Credit</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
              <button
                onClick={() => setActiveTab('cards')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'cards'
                    ? 'bg-white premium-shadow text-[#0B1220] font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Saved Cards
              </button>
              <button
                onClick={() => setActiveTab('credits')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'credits'
                    ? 'bg-white premium-shadow text-[#0B1220] font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Wallet className="h-5 w-5" />
                Credits & Vouchers
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'cards' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 premium-shadow p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h1 className="text-2xl font-black text-[#1A1D29] tracking-tight">Saved Cards</h1>
                        <p className="text-gray-500 mt-1">Manage your payment methods for faster checkout.</p>
                      </div>
                      <Button className="rounded-xl bg-gradient-to-r from-[#0B1220] to-[#1A2333] text-white premium-shadow hover:scale-105 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Card
                      </Button>
                    </div>

                    {/* Empty State Mock */}
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <CreditCard className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-bold text-gray-900">No saved cards yet</h3>
                      <p className="text-gray-500 max-w-sm mt-2 mb-6">
                        Add a credit or debit card to checkout faster. Your card details are securely stored.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <span className="font-semibold">Secure Payments:</span> All card information is encrypted and processed securely. We never store your CVV number.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'credits' && (
                <div className="space-y-6">
                  {/* Balance Card */}
                  <div className="bg-gradient-to-br from-[#0B1220] to-[#1A2333] rounded-3xl p-8 text-white premium-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF6B4A] to-[#00C48C] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="text-white/60 font-medium mb-2">Available Balance</div>
                      <div className="text-4xl md:text-5xl font-black tracking-tight">R 0.00</div>
                      <div className="mt-6 flex gap-3">
                        <Button className="bg-white/10 hover:bg-white/20 border-0 text-white backdrop-blur-md rounded-xl">
                          Redeem Voucher
                        </Button>
                        <Button className="bg-white text-[#0B1220] hover:bg-gray-50 rounded-xl">
                          Top Up
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div className="bg-white rounded-3xl border border-gray-100 premium-shadow p-6 md:p-8">
                    <h2 className="text-xl font-bold text-[#1A1D29] mb-6">Transaction History</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Plus className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Welcome Bonus</div>
                            <div className="text-xs text-gray-500">24 Dec 2025</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">+R 0.00</div>
                          <div className="text-xs text-gray-500">Completed</div>
                        </div>
                      </div>
                      {/* More items would go here */}
                    </div>
                  </div>
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
