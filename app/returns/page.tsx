'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, Package, RotateCcw, Shield, Truck, Search, AlertCircle, Clock, Calendar } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'start', label: 'Start a Return' },
  { id: 'track', label: 'Track Returns' },
  { id: 'policy', label: 'Return Policy' },
];

const MOCK_ELIGIBLE_ORDERS = [
  {
    id: 'PB-20481',
    date: '12 Dec 2025',
    item: 'Sony PlayStation 5 Console',
    image: '🎮',
    status: 'Delivered',
    eligible: true
  },
  {
    id: 'PB-19807',
    date: '03 Dec 2025',
    item: 'Samsung 65" QLED 4K TV',
    image: '📺',
    status: 'Delivered',
    eligible: true
  }
];

const MOCK_ACTIVE_RETURNS = [
  {
    id: 'RET-8821',
    orderId: 'PB-17622',
    item: 'Nespresso Vertuo Next',
    date: '20 Dec 2025',
    status: 'Collection Scheduled',
    step: 2,
    timeline: [
      { status: 'Return Logged', date: '20 Dec 2025, 09:30', completed: true },
      { status: 'Collection Scheduled', date: '21 Dec 2025, 14:00', completed: true },
      { status: 'Item Received', date: 'Pending', completed: false },
      { status: 'Refund Processed', date: 'Pending', completed: false },
    ]
  }
];

const STEPS = [
  {
    title: 'Start a return',
    description: 'Find the order and choose the item you want to return.',
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: 'Choose a reason',
    description: 'Tell us why you’re returning the item to speed up processing.',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: 'Drop off or collection',
    description: 'Select your preferred return method (options vary by region).',
    icon: <Truck className="h-5 w-5" />,
  },
  {
    title: 'Refund processing',
    description: 'Refunds are processed after inspection and confirmation.',
    icon: <RotateCcw className="h-5 w-5" />,
  },
];

const POLICY = [
  'Keep original packaging where possible',
  'Return within the eligible return window',
  'Items must be in sellable condition unless faulty',
  'Refunds return to your original payment method',
];

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('start');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Returns Center</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Returns & Refunds</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Manage your returns, track status, and view our policies in one place.
                </p>

                {/* Tabs */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-6 py-3 rounded-xl text-sm font-bold transition-all",
                        activeTab === tab.id
                          ? "bg-white text-[#1A1D29] shadow-lg"
                          : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10 min-h-[400px]">
              
              {/* START A RETURN TAB */}
              {activeTab === 'start' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1A1D29]">Select an item to return</h2>
                      <p className="text-gray-500 text-sm">Choose from your recent eligible orders below.</p>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {MOCK_ELIGIBLE_ORDERS.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                            {order.image}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-gray-400">Order #{order.id} • {order.date}</span>
                              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Eligible for Return</span>
                            </div>
                            <h3 className="font-bold text-[#1A1D29] group-hover:text-blue-600 transition-colors">{order.item}</h3>
                            <p className="text-sm text-gray-500">{order.status}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm">Can't find your order?</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Only items delivered within the last 30 days are shown here. 
                        For older items, please check our warranty policy or <Link href="/contact" className="underline font-semibold">contact support</Link>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TRACK RETURNS TAB */}
              {activeTab === 'track' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-[#1A1D29] mb-6">Active Returns</h2>
                  
                  <div className="space-y-6">
                    {MOCK_ACTIVE_RETURNS.map((ret) => (
                      <div key={ret.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-2">
                          <div>
                            <span className="text-xs font-bold text-gray-500 block">Return ID</span>
                            <span className="font-bold text-[#1A1D29]">{ret.id}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-500 block">Original Order</span>
                            <span className="font-bold text-[#1A1D29]">{ret.orderId}</span>
                          </div>
                           <div className="md:text-right">
                            <span className="text-xs font-bold text-gray-500 block">Status</span>
                            <span className="font-bold text-orange-600">{ret.status}</span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                           <div className="flex items-center gap-3 mb-6">
                              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                ☕️
                              </div>
                              <div>
                                <h3 className="font-bold text-[#1A1D29]">{ret.item}</h3>
                                <p className="text-sm text-gray-500">Logged on {ret.date}</p>
                              </div>
                           </div>

                           {/* Timeline */}
                           <div className="relative">
                              <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                              <div className="space-y-6 relative">
                                {ret.timeline.map((step, idx) => (
                                  <div key={idx} className="flex gap-4 items-start">
                                    <div className={cn(
                                      "h-5 w-5 rounded-full border-2 flex-shrink-0 z-10 bg-white",
                                      step.completed ? "border-green-500 bg-green-500" : "border-gray-200"
                                    )}>
                                      {step.completed && <CheckCircle2 className="h-full w-full text-white p-0.5" />}
                                    </div>
                                    <div>
                                      <p className={cn("text-sm font-bold", step.completed ? "text-[#1A1D29]" : "text-gray-400")}>{step.status}</p>
                                      <p className="text-xs text-gray-500">{step.date}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* POLICY TAB (Existing Content) */}
              {activeTab === 'policy' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {STEPS.map((s) => (
                      <div key={s.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
                            {s.icon}
                          </div>
                          <div>
                            <div className="font-black text-[#1A1D29]">{s.title}</div>
                            <div className="mt-2 text-sm text-[#8B95A5] leading-relaxed">{s.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-bold text-[#1A1D29] mb-4">Return Guidelines</h3>
                    <ul className="space-y-3">
                      {POLICY.map((p) => (
                        <li key={p} className="flex gap-3 text-sm text-gray-600">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
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
