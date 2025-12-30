'use client';

import { useMemo, useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminStore } from '@/lib/stores/admin';

type ImportedProduct = {
  title?: string;
  description?: string;
  images: string[];
  currency?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
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

export function CatalogSettings() {
  const products = useAdminStore((s) => s.products);
  const addProduct = useAdminStore((s) => s.addProduct);
  const updateProduct = useAdminStore((s) => s.updateProduct);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);

  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [imported, setImported] = useState<ImportedProduct | null>(null);
  const [generateOnePerImage, setGenerateOnePerImage] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [draftName, setDraftName] = useState('');
  const [draftBrand, setDraftBrand] = useState('');
  const [draftCategory, setDraftCategory] = useState('electronics');
  const [draftPrice, setDraftPrice] = useState('');
  const [draftStock, setDraftStock] = useState('');
  const [draftCompareAt, setDraftCompareAt] = useState('');
  const [draftOrigin, setDraftOrigin] = useState<'Local' | 'International'>('Local');
  const [draftStandardDelivery, setDraftStandardDelivery] = useState('');
  const [draftExpressDelivery, setDraftExpressDelivery] = useState('');
  const [draftImage, setDraftImage] = useState('');
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const [draftSplashSale, setDraftSplashSale] = useState(false);
  const [draftDescription, setDraftDescription] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useState<{ current: HTMLInputElement | null }>({ current: null })[0];
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error);
  }, []);

  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState('');
  const [previewBrand, setPreviewBrand] = useState('');
  const [previewCategory, setPreviewCategory] = useState('electronics');
  const [previewPrice, setPreviewPrice] = useState('');
  const [previewCompareAt, setPreviewCompareAt] = useState('');
  const [previewOrigin, setPreviewOrigin] = useState<'Local' | 'International'>('Local');
  const [previewStandardDelivery, setPreviewStandardDelivery] = useState('');
  const [previewExpressDelivery, setPreviewExpressDelivery] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewSplashSale, setPreviewSplashSale] = useState(false);
  const [previewDescription, setPreviewDescription] = useState('');

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
      stock: draftStock ? Number(draftStock) : undefined,
      compareAtPrice: draftCompareAt ? Number(draftCompareAt) : undefined,
      origin: draftOrigin,
      standardDeliveryPrice: draftStandardDelivery ? Number(draftStandardDelivery) : undefined,
      expressDeliveryPrice: draftExpressDelivery ? Number(draftExpressDelivery) : undefined,
      image: draftImage.trim() || undefined,
      images: draftImages.length > 0 ? draftImages : (draftImage.trim() ? [draftImage.trim()] : []),
      isSplashSale: draftSplashSale,
      description: draftDescription.trim() || undefined,
    });
    setDraftName('');
    setDraftBrand('');
    setDraftCategory('electronics');
    setDraftPrice('');
    setDraftStock('');
    setDraftCompareAt('');
    setDraftOrigin('Local');
    setDraftStandardDelivery('');
    setDraftExpressDelivery('');
    setDraftImage('');
    setDraftImages([]);
    setDraftSplashSale(false);
    setDraftDescription('');
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
      // Attempt to download images locally to avoid hotlink blocking
      if ((data as ImportedProduct).images?.length) {
        setDownloadLoading(true);
        setDownloadError(null);
        try {
          const dres = await fetch('/api/download-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: (data as ImportedProduct).images.slice(0, 12) }),
          });
          const ddata = (await dres.json()) as { urls?: string[]; error?: string };
          if (dres.ok && Array.isArray(ddata.urls) && ddata.urls.length > 0) {
            const nextImported: ImportedProduct = {
              ...(data as ImportedProduct),
              images: ddata.urls,
            };
            setImported(nextImported);
            if (!draftImage && ddata.urls[0]) {
              setDraftImage(ddata.urls[0]);
              setDraftImages(ddata.urls);
            }
          }
        } catch {
          // ignore download failures, keep remote images
        } finally {
          setDownloadLoading(false);
        }
      }
      if ((data as ImportedProduct).title && !draftName) {
        setDraftName((data as ImportedProduct).title || '');
      }
      if ((data as ImportedProduct).brand && !draftBrand) {
        setDraftBrand((data as ImportedProduct).brand || '');
      }
      if ((data as ImportedProduct).category && draftCategory === 'electronics') {
        setDraftCategory((data as ImportedProduct).category || 'electronics');
      }
      if (typeof (data as ImportedProduct).price === 'number' && !draftPrice) {
        setDraftPrice(String((data as ImportedProduct).price));
      }
      if (typeof (data as ImportedProduct).compareAtPrice === 'number' && !draftCompareAt) {
        setDraftCompareAt(String((data as ImportedProduct).compareAtPrice));
      }
      if ((data as ImportedProduct).images?.[0] && !draftImage) {
        setDraftImage((data as ImportedProduct).images[0]);
        setDraftImages((data as ImportedProduct).images);
      }
      if ((data as ImportedProduct).description && !draftDescription) {
        setDraftDescription((data as ImportedProduct).description || '');
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
    const nextImported: ImportedProduct = { ...imported, images: next };
    setImported(nextImported);
    if (draftImage === url) {
      setDraftImage(next[0] || '');
    }
    // Also update draftImages if we are in draft mode
    if (draftImages.includes(url)) {
      setDraftImages(next);
    }
  };

  const formatRand = (n: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(n);

  const openPreview = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setPreviewId(id);
    setPreviewName(p.name);
    setPreviewBrand(p.brand);
    setPreviewCategory(p.category);
    setPreviewPrice(String(p.price));
    setPreviewCompareAt(p.compareAtPrice ? String(p.compareAtPrice) : '');
    setPreviewOrigin(p.origin || 'Local');
    setPreviewStandardDelivery(p.standardDeliveryPrice ? String(p.standardDeliveryPrice) : '');
    setPreviewExpressDelivery(p.expressDeliveryPrice ? String(p.expressDeliveryPrice) : '');
    setPreviewImage(p.image || '');
    setPreviewImages(p.images || (p.image ? [p.image] : []));
    setPreviewSplashSale(Boolean(p.isSplashSale));
    setPreviewDescription(p.description || '');
  };

  const savePreview = () => {
    if (!previewId) return;
    const name = previewName.trim();
    updateProduct(previewId, {
      name,
      slug: slugify(name),
      brand: previewBrand.trim(),
      category: previewCategory.trim(),
      price: Number(previewPrice) || 0,
      compareAtPrice: previewCompareAt ? Number(previewCompareAt) : undefined,
      origin: previewOrigin,
      standardDeliveryPrice: previewStandardDelivery ? Number(previewStandardDelivery) : undefined,
      expressDeliveryPrice: previewExpressDelivery ? Number(previewExpressDelivery) : undefined,
      image: previewImage.trim() || undefined,
      images: previewImages,
      isSplashSale: previewSplashSale,
      description: previewDescription.trim() || undefined,
    });
    alert('Saved changes');
  };

  const pushPreview = async () => {
    if (!previewId) return;
    const name = previewName.trim();
    const brand = previewBrand.trim();
    const description = previewDescription.trim();
    const price = Number(previewPrice) || 0;
    const compare = previewCompareAt ? Number(previewCompareAt) : undefined;
    const origin = previewOrigin;
    const standardDeliveryPrice = previewStandardDelivery ? Number(previewStandardDelivery) : undefined;
    const expressDeliveryPrice = previewExpressDelivery ? Number(previewExpressDelivery) : undefined;
    const images =
      (previewImages.length > 0)
        ? previewImages
        : (imported?.images && imported.images.length > 0)
          ? imported.images
          : (previewImage.trim() ? [previewImage.trim()] : []);
    const categorySlug = previewCategory.trim() || 'electronics';
    if (!name || !brand || !description || !price || images.length === 0) {
      alert('Missing required fields (name, brand, description, price, image).');
      return;
    }
    try {
      const res = await fetch('/api/admin/push-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          brand,
          description,
          price,
          compareAtPrice: compare,
          origin,
          standardDeliveryPrice,
          expressDeliveryPrice,
          images,
          categorySlug,
          isSplashSale: previewSplashSale,
          currency: 'ZAR',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || 'Failed to push product');
        return;
      }
      alert('Product pushed live successfully!');
      const slug = data?.product?.slug || slugify(name);
      window.open(`/products/${slug}`, '_blank');
    } catch {
      alert('Failed to push product');
    }
  };

  const onDownloadImages = async () => {
    if (!imported || !Array.isArray(imported.images) || imported.images.length === 0) return;
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      const res = await fetch('/api/download-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: imported.images.slice(0, 12) }),
      });
      const data = (await res.json()) as { urls?: string[]; results?: Array<{ source: string; url?: string; error?: string }>; error?: string };
      if (!res.ok) {
        setDownloadError(data?.error || 'Download failed');
        return;
      }
      const urls = Array.isArray(data.urls) ? data.urls : [];
      if (urls.length === 0) {
        setDownloadError('No images could be downloaded');
        return;
      }
      const nextImported: ImportedProduct = {
        ...imported,
        images: urls,
      };
      setImported(nextImported);
      if (!draftImage && urls[0]) {
        setDraftImage(urls[0]);
      }
      alert(`Downloaded ${urls.length} image(s)`);
    } catch {
      setDownloadError('Download failed');
    } finally {
      setDownloadLoading(false);
    }
  };

  const onGenerateFromImport = () => {
    if (!imported) return;

    const baseName = (imported.title || draftName || 'Imported product').trim();
    const baseBrand = (draftBrand || 'Imported').trim();
    const baseCategory = (draftCategory || 'electronics').trim();
    const basePrice = Number(draftPrice) || imported.price || 0;
    const baseCompareAt = draftCompareAt ? Number(draftCompareAt) : imported.compareAtPrice;
    const baseDescription = (draftDescription || imported.description || '').trim() || undefined;

    addProduct({
      id: crypto.randomUUID(),
      name: baseName,
      slug: slugify(baseName),
      brand: baseBrand,
      category: baseCategory,
      price: basePrice,
      compareAtPrice: baseCompareAt,
      image: imported.images?.[0] || draftImage.trim() || undefined,
      images: imported.images,
      isSplashSale: draftSplashSale,
      description: baseDescription,
    });
    alert('Generated product successfully (using first image).');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Catalog Management</h2>
        <p className="mt-1 text-sm text-gray-500">Add, edit, and delete products.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
        <div className="font-black text-[#1A1D29]">Import from URL</div>
        <div className="mt-2 text-sm text-[#8B95A5]">
          Paste a product link from an ecommerce site and we’ll try to extract title + images.
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <Input
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            className="h-11 rounded-xl flex-1"
            placeholder="https://www.takealot.com/... or https://www.amazon.com/..."
          />
          <Button onClick={onImport} disabled={!importUrl.trim() || importLoading} className="h-11 rounded-xl premium-gradient text-white font-bold">
            {importLoading ? 'Importing…' : 'Import'}
          </Button>
        </div>

        {importError && <div className="mt-3 text-sm font-semibold text-[#FF6B4A]">{importError}</div>}

        {imported && (
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#1A1D29]">Preview</div>
                <div className="mt-1 text-sm text-[#8B95A5]">{imported.title || 'Untitled product'}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1A1D29] border border-gray-200">
                  {imported.images.length} image{imported.images.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
              {imported.images.slice(0, 12).map((img) => (
                <div key={img} className="relative h-24 rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <a href={img} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
                    <img
                      src={img}
                      alt="Imported"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/products/placeholder.svg';
                      }}
                      className="h-full w-full object-cover"
                    />
                  </a>
                  <button
                    aria-label="Delete image"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeImportedImage(img);
                    }}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 flex items-center justify-center hover:bg-white transition"
                  >
                    <Trash2 className="h-4 w-4 text-[#1A1D29]" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Title</div>
                <div className="mt-1 text-sm text-[#1A1D29]">{imported.title || '—'}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Brand</div>
                <div className="mt-1 text-sm text-[#1A1D29]">{imported.brand || '—'}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Category</div>
                <div className="mt-1 text-sm text-[#1A1D29]">{imported.category || '—'}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Price</div>
                <div className="mt-1 text-sm text-[#1A1D29]">
                  {typeof imported.price === 'number' ? imported.price : '—'}
                  {imported.currency ? ` ${imported.currency}` : ''}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Compare At</div>
                <div className="mt-1 text-sm text-[#1A1D29]">
                  {typeof imported.compareAtPrice === 'number' ? imported.compareAtPrice : '—'}
                  {imported.currency ? ` ${imported.currency}` : ''}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Description</div>
                <div className="mt-1 text-sm text-[#1A1D29] whitespace-pre-wrap">{imported.description || '—'}</div>
              </div>
            </div>

            <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1A1D29]">
              <input type="checkbox" checked={generateOnePerImage} onChange={(e) => setGenerateOnePerImage(e.target.checked)} />
              Import all images
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={onDownloadImages} disabled={downloadLoading} variant="outline" className="h-11 rounded-xl">
                {downloadLoading ? 'Downloading…' : 'Download images'}
              </Button>
              <Button onClick={onGenerateFromImport} className="h-11 rounded-xl premium-gradient text-white font-bold">
                Generate product(s)
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => {
                  const name = (imported.title || draftName || 'Imported product').trim();
                  const slug = slugify(name);
                  window.open(`/products/${slug}`, '_blank');
                }}
              >
                Preview product page
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={async () => {
                  const name = (imported.title || draftName || '').trim();
                  const brand = (draftBrand || imported.brand || '').trim();
                  const description = (draftDescription || imported.description || '').trim();
                  const price = Number(draftPrice) || imported.price || 0;
                  const compare = Number(draftCompareAt) || imported.compareAtPrice;
                  const stock = Number(draftStock) || imported.stock || 0;
                  const images = imported.images;
                  const categorySlug = (draftCategory || imported.category || 'electronics').trim();
                  if (!name || !brand || !description || !price || images.length === 0) {
                    alert('Missing required fields (name, brand, description, price, images).');
                    return;
                  }
                  try {
                    const res = await fetch('/api/admin/push-product', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name,
                        brand,
                        description,
                        price,
                        compareAtPrice: compare,
                        stock,
                        images,
                        categorySlug,
                        isSplashSale: draftSplashSale,
                        currency: imported.currency || 'ZAR',
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      alert(data?.error || 'Failed to push product');
                      return;
                    }
                    alert('Product pushed live successfully!');
                    const slug = data?.product?.slug || slugify(name);
                    window.open(`/products/${slug}`, '_blank');
                  } catch {
                    alert('Failed to push product');
                  }
                }}
              >
                Push to live
              </Button>
              <Button variant="outline" className="h-11 rounded-xl" onClick={() => setImported(null)}>
                Clear preview
              </Button>
            </div>
            {downloadError && <div className="mt-3 text-sm font-semibold text-[#FF6B4A]">{downloadError}</div>}
          </div>
        )}

        <div className="mt-4 text-xs text-[#8B95A5]">
          Some websites block automated requests. If import fails, try a different link or manually add images.
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <div className="font-bold text-[#1A1D29]">Add new product</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Name</label>
            <Input value={draftName} onChange={(e) => setDraftName(e.target.value)} className="mt-2 h-11 rounded-xl" placeholder="Product name" />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Brand</label>
            <Input value={draftBrand} onChange={(e) => setDraftBrand(e.target.value)} className="mt-2 h-11 rounded-xl" placeholder="Brand" />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Category</label>
            <select
              value={draftCategory}
              onChange={(e) => setDraftCategory(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
            >
              <option value="electronics">Electronics (Default)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Price</label>
            <Input value={draftPrice} onChange={(e) => setDraftPrice(e.target.value)} className="mt-2 h-11 rounded-xl" inputMode="numeric" placeholder="1299" />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Compare at (optional)</label>
            <Input value={draftCompareAt} onChange={(e) => setDraftCompareAt(e.target.value)} className="mt-2 h-11 rounded-xl" inputMode="numeric" placeholder="1599" />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Stock</label>
            <Input value={draftStock} onChange={(e) => setDraftStock(e.target.value)} className="mt-2 h-11 rounded-xl" inputMode="numeric" placeholder="10" />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Origin</label>
            <select
              value={draftOrigin}
              onChange={(e) => setDraftOrigin(e.target.value as 'Local' | 'International')}
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
            >
              <option value="Local">Local (South Africa)</option>
              <option value="International">International</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Standard Delivery (R)</label>
            <Input
              value={draftStandardDelivery}
              onChange={(e) => setDraftStandardDelivery(e.target.value)}
              className="mt-2 h-11 rounded-xl"
              inputMode="numeric"
              placeholder="e.g. 60 (Empty = Free)"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Express Delivery (R)</label>
            <Input
              value={draftExpressDelivery}
              onChange={(e) => setDraftExpressDelivery(e.target.value)}
              className="mt-2 h-11 rounded-xl"
              inputMode="numeric"
              placeholder="e.g. 99"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Image</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                ref={(el) => { fileInputRef.current = el; }}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadError(null);
                  setUploadingImage(true);
                  try {
                    const fd = new FormData();
                    fd.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: fd });
                    const data = await res.json();
                    if (res.ok && data?.url) {
                      setDraftImage(data.url);
                    } else {
                      setUploadError(data?.error || 'Upload failed');
                    }
                  } catch {
                    setUploadError('Upload failed');
                  } finally {
                    setUploadingImage(false);
                    e.target.value = '';
                  }
                }}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="h-11 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              {uploadingImage && <span className="text-xs text-[#8B95A5]">Uploading…</span>}
              {uploadError && <span className="text-xs font-semibold text-[#FF6B4A]">{uploadError}</span>}
            </div>
            
            {draftImages.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {draftImages.slice(0, 3).map((img, i) => (
                  <div key={i} className="h-24 rounded-xl border border-gray-200 overflow-hidden bg-white">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
                {draftImages.length > 3 && (
                  <div className="h-24 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-bold">
                    +{draftImages.length - 3} more
                  </div>
                )}
              </div>
            ) : draftImage && (
              <div className="mt-3 h-24 w-24 rounded-xl border border-gray-200 overflow-hidden bg-white">
                <img
                  src={draftImage}
                  alt="Preview"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/products/placeholder.svg';
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <Input value={draftImage} onChange={(e) => setDraftImage(e.target.value)} className="mt-3 h-11 rounded-xl" placeholder="/products/..." />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-semibold text-[#1A1D29]">Description (optional)</label>
          <textarea
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            className="mt-2 w-full min-h-28 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
            placeholder="Write your Peboli product description…"
          />
        </div>

        <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1A1D29]">
          <input type="checkbox" checked={draftSplashSale} onChange={(e) => setDraftSplashSale(e.target.checked)} />
          Mark as Splash Sale
        </label>

        <div className="mt-4">
          <Button onClick={onAdd} disabled={!canAdd} className="h-11 rounded-xl premium-gradient text-white font-bold">
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0">
                <img
                  src={p.image || '/products/placeholder.svg'}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/products/placeholder.svg';
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wide">{p.brand}</div>
                    <div className="font-bold text-[#1A1D29]">{p.name}</div>
                    <div className="mt-1 text-sm text-[#1A1D29]">
                      {formatRand(p.price)}
                      {p.compareAtPrice ? (
                        <span className="ml-2 text-[#8B95A5] line-through">{formatRand(p.compareAtPrice)}</span>
                      ) : null}
                      {p.isSplashSale ? (
                        <span className="ml-2 inline-flex items-center rounded-full bg-[#FF6B4A]/10 px-2 py-0.5 text-xs font-semibold text-[#FF6B4A] border border-[#FF6B4A]/20">
                          Splash Sale
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-[#8B95A5]">slug: {p.slug} • category: {p.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-xl" onClick={() => openPreview(p.id)}>
                      Preview & Edit
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl" onClick={() => deleteProduct(p.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-[#8B95A5]">
            No products yet. Add your first product above.
          </div>
        )}
      </div>

      {previewId && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setPreviewId(null)}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                  <img
                    src={previewImage || '/products/placeholder.svg'}
                    alt={previewName || 'Preview'}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/products/placeholder.svg';
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Name</label>
                      <Input value={previewName} onChange={(e) => setPreviewName(e.target.value)} className="mt-2 h-11 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Brand</label>
                      <Input value={previewBrand} onChange={(e) => setPreviewBrand(e.target.value)} className="mt-2 h-11 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Category</label>
                      <Input value={previewCategory} onChange={(e) => setPreviewCategory(e.target.value)} className="mt-2 h-11 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Image URL</label>
                      <Input value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} className="mt-2 h-11 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Price</label>
                      <Input value={previewPrice} onChange={(e) => setPreviewPrice(e.target.value)} className="mt-2 h-11 rounded-xl" inputMode="numeric" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Compare At</label>
                      <Input value={previewCompareAt} onChange={(e) => setPreviewCompareAt(e.target.value)} className="mt-2 h-11 rounded-xl" inputMode="numeric" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Origin</label>
                      <select
                        value={previewOrigin}
                        onChange={(e) => setPreviewOrigin(e.target.value as 'Local' | 'International')}
                        className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                      >
                        <option value="Local">Local</option>
                        <option value="International">International</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Standard Delivery</label>
                      <Input value={previewStandardDelivery} onChange={(e) => setPreviewStandardDelivery(e.target.value)} className="mt-2 h-11 rounded-xl" inputMode="numeric" placeholder="60" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Express Delivery</label>
                      <Input value={previewExpressDelivery} onChange={(e) => setPreviewExpressDelivery(e.target.value)} className="mt-2 h-11 rounded-xl" inputMode="numeric" placeholder="99" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-[#8B95A5]">Description</label>
                      <textarea
                        value={previewDescription}
                        onChange={(e) => setPreviewDescription(e.target.value)}
                        className="mt-2 w-full min-h-28 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1220]/20 focus:border-[#0B1220]"
                      />
                    </div>
                  </div>
                  <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1A1D29]">
                    <input type="checkbox" checked={previewSplashSale} onChange={(e) => setPreviewSplashSale(e.target.checked)} />
                    Mark as Splash Sale
                  </label>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 justify-end">
                <Button variant="outline" className="h-11 rounded-xl" onClick={() => setPreviewId(null)}>
                  Close
                </Button>
                <Button variant="outline" className="h-11 rounded-xl" onClick={savePreview}>
                  Save
                </Button>
                <Button className="h-11 rounded-xl premium-gradient text-white font-bold" onClick={pushPreview}>
                  Push to live
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
