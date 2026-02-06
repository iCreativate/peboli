'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, MapPin, User, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus) return;

    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${params.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrder();
        alert('Order status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-gray-500">Order not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="relative">
              <select
                value={order.status}
                onChange={handleStatusUpdate}
                disabled={updating || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                className="h-10 w-[180px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Items
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {/* Placeholder for product image */}
                    <div className="w-full h-full bg-gray-200" /> 
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">R {Number(item.price).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Total: R {Number(item.total).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">R {Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500">Delivery</span>
                    <span className="font-medium">R {Number(order.delivery).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>R {Number(order.total).toFixed(2)}</span>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block">Name</span>
                <span className="font-medium text-gray-900">{order.user.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Email</span>
                <span className="font-medium text-gray-900">{order.user.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Phone</span>
                <span className="font-medium text-gray-900">{order.user.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
                {order.address ? (
                    <>
                        <p>{order.address.streetAddress}</p>
                        {order.address.complex && <p>{order.address.complex}</p>}
                        <p>{order.address.suburb}, {order.address.city}</p>
                        <p>{order.address.province}, {order.address.postalCode}</p>
                    </>
                ) : (
                    <p>No address provided (Collection?)</p>
                )}
            </div>
          </div>

           {/* Payment Details */}
           <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block">Method</span>
                <span className="font-medium text-gray-900 capitalize">{order.paymentMethod.toLowerCase().replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Paid
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
