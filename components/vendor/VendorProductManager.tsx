'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Search, Filter, Image as ImageIcon, Rocket, Check, ShoppingBag, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BoostProductModal } from './BoostProductModal';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  category: { name: string } | null;
  createdAt: string;
  isBoosted?: boolean;
  boostExpiresAt?: string;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
};

export function VendorProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Boost Modal State
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState(''); // For sales
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Collections State
  const [availableCollections, setAvailableCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [filterBoosted, setFilterBoosted] = useState<boolean | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
    fetchCategories();
    fetchVendorProfile();
  }, []);

  const fetchVendorProfile = async () => {
    try {
      const res = await fetch('/api/vendor/profile');
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(Number(data.walletBalance || 0));
      }
    } catch (error) {
      console.error('Failed to fetch vendor profile', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/vendor/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAvailableCollections(data);
      }
    } catch (error) {
      console.error('Failed to fetch collections', error);
    }
  };

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setBrand(product.brand);
    setPrice(product.price.toString());
    setOriginalPrice(product.compareAtPrice ? product.compareAtPrice.toString() : '');
    setStock(product.stock.toString());
    setImages(product.images || []);
    setDescription(product.description || '');
    setSelectedCategory(product.categoryId);
    // Note: collections are complex to pre-fill without fetching full product details or including them in list
    // For now we skip pre-filling collections or assume they are in product object if modified API returns them
    setIsAdding(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                return data.url;
            }
            console.error('Upload failed for file:', file.name);
        } catch (error) {
            console.error('Upload error:', error);
        }
        return null;
    });

    try {
        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter((url): url is string => url !== null);
        
        if (successfulUploads.length > 0) {
            setImages(prev => [...prev, ...successfulUploads]);
        } else {
            alert('Failed to upload images');
        }
    } catch (error) {
        console.error('Error processing uploads:', error);
        alert('Error processing uploads');
    } finally {
        setUploading(false);
        e.target.value = '';
    }
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
        setImages(prev => [...prev, imageUrlInput.trim()]);
        setImageUrlInput('');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setSubmitting(true);
    try {
        const url = '/api/vendor/products';
        const method = editingId ? 'PUT' : 'POST';
        
        const payload: any = {
            name,
            brand,
            price,
            compareAtPrice: originalPrice || undefined,
            stock,
            images,
            description,
            collectionIds: selectedCollections,
            categoryId: selectedCategory,
        };

        if (editingId) payload.id = editingId;

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        setName('');
        setBrand('');
        setPrice('');
        setOriginalPrice('');
        setStock('');
        setImages([]);
        setImageUrlInput('');
        setDescription('');
        setSelectedCollections([]);
        if (categories.length > 0) setSelectedCategory(categories[0].id);
        fetchProducts();
      } else {
        alert(editingId ? 'Failed to update product' : 'Failed to create product');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/vendor/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId }),
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingId(null);
        setName('');
        setBrand('');
        setPrice('');
        setOriginalPrice('');
        setStock('');
        setImages([]);
        setImageUrlInput('');
        setDescription('');
        setSelectedCollections([]);
        if (categories.length > 0) setSelectedCategory(categories[0].id);
        fetchProducts();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (isAdding) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#1A1D29] tracking-tight">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-sm text-[#8B95A5]">Fill in the details below to {editingId ? 'update' : 'create'} your product.</p>
          </div>
          <Button variant="outline" onClick={() => {
            setIsAdding(false);
            setEditingId(null);
            setName('');
            setBrand('');
            setPrice('');
            setOriginalPrice('');
            setStock('');
            setImages([]);
            setImageUrlInput('');
            setDescription('');
            setSelectedCollections([]);
          }}>
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
                <p className="text-sm text-gray-500">Basic information about your product.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                  <Input 
                    className="mt-1.5" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                    required 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Brand</label>
                  <Input 
                    className="mt-1.5" 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)} 
                    placeholder="e.g. Sony"
                    required 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex w-full mt-1.5 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Price (ZAR)</label>
                  <Input 
                    className="mt-1.5" 
                    type="number"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="0.00"
                    required 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Compare At Price</label>
                  <Input 
                    className="mt-1.5" 
                    type="number"
                    value={originalPrice} 
                    onChange={(e) => setOriginalPrice(e.target.value)} 
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Stock Quantity</label>
                  <Input 
                    className="mt-1.5" 
                    type="number"
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    placeholder="0"
                    required 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Product Images</label>
                  
                  {/* Image Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-1.5">
                    <Input 
                      value={imageUrlInput} 
                      onChange={(e) => setImageUrlInput(e.target.value)} 
                      placeholder="https://..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addImageUrl();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addImageUrl}>
                      Add
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        disabled={uploading}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="px-3 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600"
                        disabled={uploading}
                      >
                        {uploading ? (
                           <div className="h-4 w-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                        ) : (
                           <Upload className="h-4 w-4" />
                        )}
                        <span className="sr-only">Upload Images</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Paste a URL or upload images (multiple allowed).</p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                  <textarea 
                    className="w-full mt-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                    placeholder="Describe your product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Collections</h3>
                <p className="text-sm text-gray-500">Select collections where this product should appear.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableCollections.map((col) => {
                  const isSelected = selectedCollections.includes(col.id);
                  return (
                    <div 
                      key={col.id}
                      onClick={() => toggleCollection(col.id)}
                      className={`
                        cursor-pointer rounded-xl border p-3 flex items-center justify-between transition-all
                        ${isSelected 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="text-sm font-medium">{col.name}</span>
                      {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="aspect-square bg-gray-50 relative">
                  {images.length > 0 ? (
                    <img src={images[0]} className="h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <ShoppingBag className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                    {brand || 'Brand'}
                  </div>
                  <div className="font-bold text-gray-900 line-clamp-2 mb-2">
                    {name || 'Product Name'}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-gray-900">
                      R {Number(price || 0).toLocaleString()}
                    </span>
                    {Number(originalPrice) > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        R {Number(originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full h-11 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={submitting || !name || !price}
                  onClick={(e) => handleSubmit(e as any)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {submitting ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
                </Button>
                {editingId && (
                  <Button 
                    type="button"
                    className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                    onClick={handleDelete}
                    disabled={submitting}
                  >
                    Delete Product
                  </Button>
                )}
                <Button variant="outline" className="w-full h-11 rounded-xl" onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setName('');
                  setBrand('');
                  setPrice('');
                  setOriginalPrice('');
                  setStock('');
                  setImages([]);
                  setImageUrlInput('');
                  setDescription('');
                  setSelectedCollections([]);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product listings.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-gray-900 text-white hover:bg-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-10 bg-white border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setFilterBoosted(null)}
            className={`border-gray-200 ${filterBoosted === null ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500'}`}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setFilterBoosted(true)}
            className={`flex items-center gap-2 border-gray-200 ${filterBoosted === true ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-500'}`}
          >
            <Rocket className="h-4 w-4" />
            Boosted
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setFilterBoosted(false)}
            className={`border-gray-200 ${filterBoosted === false ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500'}`}
          >
            Standard
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="h-8 w-8 animate-spin mx-auto mb-2 rounded-full border-2 border-blue-600 border-t-transparent" />
                    <p>Loading products...</p>
                  </td>
                </tr>
              ) : products
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .filter(p => filterBoosted === null ? true : filterBoosted ? p.isBoosted : !p.isBoosted)
                .length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="mx-auto h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-900">No products found</p>
                    <p className="text-sm mt-1">Try adjusting your search or add a new product.</p>
                  </td>
                </tr>
              ) : (
                products
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(p => filterBoosted === null ? true : filterBoosted ? p.isBoosted : !p.isBoosted)
                  .map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    onClick={() => handleEdit(product)}
                  >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">R {Number(product.price).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 w-fit">
                        Active
                      </span>
                      {product.isBoosted && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 w-fit">
                          <Rocket className="h-3 w-3 mr-1" />
                          Boosted
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => {
                        setSelectedProduct(product);
                        setBoostModalOpen(true);
                      }}
                    >
                      <Rocket className="h-3 w-3 mr-1.5" />
                      Boost
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BoostProductModal 
        isOpen={boostModalOpen}
        product={selectedProduct}
        walletBalance={walletBalance}
        onClose={() => {
          setBoostModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          fetchProducts();
          alert('Product boosted successfully!');
        }}
      />
    </div>
  );
}
