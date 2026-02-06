'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';
import { Store, Plus, Search, Trash2, ExternalLink, Filter, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminBrandsPage() {
  const brands = useAdminStore((s) => s.brands);
  const addBrand = useAdminStore((s) => s.addBrand);
  const updateBrand = useAdminStore((s) => s.updateBrand);
  const deleteBrand = useAdminStore((s) => s.deleteBrand);

  const [activeTab, setActiveTab] = useState('All Brands');
  const [filterQuery, setFilterQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('');

  const resetForm = () => {
    setName('');
    setSlug('');
    setLogo('');
    setWebsite('');
    setCategory('');
    setActiveTab('All Brands');
  };

  const onAdd = () => {
    const n = name.trim();
    if (!n) return;
    
    // Auto-generate slug if empty
    const s = slug.trim() || n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const id = Date.now().toString();

    addBrand({
      id,
      name: n,
      slug: s,
      logo: logo.trim() || undefined,
      website: website.trim() || undefined,
      category: category.trim() || undefined,
    });
    alert('Brand added successfully!');
    resetForm();
  };

  const filteredBrands = useMemo(() => {
    let res = brands;
    if (activeTab === 'Featured') {
      // Mock filter for featured - just taking first 5 for demo
      res = brands.slice(0, 5);
    } else if (activeTab === 'Pending') {
      // Mock filter for pending - empty for now or mock
      res = [];
    }

    if (filterQuery) {
      res = res.filter(b => 
        b.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
        (b.category && b.category.toLowerCase().includes(filterQuery.toLowerCase()))
      );
    }
    return res;
  }, [brands, filterQuery, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#8B95A5]">Catalog</div>
          <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Brand Store</h2>
          <p className="mt-2 text-sm text-[#8B95A5]">Manage featured brands and store tabs.</p>
        </div>
        <Button 
          onClick={() => setActiveTab('Add Brand')} 
          className="bg-[#0B1220] text-white border-0 hover:bg-[#1A1D29]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {['All Brands', 'Featured', 'Pending', 'Add Brand'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative pb-4 text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab 
                  ? "text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'Add Brand' ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-gray-100">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Brand</h3>
                <p className="text-sm text-gray-500 mt-1">Create a new brand profile for the store.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Brand Name</label>
                    <Input
                      placeholder="e.g. Nike"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Slug (URL)</label>
                    <Input
                      placeholder="e.g. nike"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Category / Tab</label>
                    <Input
                      placeholder="e.g. Sportswear"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Official Website</label>
                    <Input
                      placeholder="e.g. https://www.nike.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Logo URL</label>
                    <Input
                      placeholder="Paste image link..."
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                    />
                    <p className="text-xs text-gray-400">
                      Tip: Right-click an image on the brand's site and "Copy Image Address".
                    </p>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                   <div className="h-16 w-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                     {logo ? (
                       <img src={logo} className="h-full w-full object-contain p-2" />
                     ) : (
                       <Store className="h-6 w-6 text-gray-300" />
                     )}
                   </div>
                   <div>
                     <div className="font-bold text-gray-900">{name || 'Brand Name'}</div>
                     <div className="text-xs text-gray-500">{category || 'Category'}</div>
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                  <Button 
                    onClick={onAdd} 
                    disabled={!name}
                    className="bg-[#0B1220] text-white font-bold px-8 hover:bg-[#1A1D29]"
                  >
                    Save Brand
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100">
              <Search className="h-4 w-4 text-gray-400" />
              <input 
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
                placeholder="Search brands..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>

            {filteredBrands.length === 0 && activeTab === 'Pending' ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                <p className="text-sm text-gray-500 mt-1">There are no pending brand applications.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBrands.map((b) => (
                  <div key={b.id} className="group relative border border-gray-100 rounded-2xl p-5 bg-white hover:border-gray-200 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4">
                         <div className="h-14 w-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                           {b.logo ? (
                             <img src={b.logo} alt={b.name} className="h-full w-full object-contain p-2" />
                           ) : (
                             <Store className="h-6 w-6 text-gray-400" />
                           )}
                         </div>
                         <div>
                           <div className="font-bold text-gray-900 text-lg">{b.name}</div>
                           <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                             {b.category || 'General'}
                           </div>
                         </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         {b.website && (
                           <a href={b.website} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                             <ExternalLink className="h-4 w-4" />
                           </a>
                         )}
                         <button 
                           onClick={() => deleteBrand(b.id)}
                           className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                         >
                           <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Slug</label>
                         <Input 
                           className="h-8 text-xs mt-1 bg-gray-50/50 border-gray-100" 
                           value={b.slug} 
                           onChange={(e) => updateBrand(b.id, { slug: e.target.value })}
                         />
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                         <Input 
                           className="h-8 text-xs mt-1 bg-gray-50/50 border-gray-100" 
                           value={b.category || ''} 
                           onChange={(e) => updateBrand(b.id, { category: e.target.value })}
                         />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
