'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Store, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  TikTok,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const TABS = ['Today', '7 Days', '30 Days', '12 Months'];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('Today');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [] as any[],
    monthlyRevenue: Array(12).fill(0)
  });
  const [socialMedia, setSocialMedia] = useState<Record<string, string>>({});
  const [loadingSocial, setLoadingSocial] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/admin')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(console.error);

    fetch('/api/admin/social-media')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.socialMedia) {
          setSocialMedia(data.socialMedia);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingSocial(false));
  }, []);

  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-blue-400' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'tiktok', name: 'TikTok', icon: TikTok, color: 'text-black' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time summary of platform performance and activity.
          </p>
        </div>

        {/* Time Range Tabs */}
        <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === tab
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">R {stats.totalRevenue.toFixed(2)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3" />
              +48
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Active Users</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalUsers}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Store className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              0 pending
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Verified Vendors</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalVendors}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <ArrowDownRight className="h-3 w-3" />
              -2.4%
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Orders</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalOrders}</h3>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6">Revenue Overview</h3>
        <div className="h-[300px] flex items-end gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
           {stats.monthlyRevenue && stats.monthlyRevenue.map((rev, i) => {
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
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {stats.recentOrders.length > 0 ? stats.recentOrders.map((order, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-emerald-600 bg-emerald-50`}>
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">New Order</p>
                  <p className="text-xs text-gray-500">{order.user.name || order.user.email} - {order.items.length} items</p>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <p className="p-4 text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>

        {/* Platform Health / Quick Stats */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Platform Health</h3>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-700">Server Load</span>
                <span className="text-green-600">Healthy (24%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[24%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-700">Database Storage</span>
                <span className="text-blue-600">45% used</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-700">API Response Time</span>
                <span className="text-gray-900">124ms</span>
              </div>
              <div className="flex gap-1 h-8 items-end">
                {[40, 65, 30, 80, 45, 60, 35, 90, 40, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-100 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20">
            <h4 className="font-bold text-lg mb-2">Pro Tip</h4>
            <p className="text-blue-100 text-sm mb-4">
              Review pending vendor applications to increase catalog diversity.
            </p>
            <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors w-full border border-white/20">
              View Vendors
            </button>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-900">Social Media</h3>
            <p className="text-sm text-gray-500 mt-1">Manage your social media profiles</p>
          </div>
          <Link
            href="/admin/settings"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Manage →
          </Link>
        </div>
        
        {loadingSocial ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              const url = socialMedia[platform.id];
              
              return (
                <div
                  key={platform.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    url
                      ? 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                      : 'border-gray-100 bg-gray-50/50'
                  }`}
                >
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 group"
                    >
                      <Icon className={`h-6 w-6 ${platform.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-xs font-medium text-gray-700 truncate w-full text-center">
                        {platform.name}
                      </span>
                      <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Icon className={`h-6 w-6 ${platform.color} opacity-50`} />
                      <span className="text-xs font-medium text-gray-400 text-center">
                        {platform.name}
                      </span>
                      <span className="text-[10px] text-gray-400 text-center">Not set</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
