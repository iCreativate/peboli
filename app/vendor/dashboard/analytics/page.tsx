'use client';

import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

const ANALYTICS_STATS = [
  { label: 'Total Revenue', value: 'R 0.00', change: '+0%', icon: DollarSign },
  { label: 'Total Orders', value: '0', change: '+0%', icon: BarChart3 },
  { label: 'Conversion Rate', value: '0%', change: '+0%', icon: TrendingUp },
  { label: 'Unique Visitors', value: '0', change: '+0%', icon: Users },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Insights into your store's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ANALYTICS_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-6 bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between pb-2">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <Icon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Revenue over time</h3>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 text-gray-400 text-sm">
            Chart Visualization (Coming Soon)
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Top Products</h3>
          <div className="space-y-4">
             <div className="text-sm text-gray-500 text-center py-12">No sales data yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}
