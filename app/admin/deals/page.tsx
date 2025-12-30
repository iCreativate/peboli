'use client';

import { Zap, Clock, Calendar, Plus, MoreHorizontal, ArrowRight, X, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Deal = {
  id: number;
  type: 'Advert' | 'Product Campaign';
  title: string;
  items?: number;
  discount?: string;
  ends: string;
  status: 'Active' | 'Scheduled' | 'Past' | 'Draft';
  revenue: string;
  progress: number;
  productId?: string; // For Product Campaign
  imageUrl?: string;  // For Advert
};

const INITIAL_DEALS: Deal[] = [
  { id: 1, type: 'Advert', title: 'Summer Electronics Blowout', items: 24, ends: '2h 15m', status: 'Active', revenue: 'R 45,200', progress: 75 },
  { id: 2, type: 'Product Campaign', title: 'Samsung 55" TV', discount: '40% OFF', ends: '45m', status: 'Active', revenue: 'R 12,500', progress: 90 },
  { id: 3, type: 'Advert', title: 'Winter Fashion Clearance', items: 150, ends: 'Starts in 2d', status: 'Scheduled', revenue: 'R 0', progress: 0 },
  { id: 4, type: 'Product Campaign', title: 'Sony WH-1000XM5', discount: '25% OFF', ends: 'Ended', status: 'Past', revenue: 'R 89,000', progress: 100 },
];

const TABS = ['Active Deals', 'Scheduled', 'Past', 'Drafts'];

export default function DealModerationPage() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [activeTab, setActiveTab] = useState('Active Deals');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Partial<Deal>>({
    title: '',
    type: 'Advert',
    status: 'Scheduled',
    ends: '',
    discount: '',
    items: 0,
    productId: '',
    imageUrl: ''
  });

  const filteredDeals = deals.filter(deal => {
    if (activeTab === 'Active Deals') return deal.status === 'Active';
    if (activeTab === 'Scheduled') return deal.status === 'Scheduled';
    if (activeTab === 'Past') return deal.status === 'Past';
    if (activeTab === 'Drafts') return deal.status === 'Draft';
    return true;
  });

  const handleOpenCreate = () => {
    setEditingDeal(null);
    setFormData({
      title: '',
      type: 'Advert',
      status: 'Scheduled',
      ends: '24h',
      discount: '',
      items: 0,
      progress: 0,
      revenue: 'R 0',
      productId: '',
      imageUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({ ...deal });
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (editingDeal && confirm('Are you sure you want to delete this campaign?')) {
      setDeals(deals.filter(d => d.id !== editingDeal.id));
      setIsModalOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeal) {
      // Edit
      setDeals(deals.map(d => d.id === editingDeal.id ? { ...d, ...formData } as Deal : d));
    } else {
      // Create
      const newDeal: Deal = {
        id: Math.max(...deals.map(d => d.id)) + 1,
        title: formData.title!,
        type: formData.type as any,
        status: formData.status as any,
        ends: formData.ends || '24h',
        discount: formData.discount,
        items: formData.items,
        revenue: 'R 0',
        progress: 0,
        productId: formData.productId,
        imageUrl: formData.imageUrl
      };
      setDeals([newDeal, ...deals]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Deal Moderation</h1>
          <p className="text-gray-500 mt-2">Manage splash sales, daily deals, and promotional campaigns.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-1">
        <div className="flex items-center gap-8 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDeals.map((deal) => (
          <div 
            key={deal.id} 
            onClick={() => handleOpenEdit(deal)}
            className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            {/* Progress Bar Background for Active Deals */}
            {deal.status === 'Active' && (
              <div className="absolute bottom-0 left-0 h-1 bg-blue-100 w-full">
                <div className="h-full bg-blue-600" style={{ width: `${deal.progress}%` }} />
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                deal.type === 'Advert' 
                  ? 'bg-amber-50 text-amber-700 border-amber-100' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-100'
              }`}>
                {deal.type === 'Advert' ? <Zap className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                {deal.type}
              </span>
              <button className="text-gray-400 hover:text-gray-900 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{deal.title}</h3>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              {deal.items && <span>{deal.items} Items</span>}
              {deal.discount && <span>{deal.discount}</span>}
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className={`${
                deal.status === 'Active' ? 'text-red-500 font-medium' : 'text-gray-500'
              } flex items-center gap-1`}>
                <Clock className="h-3 w-3" />
                {deal.status === 'Active' ? `Ends in ${deal.ends}` : deal.ends}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Revenue</p>
                <p className="text-lg font-bold text-gray-900">{deal.revenue}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State for Create */}
        <button 
          onClick={handleOpenCreate}
          className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all min-h-[200px]"
        >
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Create New Campaign</h3>
          <p className="text-sm text-gray-500 text-center">Schedule a flash sale or daily deal</p>
        </button>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingDeal ? 'Edit Campaign' : 'New Campaign'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Campaign Title</label>
                <Input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Summer Sale"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="Advert">Advert</option>
                    <option value="Product Campaign">Product Campaign</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Past">Past</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Duration / Ends</label>
                    <Input 
                      value={formData.ends}
                      onChange={(e) => setFormData({ ...formData, ends: e.target.value })}
                      placeholder="e.g. 24h or 2d"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Discount / Items</label>
                    <Input 
                      value={formData.type === 'Product Campaign' ? formData.discount : formData.items}
                      onChange={(e) => {
                          if (formData.type === 'Product Campaign') {
                              setFormData({ ...formData, discount: e.target.value });
                          } else {
                              setFormData({ ...formData, items: parseInt(e.target.value) || 0 });
                          }
                      }}
                      placeholder={formData.type === 'Product Campaign' ? "e.g. 50% OFF" : "e.g. 50 Items"}
                    />
                 </div>
              </div>

              {formData.type === 'Product Campaign' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product ID / SKU</label>
                  <Input 
                    value={formData.productId || ''}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    placeholder="Enter Product ID or SKU"
                  />
                </div>
              )}

              {formData.type === 'Advert' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Banner Image URL</label>
                  <Input 
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                {editingDeal && (
                   <Button type="button" variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                   </Button>
                )}
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {editingDeal ? 'Save Changes' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
