'use client';

import { Zap, Clock, Calendar, Plus, MoreHorizontal, ArrowRight, X, Save, Trash2, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Product = {
  id: string;
  name: string;
  price: number;
};

type Deal = {
  id: string;
  type: 'SPLASH_SALE' | 'DAILY_DEAL' | 'PRODUCT_CAMPAIGN' | 'ADVERT';
  title: string;
  description?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAST' | 'CANCELLED';
  discountPercentage?: number;
  discountAmount?: number;
  itemsCount?: number;
  productId?: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images?: Array<{ url: string }>;
  };
  imageUrl?: string;
  bannerUrl?: string;
  linkUrl?: string;
  startsAt?: string;
  endsAt?: string;
  revenue: number;
  views: number;
  clicks: number;
  conversions: number;
  priority: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

const TABS = ['Active Deals', 'Scheduled', 'Past', 'Drafts'];

const TYPE_LABELS: Record<Deal['type'], string> = {
  SPLASH_SALE: 'Splash Sale',
  DAILY_DEAL: 'Daily Deal',
  PRODUCT_CAMPAIGN: 'Product Campaign',
  ADVERT: 'Advert',
};

export default function DealModerationPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('Active Deals');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Partial<Deal>>({
    title: '',
    type: 'ADVERT',
    status: 'SCHEDULED',
    description: '',
    discountPercentage: undefined,
    discountAmount: undefined,
    itemsCount: undefined,
    productId: '',
    imageUrl: '',
    bannerUrl: '',
    linkUrl: '',
    startsAt: '',
    endsAt: '',
    priority: 0,
    isFeatured: false,
  });

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const statusMap: Record<string, string> = {
        'Active Deals': 'ACTIVE',
        'Scheduled': 'SCHEDULED',
        'Past': 'PAST',
        'Drafts': 'DRAFT',
      };

      const status = statusMap[activeTab];
      const response = await fetch(`/api/admin/deals${status ? `?status=${status}` : ''}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.deals)) {
        setDeals(data.deals);
      } else {
        console.error('Failed to fetch deals:', data.error);
        setDeals([]);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Failed to fetch products:', data.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredDeals = deals;

  const handleOpenCreate = () => {
    setEditingDeal(null);
    setFormData({
      title: '',
      type: 'ADVERT',
      status: 'SCHEDULED',
      description: '',
      discountPercentage: undefined,
      discountAmount: undefined,
      itemsCount: undefined,
      productId: '',
      imageUrl: '',
      bannerUrl: '',
      linkUrl: '',
      startsAt: '',
      endsAt: '',
      priority: 0,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      ...deal,
      startsAt: deal.startsAt ? new Date(deal.startsAt).toISOString().slice(0, 16) : '',
      endsAt: deal.endsAt ? new Date(deal.endsAt).toISOString().slice(0, 16) : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!editingDeal) return;
    
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        const response = await fetch(`/api/admin/deals/${editingDeal.id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          await fetchDeals();
          setIsModalOpen(false);
        } else {
          alert(`Failed to delete deal: ${data.error}`);
        }
      } catch (error) {
        console.error('Error deleting deal:', error);
        alert('Failed to delete deal. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: any = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        discountPercentage: formData.discountPercentage,
        discountAmount: formData.discountAmount,
        itemsCount: formData.itemsCount,
        productId: formData.productId || null,
        imageUrl: formData.imageUrl || null,
        bannerUrl: formData.bannerUrl || null,
        linkUrl: formData.linkUrl || null,
        startsAt: formData.startsAt || null,
        endsAt: formData.endsAt || null,
        priority: formData.priority || 0,
        isFeatured: formData.isFeatured || false,
      };

      let response;
      if (editingDeal) {
        response = await fetch(`/api/admin/deals/${editingDeal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/admin/deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (data.success) {
        await fetchDeals();
        setIsModalOpen(false);
      } else {
        alert(`Failed to ${editingDeal ? 'update' : 'create'} deal: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving deal:', error);
      alert(`Failed to ${editingDeal ? 'update' : 'create'} deal. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeRemaining = (endsAt?: string) => {
    if (!endsAt) return 'No end date';
    const end = new Date(endsAt);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Deal Moderation</h1>
          <p className="text-gray-500 mt-2">Manage splash sales, daily deals, and promotional campaigns.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchDeals}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <button 
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>
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
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No deals found. Create your first campaign!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDeals.map((deal) => {
            const progress = deal.endsAt 
              ? Math.max(0, Math.min(100, ((new Date(deal.endsAt).getTime() - Date.now()) / (new Date(deal.endsAt).getTime() - (deal.startsAt ? new Date(deal.startsAt).getTime() : Date.now()))) * 100))
              : 0;

            return (
              <div 
                key={deal.id} 
                onClick={() => handleOpenEdit(deal)}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all duration-300 relative overflow-hidden cursor-pointer"
              >
                {/* Progress Bar Background for Active Deals */}
                {deal.status === 'ACTIVE' && (
                  <div className="absolute bottom-0 left-0 h-1 bg-blue-100 w-full">
                    <div className="h-full bg-blue-600" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    deal.type === 'ADVERT' 
                      ? 'bg-amber-50 text-amber-700 border-amber-100' 
                      : deal.type === 'PRODUCT_CAMPAIGN'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      : 'bg-green-50 text-green-700 border-green-100'
                  }`}>
                    {deal.type === 'ADVERT' ? <Zap className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {TYPE_LABELS[deal.type]}
                  </span>
                  {deal.isFeatured && (
                    <span className="text-xs font-medium text-blue-600">⭐ Featured</span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{deal.title}</h3>
                {deal.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{deal.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  {deal.itemsCount && <span>{deal.itemsCount} Items</span>}
                  {deal.discountPercentage && <span>{deal.discountPercentage}% OFF</span>}
                  {deal.discountAmount && <span>{formatCurrency(deal.discountAmount)} OFF</span>}
                  {(deal.itemsCount || deal.discountPercentage || deal.discountAmount) && (
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                  )}
                  <span className={`${
                    deal.status === 'ACTIVE' ? 'text-red-500 font-medium' : 'text-gray-500'
                  } flex items-center gap-1`}>
                    <Clock className="h-3 w-3" />
                    {deal.status === 'ACTIVE' ? `Ends in ${formatTimeRemaining(deal.endsAt)}` : formatTimeRemaining(deal.endsAt)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Revenue</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(deal.revenue)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        
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
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">{editingDeal ? 'Edit Campaign' : 'New Campaign'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">Campaign Title *</label>
                <Input 
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Summer Sale"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Campaign description..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium text-gray-700">Type *</label>
                  <select 
                    id="type"
                    name="type"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="SPLASH_SALE">Splash Sale</option>
                    <option value="DAILY_DEAL">Daily Deal</option>
                    <option value="PRODUCT_CAMPAIGN">Product Campaign</option>
                    <option value="ADVERT">Advert</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium text-gray-700">Status *</label>
                  <select 
                    id="status"
                    name="status"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAST">Past</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startsAt" className="text-sm font-medium text-gray-700">Starts At</label>
                  <Input 
                    id="startsAt"
                    name="startsAt"
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endsAt" className="text-sm font-medium text-gray-700">Ends At</label>
                  <Input 
                    id="endsAt"
                    name="endsAt"
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                  />
                </div>
              </div>

              {(formData.type === 'SPLASH_SALE' || formData.type === 'DAILY_DEAL') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="discountPercentage" className="text-sm font-medium text-gray-700">Discount %</label>
                    <Input 
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercentage || ''}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="e.g. 50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="itemsCount" className="text-sm font-medium text-gray-700">Items Count</label>
                    <Input 
                      id="itemsCount"
                      name="itemsCount"
                      type="number"
                      min="0"
                      value={formData.itemsCount || ''}
                      onChange={(e) => setFormData({ ...formData, itemsCount: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="e.g. 50"
                    />
                  </div>
                </div>
              )}

              {(formData.type === 'SPLASH_SALE' || formData.type === 'DAILY_DEAL' || formData.type === 'PRODUCT_CAMPAIGN') && (
                <div className="space-y-2">
                  <label htmlFor="productId" className="text-sm font-medium text-gray-700">Product *</label>
                  <select
                    id="productId"
                    name="productId"
                    required={['SPLASH_SALE', 'DAILY_DEAL', 'PRODUCT_CAMPAIGN'].includes(formData.type)}
                    value={formData.productId || ''}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select a product...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({formatCurrency(product.price)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === 'ADVERT' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">Banner Image URL</label>
                    <Input 
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="linkUrl" className="text-sm font-medium text-gray-700">Link URL</label>
                    <Input 
                      id="linkUrl"
                      name="linkUrl"
                      value={formData.linkUrl || ''}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</label>
                  <Input 
                    id="priority"
                    name="priority"
                    type="number"
                    value={formData.priority || 0}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                {editingDeal && (
                  <Button type="button" variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingDeal ? 'Save Changes' : 'Create Campaign'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
