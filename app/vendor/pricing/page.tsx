'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, ChevronRight, CreditCard, Percent, Shield, Store, Box, Truck, Warehouse, CheckCircle2, Rocket, Sparkles } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui';

const TABS = [
  { id: 'subscription', label: 'Subscription', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'success', label: 'Success Fees', icon: <Percent className="h-4 w-4" /> },
  { id: 'boosting', label: 'Product Boosting', icon: <Rocket className="h-4 w-4" /> },
  { id: 'fulfillment', label: 'Fulfillment', icon: <Truck className="h-4 w-4" /> },
  { id: 'storage', label: 'Storage', icon: <Warehouse className="h-4 w-4" /> },
];

const CONTENT = {
  subscription: {
    title: 'Monthly Subscription',
    subtitle: 'Everything you need to manage and grow your business.',
    price: 'R250',
    period: 'per month',
    features: [
      'Access to the Peboli Seller Portal',
      'Unlimited product listings',
      'Real-time sales analytics & reporting',
      'Inventory management tools',
      'Marketing & promotion access',
      'Dedicated seller support'
    ],
    note: 'No setup fees.'
  },
  success: {
    title: 'Pay Only When You Sell',
    subtitle: 'A flat commission rate for all successful transactions.',
    description: 'Our success fees are calculated as a percentage of the selling price (VAT inclusive). You only pay this fee once a sale is successfully completed.',
    rates: [
      { category: 'All Categories', rate: '8.0%' }
    ],
    note: 'A simple, flat 8% fee applies to all successful transactions.'
  },
  boosting: {
    title: 'Boost Your Visibility',
    subtitle: 'Get your products in front of more customers with paid boosting.',
    description: 'Product boosting ensures your items appear at the top of search results and category pages. Choose a duration that fits your campaign goals.',
    tiers: [
      { size: 'Hourly', weight: '1 Hour', price: 'R5.00', details: 'Perfect for flash sales and quick promotions' },
      { size: 'Daily', weight: '24 Hours', price: 'R100.00', details: 'Great for "Deal of the Day" visibility' },
      { size: 'Weekly', weight: '7 Days', price: 'R600.00', details: 'Sustained visibility for new product launches' },
      { size: 'Monthly', weight: '30 Days', price: 'R2,000.00', details: 'Maximum exposure for top-selling items' }
    ],
    note: 'Boosted products receive a "Sponsored" tag and premium placement.'
  },
  fulfillment: {
    title: 'Hassle-Free Logistics',
    subtitle: 'We handle the picking, packing, and shipping for you.',
    description: 'Peboli Fulfillment Services (PFS) ensures your products reach customers quickly and safely. Fees are based on the weight and dimensions of the packaged item.',
    tiers: [
      { size: 'Small', weight: '0 - 1kg', price: 'R35.00', details: 'e.g., Phones, Accessories, T-shirts' },
      { size: 'Medium', weight: '1 - 5kg', price: 'R55.00', details: 'e.g., Shoes, Laptops, Kitchen Mixers' },
      { size: 'Large', weight: '5 - 20kg', price: 'R125.00', details: 'e.g., Microwaves, Monitors, Bedding Sets' },
      { size: 'Heavy / Bulky', weight: '20kg+', price: 'Custom Quote', details: 'e.g., Furniture, Large Appliances' }
    ],
    note: 'Includes packaging materials and standard courier insurance.'
  },
  storage: {
    title: 'Secure Warehousing',
    subtitle: 'Store your stock in our secure distribution centers.',
    description: 'Inventory storage fees are charged monthly based on the volume of space your products occupy. We incentivize fast-moving stock with lower rates.',
    features: [
      { label: 'First 30 Days', value: 'FREE', sub: 'For all new inventory shipments' },
      { label: 'Standard Storage', value: 'R5.00', sub: 'per cubic foot / month' },
      { label: 'Long-Term Storage', value: 'R45.00', sub: 'per cubic foot (stock over 365 days)' }
    ],
    note: 'Stock removal fees apply if you wish to withdraw inventory from our warehouses.'
  }
};

