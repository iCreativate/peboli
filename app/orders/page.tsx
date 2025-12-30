'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BadgeCheck, ChevronRight, Package, RotateCcw, Truck, Download, X, Printer, FileText, Filter, Lock } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';

type OrderItem = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: string;
  items: number;
  delivery: string;
  products: string[];
};

const ORDERS: OrderItem[] = [
  {
    id: 'PB-20481',
    date: '12 Dec 2025',
    status: 'Delivered',
    total: 'R 1,899',
    items: 2,
    delivery: 'Delivered to Sandton, Johannesburg',
    products: ['Sony PlayStation 5 Console', 'DualSense Controller']
  },
  {
    id: 'PB-19807',
    date: '03 Dec 2025',
    status: 'Shipped',
    total: 'R 3,499',
    items: 1,
    delivery: 'On the way to Cape Town',
    products: ['Samsung 65" QLED 4K TV']
  },
  {
    id: 'PB-17622',
    date: '19 Nov 2025',
    status: 'Processing',
    total: 'R 899',
    items: 1,
    delivery: 'Preparing for dispatch',
    products: ['Nespresso Vertuo Next']
  },
  {
    id: 'PB-16500',
    date: '10 Nov 2025',
    status: 'Cancelled',
    total: 'R 450',
    items: 3,
    delivery: 'Cancelled by user',
    products: ['HDMI Cable', 'Power Strip', 'Cable Organizer']
  },
];

const STATUS_STYLE: Record<OrderItem['status'], string> = {
  Processing: 'bg-[#0B1220]/10 text-[#0B1220] border-[#0B1220]/15',
  Shipped: 'bg-[#0A1F44]/10 text-[#0A1F44] border-[#0A1F44]/15',
  Delivered: 'bg-[#00C48C]/10 text-[#0B1220] border-[#00C48C]/20',
  Cancelled: 'bg-[#FF6B4A]/10 text-[#1A1D29] border-[#FF6B4A]/15',
};

const TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'open', label: 'Open Orders' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'buy-again', label: 'Buy Again' },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { openLogin } = useUIStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

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
           <p className="text-gray-500 mt-2 mb-8 max-w-md">Please sign in to view your order history and track your purchases.</p>
           <Button onClick={openLogin} className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all">
             Sign In / Register
           </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredOrders = ORDERS.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return ['Processing', 'Shipped'].includes(order.status);
    if (activeTab === 'cancelled') return order.status === 'Cancelled';
    if (activeTab === 'buy-again') return order.status === 'Delivered';
    return true;
  });

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, this would trigger a file download
      alert(`Invoice for Order #${selectedOrder?.id} downloaded successfully!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[#8B95A5]">Orders</div>
                  <h1 className="mt-1 text-3xl md:text-4xl font-black text-[#1A1D29] tracking-tight">Your purchases</h1>
                  <p className="mt-2 text-sm md:text-base text-[#8B95A5] max-w-2xl">
                    Track deliveries, request returns, and keep everything in one place.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/returns"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                  >
                    Returns
                  </Link>
                  <Link
                    href="/deals"
                    className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Shop deals
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border",
                      activeTab === tab.id
                        ? "bg-[#1A1D29] text-white border-[#1A1D29]"
                        : "bg-white text-[#8B95A5] border-gray-200 hover:bg-gray-50 hover:text-[#1A1D29]"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-10 min-h-[400px] bg-gray-50/50">
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <div key={o.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-2xl border border-gray-100 bg-white p-6 premium-shadow hover:border-blue-200 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0B1220]/5 via-[#FF6B4A]/5 to-[#00C48C]/5 flex items-center justify-center text-[#0B1220] flex-shrink-0">
                            <Package className="h-6 w-6 opacity-70" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                              <div className="font-black text-lg text-[#1A1D29]">{o.id}</div>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[o.status]}`}>
                                {o.status}
                              </span>
                            </div>
                            <div className="text-sm text-[#8B95A5] mb-2">Placed {o.date} • {o.items} item(s)</div>
                            <div className="text-sm font-medium text-[#1A1D29]">{o.delivery}</div>
                            
                            {/* Product Preview */}
                            <div className="mt-3 text-xs text-gray-500">
                               Includes: {o.products.join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                          <div className="text-lg font-black text-[#1A1D29]">{o.total}</div>
                          <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            {o.status !== 'Cancelled' && (
                              <Link 
                                href="/track-order" 
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                              >
                                <Truck className="h-4 w-4" />
                                Track
                              </Link>
                            )}
                            {o.status === 'Delivered' && (
                              <Link
                                href="/returns"
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50 transition-colors"
                              >
                                <RotateCcw className="h-4 w-4" />
                                Return
                              </Link>
                            )}
                            {o.status !== 'Cancelled' && (
                              <button 
                                onClick={() => setSelectedOrder(o)}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl premium-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
                              >
                                <BadgeCheck className="h-4 w-4" />
                                Invoice
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1D29]">No orders found</h3>
                    <p className="text-gray-500 mt-2">Try selecting a different tab or start shopping.</p>
                    <Link href="/" className="mt-6 inline-block px-6 py-3 bg-[#1A1D29] text-white rounded-xl font-bold text-sm">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-10 rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0B1220]/6 via-transparent to-[#00C48C]/8 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#1A1D29]">Want faster checkout?</div>
                    <div className="mt-1 text-sm text-[#8B95A5]">Sign in to save details and track orders automatically.</div>
                  </div>
                  <button
                    onClick={openLogin}
                    className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Login
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/account" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] hover:underline">
                  Back to account
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* INVOICE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                   <FileText className="h-5 w-5" />
                </div>
                <div>
                   <h3 className="font-bold text-[#1A1D29]">Tax Invoice</h3>
                   <p className="text-xs text-gray-500">#{selectedOrder.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between mb-8">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Billed To</p>
                  <p className="font-bold text-[#1A1D29]">John Doe</p>
                  <p className="text-sm text-gray-500">123 Main Street</p>
                  <p className="text-sm text-gray-500">Johannesburg, 2000</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-gray-400 uppercase mb-1">Date Issued</p>
                   <p className="font-bold text-[#1A1D29]">{selectedOrder.date}</p>
                </div>
              </div>

              <div className="border rounded-xl overflow-hidden mb-8">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((product, idx) => (
                       <tr key={idx} className="border-b last:border-0">
                         <td className="p-3 text-[#1A1D29]">{product}</td>
                         <td className="p-3 text-right text-[#1A1D29]">{selectedOrder.total}</td>
                       </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                     <tr>
                       <td className="p-3 text-[#1A1D29]">Total</td>
                       <td className="p-3 text-right text-[#1A1D29]">{selectedOrder.total}</td>
                     </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={isDownloading}
                  className="flex-1 bg-[#1A1D29] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70"
                >
                  {isDownloading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </button>
                <button className="px-4 py-3 border border-gray-200 rounded-xl font-bold text-[#1A1D29] hover:bg-gray-50 transition-colors">
                  <Printer className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
