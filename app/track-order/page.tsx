'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle2, MapPin, Clock, AlertCircle } from 'lucide-react';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'order', label: 'Track by Order ID' },
  { id: 'delivery', label: 'Track by Delivery Number' },
  { id: 'guide', label: 'Status Guide' },
];


const STATUS_GUIDE = [
  {
    status: 'Processing',
    description: 'We have received your order and are preparing it for shipment.',
    icon: <Package className="h-5 w-5" />,
    color: 'text-blue-600 bg-blue-50'
  },
  {
    status: 'Shipped',
    description: 'Your order has left our warehouse and is with the courier.',
    icon: <Truck className="h-5 w-5" />,
    color: 'text-orange-600 bg-orange-50'
  },
  {
    status: 'Out for Delivery',
    description: 'The driver is on the way to your delivery address.',
    icon: <MapPin className="h-5 w-5" />,
    color: 'text-purple-600 bg-purple-50'
  },
  {
    status: 'Delivered',
    description: 'Your package has been successfully delivered.',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-green-600 bg-green-50'
  },
];

type OrderTracking = {
  id: string;
  date: string;
  status: string;
  items: string[];
  eta: string;
  progress: number;
  steps: Array<{ status: string; date: string; completed: boolean }>;
};

export default function TrackOrderPage() {
  const [activeTab, setActiveTab] = useState('order');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<OrderTracking | null>(null);
  const [trackingError, setTrackingError] = useState('');
  const [activeOrders, setActiveOrders] = useState<OrderTracking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const orders = await res.json();
        // Transform orders to tracking format
        const transformed = orders
          .filter((o: any) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED')
          .map((order: any) => ({
            id: order.orderNumber,
            date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: order.status,
            items: order.items?.map((item: any) => item.product?.name || 'Product') || [],
            eta: order.estimatedDelivery || 'Pending',
            progress: calculateProgress(order.status),
            steps: getOrderSteps(order.status, order.createdAt)
          }));
        setActiveOrders(transformed);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (status: string): number => {
    const statusMap: Record<string, number> = {
      'PROCESSING': 20,
      'PACKED': 40,
      'SHIPPED': 60,
      'IN_TRANSIT': 70,
      'OUT_FOR_DELIVERY': 90,
      'DELIVERED': 100
    };
    return statusMap[status] || 0;
  };

  const getOrderSteps = (status: string, createdAt: string) => {
    const baseDate = new Date(createdAt);
    const steps = [
      { status: 'Order Placed', date: baseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), completed: true },
      { status: 'Payment Confirmed', date: new Date(baseDate.getTime() + 5 * 60000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), completed: true },
      { status: 'Packed', date: 'Pending', completed: false },
      { status: 'Shipped', date: 'Pending', completed: false },
      { status: 'Out for Delivery', date: 'Pending', completed: false },
      { status: 'Delivered', date: 'Pending', completed: false },
    ];
    
    const statusOrder = ['PROCESSING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= currentIndex,
      date: idx <= currentIndex ? step.date : 'Pending'
    }));
  };

  const handleTrackPackage = async () => {
    setTrackingError('');
    setTrackingResult(null);

    if (!trackingNumber.trim()) {
      setTrackingError('Please enter a tracking number.');
      return;
    }

    try {
      const res = await fetch(`/api/orders/track?trackingNumber=${trackingNumber.trim()}`);
      if (res.ok) {
        const order = await res.json();
        setTrackingResult({
          id: order.orderNumber,
          date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: order.status,
          items: order.items?.map((item: any) => item.product?.name || 'Product') || [],
          eta: order.estimatedDelivery || 'Pending',
          progress: calculateProgress(order.status),
          steps: getOrderSteps(order.status, order.createdAt)
        });
      } else {
        setTrackingError('Tracking number not found. Please check and try again.');
      }
    } catch (error) {
      setTrackingError('Error tracking package. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white premium-shadow overflow-hidden">
            <div className="p-6 md:p-10 premium-gradient">
              <div className="max-w-3xl">
                <div className="text-white/80 text-sm font-semibold">Logistics</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Track Your Order</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Stay updated on your delivery status and estimated arrival times.
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
              
              {/* TRACK BY ORDER ID */}
              {activeTab === 'order' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="max-w-xl mb-10">
                    <label className="block text-sm font-bold text-[#1A1D29] mb-2">Order Number</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. PB-123456" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full shadow-sm"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1A1D29] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition-colors">
                        Track
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-[#1A1D29] mb-4">Recent Orders</h3>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading orders...</div>
                  ) : activeOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No active orders to track</div>
                  ) : (
                    <div className="grid gap-6">
                      {activeOrders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-2">
                          <div>
                            <span className="text-xs font-bold text-gray-500 block">Order #{order.id}</span>
                            <span className="text-sm font-medium text-[#1A1D29]">{order.items.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-bold text-blue-700">ETA: {order.eta}</span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                             <div className="font-bold text-[#1A1D29]">{order.status}</div>
                             <div className="text-sm text-gray-500">{order.progress}% Complete</div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>

                          {/* Timeline Steps */}
                          <div className="flex justify-between relative">
                            {/* Connecting Line */}
                            <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-gray-100 -z-10 hidden md:block"></div>
                            
                            {order.steps.map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-2 text-center w-24">
                                <div className={cn(
                                  "h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white z-0",
                                  step.completed ? "border-green-500" : "border-gray-200"
                                )}>
                                  {step.completed && <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>}
                                </div>
                                <div className="hidden md:block">
                                  <p className={cn("text-xs font-bold", step.completed ? "text-[#1A1D29]" : "text-gray-400")}>{step.status}</p>
                                  <p className="text-[10px] text-gray-400">{step.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Mobile Timeline View */}
                          <div className="md:hidden space-y-4 mt-4 relative">
                             <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                             {order.steps.map((step, idx) => (
                               <div key={idx} className="flex gap-4 items-start relative">
                                 <div className={cn(
                                   "h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white z-10 flex-shrink-0",
                                   step.completed ? "border-green-500" : "border-gray-200"
                                 )}>
                                   {step.completed && <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>}
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
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TRACK BY DELIVERY NUMBER */}
              {activeTab === 'delivery' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="max-w-xl mx-auto text-center py-10">
                    <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#1A1D29] mb-2">Track by Delivery Number</h2>
                    <p className="text-gray-500 text-sm mb-6">Enter the tracking number provided by the courier.</p>
                    
                    <div className="text-left">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="e.g. TRK-99887766" 
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full shadow-sm"
                        />
                      </div>
                      <button 
                        onClick={handleTrackPackage}
                        className="mt-4 w-full bg-[#1A1D29] text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
                      >
                        Track Package
                      </button>
                    </div>

                    {trackingError && (
                      <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {trackingError}
                      </div>
                    )}

                    <div className="mt-8 text-left bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        <span className="font-bold">Note:</span> Tracking updates may take up to 24 hours to appear after the package has been shipped.
                      </p>
                    </div>
                  </div>

                  {trackingResult && (
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <div>
                          <span className="text-xs font-bold text-gray-500 block">Tracking #{trackingResult.id}</span>
                          <span className="text-sm font-medium text-[#1A1D29]">{trackingResult.items.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-bold text-blue-700">ETA: {trackingResult.eta}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                           <div className="font-bold text-[#1A1D29]">{trackingResult.status}</div>
                           <div className="text-sm text-gray-500">{trackingResult.progress}% Complete</div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                            style={{ width: `${trackingResult.progress}%` }}
                          ></div>
                        </div>

                        {/* Timeline Steps */}
                        <div className="flex justify-between relative">
                          {/* Connecting Line */}
                          <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-gray-100 -z-10 hidden md:block"></div>
                          
                          {trackingResult.steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 text-center w-24">
                              <div className={cn(
                                "h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white z-0",
                                step.completed ? "border-green-500" : "border-gray-200"
                              )}>
                                {step.completed && <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>}
                              </div>
                              <div className="hidden md:block">
                                <p className={cn("text-xs font-bold", step.completed ? "text-[#1A1D29]" : "text-gray-400")}>{step.status}</p>
                                <p className="text-[10px] text-gray-400">{step.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Mobile Timeline View */}
                        <div className="md:hidden space-y-4 mt-4 relative">
                           <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                           {trackingResult.steps.map((step, idx) => (
                             <div key={idx} className="flex gap-4 items-start relative">
                               <div className={cn(
                                 "h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white z-10 flex-shrink-0",
                                 step.completed ? "border-green-500" : "border-gray-200"
                               )}>
                                 {step.completed && <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>}
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
                  )}
                </div>
              )}

              {/* STATUS GUIDE */}
              {activeTab === 'guide' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {STATUS_GUIDE.map((status) => (
                      <div key={status.status} className="border border-gray-100 rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", status.color)}>
                          {status.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1A1D29] text-lg">{status.status}</h3>
                          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{status.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 bg-gray-50 rounded-2xl p-8 text-center">
                    <h3 className="font-bold text-[#1A1D29] mb-2">Still have questions?</h3>
                    <p className="text-gray-500 text-sm mb-6">Our support team is here to help with any delivery issues.</p>
                    <Link href="/help" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-[#1A1D29] font-bold text-sm hover:bg-gray-100 transition-colors">
                      Visit Help Center
                    </Link>
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