export default function VendorPricingPage() {
  const [activeTab, setActiveTab] = useState('subscription');
  const { openRegister } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220] text-white">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Vendor Portal</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black tracking-tight">Transparent Pricing</h1>
                <p className="mt-3 text-white/80 max-w-2xl leading-relaxed">
                  Simple, predictable fees designed to help you grow. No hidden costs—just clear value for your business.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap md:whitespace-normal",
                      activeTab === tab.id
                        ? "bg-white text-[#0B1220] ring-1 ring-gray-200"
                        : "text-[#8B95A5] hover:bg-gray-100 hover:text-[#1A1D29]"
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 md:p-10 min-h-[500px]">
                {/* Subscription Content */}
                {activeTab === 'subscription' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                      <div>
                        <h2 className="text-2xl font-black text-[#1A1D29]">{CONTENT.subscription.title}</h2>
                        <p className="mt-2 text-[#8B95A5]">{CONTENT.subscription.subtitle}</p>
                      </div>
                      <div className="text-right bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <div className="text-3xl font-black text-[#0B1220]">{CONTENT.subscription.price}</div>
                        <div className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider">{CONTENT.subscription.period}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {CONTENT.subscription.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-[#1A1D29]">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-sm text-[#8B95A5] flex items-center gap-2">
                      <Store className="h-4 w-4 text-blue-500" />
                      {CONTENT.subscription.note}
                    </div>
                  </div>
                )}

                {/* Success Fees Content */}
                {activeTab === 'success' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl font-black text-[#1A1D29]">{CONTENT.success.title}</h2>
                    <p className="mt-2 text-[#8B95A5] mb-6">{CONTENT.success.subtitle}</p>
                    
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                      <p className="text-sm text-[#1A1D29] leading-relaxed">{CONTENT.success.description}</p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-[#8B95A5] font-semibold uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3 text-right">Commission Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {CONTENT.success.rates.map((rate, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-6 py-4 font-medium text-[#1A1D29]">{rate.category}</td>
                              <td className="px-6 py-4 text-right font-bold text-[#0B1220]">{rate.rate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                     <p className="mt-4 text-xs text-[#8B95A5] italic">* {CONTENT.success.note}</p>
                  </div>
                )}

                {/* Boosting Content */}
                {activeTab === 'boosting' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl font-black text-[#1A1D29]">{CONTENT.boosting.title}</h2>
                    <p className="mt-2 text-[#8B95A5] mb-6">{CONTENT.boosting.subtitle}</p>
                    
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                      <p className="text-sm text-[#1A1D29] leading-relaxed">{CONTENT.boosting.description}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {CONTENT.boosting.tiers.map((tier, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center transition-transform">
                               <Rocket className="h-5 w-5" />
                            </div>
                            <div>
                               <div className="font-bold text-[#1A1D29]">{tier.size}</div>
                               <div className="text-xs text-[#8B95A5] mt-1">{tier.details}</div>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="text-lg font-black text-[#0B1220]">{tier.price}</div>
                             <div className="text-xs font-medium text-[#8B95A5] uppercase tracking-wider">{tier.weight}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-sm text-purple-700 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {CONTENT.boosting.note}
                    </div>
                  </div>
                )}

                {/* Fulfillment Content */}
                {activeTab === 'fulfillment' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl font-black text-[#1A1D29]">{CONTENT.fulfillment.title}</h2>
                    <p className="mt-2 text-[#8B95A5] mb-6">{CONTENT.fulfillment.subtitle}</p>

                     <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                      <p className="text-sm text-[#1A1D29] leading-relaxed">{CONTENT.fulfillment.description}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {CONTENT.fulfillment.tiers.map((tier, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-all">
                          <div>
                            <div className="flex items-center gap-2">
                               <span className="font-bold text-[#1A1D29]">{tier.size}</span>
                               <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[#8B95A5] font-medium">{tier.weight}</span>
                            </div>
                            <div className="mt-1 text-xs text-[#8B95A5]">{tier.details}</div>
                          </div>
                          <div className="text-lg font-black text-[#0B1220]">{tier.price}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-green-50/50 border border-green-100 text-sm text-green-700 flex items-center gap-2">
                      <Box className="h-4 w-4" />
                      {CONTENT.fulfillment.note}
                    </div>
                  </div>
                )}

                {/* Storage Content */}
                {activeTab === 'storage' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                     <h2 className="text-2xl font-black text-[#1A1D29]">{CONTENT.storage.title}</h2>
                    <p className="mt-2 text-[#8B95A5] mb-6">{CONTENT.storage.subtitle}</p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                      <p className="text-sm text-[#1A1D29] leading-relaxed">{CONTENT.storage.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {CONTENT.storage.features.map((feature, idx) => (
                        <div key={idx} className="p-6 rounded-2xl border border-gray-200 bg-white text-center">
                          <div className="text-xs font-bold text-[#8B95A5] uppercase tracking-wider mb-2">{feature.label}</div>
                          <div className="text-2xl font-black text-[#0B1220] mb-1">{feature.value}</div>
                          <div className="text-xs text-[#8B95A5]">{feature.sub}</div>
                        </div>
                      ))}
                    </div>

                     <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                        <Warehouse className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-orange-800">
                           <span className="font-semibold block mb-1">Important Note</span>
                           {CONTENT.storage.note}
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 md:p-10 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <div className="font-black text-[#1A1D29]">Ready to start selling?</div>
                   <div className="text-sm text-[#8B95A5] mt-1">Join thousands of successful sellers on Peboli.</div>
                </div>
                <div className="flex gap-3">
                   <Link
                      href="/sell"
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                    >
                      Learn More
                    </Link>
                    <button
                      onClick={openRegister}
                      className="inline-flex items-center justify-center rounded-xl bg-[#0B1220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                    >
                      Apply Now
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
