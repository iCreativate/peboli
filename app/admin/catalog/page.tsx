'use client';

import { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye,
  ShoppingBag,
  Download,
  Upload,
  ExternalLink,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminStore } from '@/lib/stores/admin';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ImportedProduct = {
  title?: string;
  description?: string;
  images: string[];
  currency?: string;
  price?: number;
  compareAtPrice?: number;
  brand?: string;
  category?: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function AdminCatalogPage() {
  const [activeTab, setActiveTab] = useState('All Products');
  const products = useAdminStore((s) => s.products);
  const addProduct = useAdminStore((s) => s.addProduct);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);
  const updateProduct = useAdminStore((s) => s.updateProduct);

  // --- Filter State ---
  const [filterQuery, setFilterQuery] = useState('');

  // --- Add/Import State ---
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [imported, setImported] = useState<ImportedProduct | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [draftName, setDraftName] = useState('');
  const [draftBrand, setDraftBrand] = useState('');
  const [draftCategory, setDraftCategory] = useState('electronics');
  const [draftPrice, setDraftPrice] = useState('');
  const [draftCompareAt, setDraftCompareAt] = useState('');
  const [draftImage, setDraftImage] = useState('');
  const [draftSplashSale, setDraftSplashSale] = useState(false);
  const [draftDescription, setDraftDescription] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [products, filterQuery]);

  const canAdd = useMemo(() => {
    return draftName.trim() && draftBrand.trim() && draftCategory.trim() && Number(draftPrice) > 0;
  }, [draftName, draftBrand, draftCategory, draftPrice]);

  const onAdd = () => {
    if (!canAdd) return;
    const id = crypto.randomUUID();
    const name = draftName.trim();
    addProduct({
      id,
      name,
      slug: slugify(name),
      brand: draftBrand.trim(),
      category: draftCategory.trim(),
      price: Number(draftPrice),
      compareAtPrice: draftCompareAt ? Number(draftCompareAt) : undefined,
      image: draftImage.trim() || undefined,
      isSplashSale: draftSplashSale,
      description: draftDescription.trim() || undefined,
    });
    // Reset
    setDraftName('');
    setDraftBrand('');
    setDraftCategory('electronics');
    setDraftPrice('');
    setDraftCompareAt('');
    setDraftImage('');
    setDraftSplashSale(false);
    setDraftDescription('');
    alert('Product added successfully!');
    setActiveTab('All Products');
  };

  const onImport = async () => {
    const u = importUrl.trim();
    if (!u) return;
    setImportLoading(true);
    setImportError(null);
    setImported(null);
    try {
      const res = await fetch(`/api/import-product?url=${encodeURIComponent(u)}`, { cache: 'no-store' });
      const data = (await res.json()) as unknown;
      if (!res.ok) {
        const err = (data as { error?: string })?.error;
        setImportError(err || 'Import failed');
        return;
      }

      const imgs = (data as { images?: unknown })?.images;
      if (!Array.isArray(imgs)) {
        setImportError('Import returned an unexpected response');
        return;
      }

      setImported(data as ImportedProduct);
      
      // Auto-fill draft fields from import
      const importedData = data as ImportedProduct;
      if (importedData.title) setDraftName(importedData.title);
      if (importedData.brand) setDraftBrand(importedData.brand);
      if (importedData.category) setDraftCategory(importedData.category);
      if (importedData.price) setDraftPrice(String(importedData.price));
      if (importedData.compareAtPrice) setDraftCompareAt(String(importedData.compareAtPrice));
      if (importedData.description) setDraftDescription(importedData.description);
      if (importedData.images?.[0]) setDraftImage(importedData.images[0]);

      // Attempt download
      if (importedData.images?.length) {
        setDownloadLoading(true);
        try {
           const dres = await fetch('/api/download-images', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ urls: importedData.images.slice(0, 12) }),
           });
           const ddata = await dres.json();
           if (dres.ok && ddata.urls?.length) {
             setImported(prev => prev ? ({ ...prev, images: ddata.urls }) : null);
             if (ddata.urls[0]) setDraftImage(ddata.urls[0]);
           }
        } catch (e) { console.error(e); }
        finally { setDownloadLoading(false); }
      }

    } catch {
      setImportError('Import failed. This site may block automated requests.');
    } finally {
      setImportLoading(false);
    }
  };

  const removeImportedImage = (url: string) => {
    if (!imported) return;
    const next = imported.images.filter((u) => u !== url);
    setImported({ ...imported, images: next });
    if (draftImage === url) setDraftImage(next[0] || '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#8B95A5]">Inventory</div>
          <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Product Catalog</h2>
          <p className="mt-2 text-sm text-[#8B95A5]">Manage your product listings, inventory, and imports.</p>
        </div>
        <Button 
          onClick={() => setActiveTab('Add Product')} 
          className="premium-gradient text-white border-0 shadow-lg shadow-blue-900/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {['All Products', 'Add Product', 'Import'].map((tab) => (
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

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'All Products' && (
          <div className="space-y-4">
             {/* Search/Filter Bar */}
             <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 premium-shadow">
               <Search className="h-4 w-4 text-gray-400" />
               <input 
                 className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
                 placeholder="Search products by name, brand, or category..."
                 value={filterQuery}
                 onChange={(e) => setFilterQuery(e.target.value)}
               />
               <div className="h-4 w-[1px] bg-gray-200 mx-2" />
               <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                 <Filter className="h-4 w-4 mr-2" />
                 Filter
               </Button>
             </div>

             {/* Products Table */}
             <div className="bg-white rounded-2xl border border-gray-100 premium-shadow overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                   <tr>
                     <th className="px-6 py-4">Product</th>
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Price</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {filteredProducts.length === 0 ? (
                     <tr>
                       <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                         No products found. Start by adding or importing one.
                       </td>
                     </tr>
                   ) : (
                     filteredProducts.map((product) => (
                       <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                               {product.image ? (
                                 <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                               ) : (
                                 <ShoppingBag className="h-5 w-5 text-gray-400" />
                               )}
                             </div>
                             <div>
                               <div className="font-bold text-gray-900">{product.name}</div>
                               <div className="text-xs text-gray-500">{product.brand}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                             {product.category}
                           </span>
                         </td>
                         <td className="px-6 py-4 font-medium text-gray-900">
                           R {product.price.toLocaleString()}
                           {product.compareAtPrice && (
                             <span className="ml-2 text-xs text-gray-400 line-through">
                               R {product.compareAtPrice.toLocaleString()}
                             </span>
                           )}
                         </td>
                         <td className="px-6 py-4">
                           {product.isSplashSale ? (
                             <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                               <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                               Splash Sale
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                               <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                               Active
                             </span>
                           )}
                         </td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                               <Edit className="h-4 w-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-8 w-8 text-gray-400 hover:text-red-600"
                               onClick={() => deleteProduct(product.id)}
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {(activeTab === 'Add Product' || activeTab === 'Import') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'Import' && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 premium-shadow space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Import from URL</h3>
                    <p className="text-sm text-gray-500">Paste a product link to auto-extract details.</p>
                  </div>
                  <div className="flex gap-3">
                    <Input 
                      placeholder="https://..." 
                      value={importUrl} 
                      onChange={(e) => setImportUrl(e.target.value)} 
                      className="flex-1"
                    />
                    <Button 
                      onClick={onImport} 
                      disabled={!importUrl.trim() || importLoading}
                      className="bg-gray-900 text-white hover:bg-gray-800"
                    >
                      {importLoading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                      Import
                    </Button>
                  </div>
                  {importError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      {importError}
                    </div>
                  )}
                  {imported && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                       <div className="flex items-center justify-between mb-4">
                         <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                           <Check className="h-4 w-4" />
                           Successfully extracted
                         </span>
                         <span className="text-xs text-gray-400">{imported.images.length} images found</span>
                       </div>
                       <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                         {imported.images.slice(0, 12).map((img, i) => (
                           <div key={i} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group">
                             <img src={img} className="h-full w-full object-cover" />
                             <button 
                               onClick={() => removeImportedImage(img)}
                               className="absolute top-1 right-1 h-6 w-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                             >
                               <Trash2 className="h-3 w-3" />
                             </button>
                             {draftImage === img && (
                               <div className="absolute inset-0 ring-2 ring-blue-500 pointer-events-none" />
                             )}
                             <button
                               onClick={() => setDraftImage(img)}
                               className="absolute inset-0 bg-transparent"
                             />
                           </div>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl border border-gray-100 premium-shadow space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
                  <p className="text-sm text-gray-500">Manual entry or edit imported details.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                    <Input 
                      className="mt-1.5" 
                      placeholder="e.g. Wireless Noise Cancelling Headphones"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Brand</label>
                    <Input 
                      className="mt-1.5" 
                      placeholder="e.g. Sony"
                      value={draftBrand}
                      onChange={(e) => setDraftBrand(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <Input 
                      className="mt-1.5" 
                      placeholder="e.g. electronics"
                      value={draftCategory}
                      onChange={(e) => setDraftCategory(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Price (ZAR)</label>
                    <Input 
                      className="mt-1.5" 
                      type="number"
                      placeholder="0.00"
                      value={draftPrice}
                      onChange={(e) => setDraftPrice(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Compare At Price</label>
                    <Input 
                      className="mt-1.5" 
                      type="number"
                      placeholder="0.00"
                      value={draftCompareAt}
                      onChange={(e) => setDraftCompareAt(e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Main Image URL</label>
                    <div className="flex gap-2 mt-1.5">
                      <Input 
                        placeholder="https://..."
                        value={draftImage}
                        onChange={(e) => setDraftImage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <textarea 
                      className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                      placeholder="Product description..."
                      value={draftDescription}
                      onChange={(e) => setDraftDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <input 
                    type="checkbox" 
                    id="splash"
                    checked={draftSplashSale}
                    onChange={(e) => setDraftSplashSale(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="splash" className="text-sm font-medium text-gray-700">
                    Mark as Splash Sale (Special Deal)
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Preview Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 premium-shadow sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <div className="aspect-square bg-gray-50 relative">
                    {draftImage ? (
                      <img src={draftImage} className="h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <ShoppingBag className="h-12 w-12" />
                      </div>
                    )}
                    {draftSplashSale && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        SPLASH SALE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      {draftBrand || 'Brand'}
                    </div>
                    <div className="font-bold text-gray-900 line-clamp-2 mb-2">
                      {draftName || 'Product Name'}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-gray-900">
                        R {Number(draftPrice || 0).toLocaleString()}
                      </span>
                      {Number(draftCompareAt) > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          R {Number(draftCompareAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full h-11 premium-gradient text-white font-bold rounded-xl shadow-lg shadow-blue-900/20"
                    disabled={!canAdd}
                    onClick={onAdd}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Save Product
                  </Button>
                  <Button variant="outline" className="w-full h-11 rounded-xl" onClick={() => setActiveTab('All Products')}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
