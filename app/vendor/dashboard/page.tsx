'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function VendorDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    recentSales: [] as any[],
    monthlyRevenue: Array(12).fill(0)
  });

  useEffect(() => {
    fetch('/api/analytics/vendor')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(console.error);
  }, []);

  const STATS = [
    { label: 'Total Revenue', value: `R ${stats.totalRevenue.toFixed(2)}`, change: 'Total', icon: DollarSign },
    { label: 'Units Sold', value: stats.totalSales, change: 'Total', icon: ShoppingCart },
    { label: 'Products', value: stats.totalProducts, change: 'Active', icon: Package },
    { label: 'Low Stock', value: stats.lowStockProducts, change: 'Alert', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of your store performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <Icon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-[300px] flex items-end gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
            {/* Real Chart Data */}
            {stats.monthlyRevenue.map((rev, i) => {
              const maxRev = Math.max(...stats.monthlyRevenue, 1);
              const heightPercentage = (rev / maxRev) * 100;
              
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div 
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-blue-600"
                    style={{ height: `${heightPercentage}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    R {rev.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 px-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Sales</h3>
          <div className="space-y-6">
             {stats.recentSales.length > 0 ? stats.recentSales.map((sale) => (
               <div key={sale.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                     {sale.product.images?.[0]?.url ? (
                        <img src={sale.product.images[0].url} alt="" className="h-full w-full object-cover" />
                     ) : (
                        <Package className="h-5 w-5" />
                     )}
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-900">Order #{sale.order.orderNumber}</p>
                     <p className="text-xs text-gray-500">{new Date(sale.order.createdAt).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <div className="text-sm font-medium text-gray-900">R {Number(sale.total).toFixed(2)}</div>
               </div>
             )) : (
               <p className="text-sm text-gray-500">No recent sales</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
