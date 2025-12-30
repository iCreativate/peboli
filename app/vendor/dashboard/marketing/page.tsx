'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, MousePointer, Eye, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  images: { url: string }[];
  isBoosted: boolean;
  boostExpiresAt: string;
  boostLevel: string;
  boostReach: number;
  boostClicks: number;
  boostSpend: number;
  soldCount: number;
  rating: number;
  stock: number;
}

interface Stats {
  spend: number;
  reach: number;
  clicks: number;
  ctr: number;
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'boosted' | 'organic'>('boosted');
  const [stats, setStats] = useState<Stats>({ spend: 0, reach: 0, clicks: 0, ctr: 0 });
  const [boostedProducts, setBoostedProducts] = useState<Product[]>([]);
  const [nonBoostedProducts, setNonBoostedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/vendor/marketing');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setBoostedProducts(data.boostedProducts);
        setNonBoostedProducts(data.nonBoostedProducts);
      }
    } catch (error) {
      console.error('Error fetching marketing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {subtext && <span className="text-sm text-gray-500">{subtext}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing Center</h1>
        <p className="text-gray-500">Track your campaign performance and boost reach</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Spend"
          value={`R${stats.spend.toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Total Reach"
          value={stats.reach.toLocaleString()}
          subtext="users"
          icon={Eye}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Click Rate (CTR)"
          value={`${stats.ctr.toFixed(1)}%`}
          icon={MousePointer}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Boosted Sales"
          value={boostedProducts.reduce((acc, p) => acc + p.soldCount, 0)}
          icon={TrendingUp}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab('boosted')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'boosted'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Boosted Products
            </button>
            <button
              onClick={() => setActiveTab('organic')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'organic'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Non-Boosted Products
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : activeTab === 'boosted' ? (
            boostedProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-medium">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Product</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Reach</th>
                      <th className="px-4 py-3 text-right">Clicks</th>
                      <th className="px-4 py-3 text-right">Sales</th>
                      <th className="px-4 py-3 text-right">Spend</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {boostedProducts.map((product) => (
                      <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              {product.images[0] && (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">R{Number(product.price).toFixed(2)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Expires {new Date(product.boostExpiresAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-medium">{product.boostReach}</td>
                        <td className="px-4 py-4 text-right font-medium">{product.boostClicks}</td>
                        <td className="px-4 py-4 text-right font-medium">{product.soldCount}</td>
                        <td className="px-4 py-4 text-right font-medium">R{Number(product.boostSpend).toFixed(2)}</td>
                        <td className="px-4 py-4 text-right font-medium">
                          {product.boostReach > 0 
                            ? ((product.boostClicks / product.boostReach) * 100).toFixed(1) 
                            : '0.0'}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No active campaigns</h3>
                <p className="text-gray-500 mt-1">Boost your products to see performance metrics here.</p>
              </div>
            )
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Product</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Sold</th>
                    <th className="px-4 py-3 text-right rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {nonBoostedProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.images[0] && (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">R{Number(product.price).toFixed(2)}</td>
                      <td className="px-4 py-4 text-right">{product.soldCount}</td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          onClick={() => router.push('/vendor/dashboard/products')}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Boost Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
