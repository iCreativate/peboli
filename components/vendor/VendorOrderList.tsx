'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Filter, Clock, CheckCircle2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

type OrderItem = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  customer: { name: string; email: string };
  product: {
    name: string;
    image: string;
    price: number;
    quantity: number;
    total: number;
  };
  deliveryMethod: string;
};

export function VendorOrderList() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/vendor/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage your customer orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-xs text-gray-500">Total Orders</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
           <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Pending Delivery</div>
          </div>
        </div>
         <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
           <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
             </div>
             <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
             <p className="text-gray-500 mt-2">When you make a sale, it will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((item) => (
              <div key={item.id + item.product.name} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                      {item.customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.customer.name}</div>
                      <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()} • {item.orderNumber}</div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    Processing
                  </div>
                </div>
                
                <div className="flex items-start gap-4 pl-11">
                  <div className="h-16 w-16 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span>Qty: {item.product.quantity}</span>
                      <span>Total: R {item.product.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
