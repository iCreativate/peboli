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
                    ? 'bg-white border border-gray-200 text-[#0B1220] font-semibold'
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
                    ? 'bg-white border border-gray-200 text-[#0B1220] font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Wallet className="h-5 w-5" />
                Credits & Vouchers
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Payment Methods</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  You haven't added any payment methods yet. Add a card to make checkout easier.
                </p>
                <button className="px-6 py-2.5 bg-[#0B1220] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
