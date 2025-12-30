'use client';

import { useMemo, useState, type ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Save, Upload, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdminStore } from '@/lib/stores/admin';

export default function AdminHomepageSettingsPage() {
  const hero = useAdminStore((s) => s.hero);
  const setHero = useAdminStore((s) => s.setHero);
  const [isUploading, setIsUploading] = useState(false);
  const [addUrl, setAddUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<string[]>([]);
  const [ctaOptions, setCtaOptions] = useState<Array<{ label: string; href: string }>>([]);
  const titleValid = Boolean(hero.title && hero.title.trim());
  const subtitleValid = Boolean(hero.subtitle && hero.subtitle.trim());

  useEffect(() => {
    const staticPages: Array<{ label: string; href: string }> = [
      { label: 'Home', href: '/' },
      { label: 'Deals', href: '/deals' },
      { label: 'New Arrivals', href: '/new' },
      { label: 'Brands', href: '/brands' },
      { label: 'Cart', href: '/cart' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Login', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'Help Centre', href: '/help' },
      { label: 'Clearance', href: '/clearance' },
      { label: 'Liquor', href: '/liquor' },
      { label: 'Summer', href: '/summer' },
      { label: 'Sell', href: '/sell' },
      { label: 'More', href: '/more' },
    ];
    setCtaOptions(staticPages);
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const cats = data
            .map((c: { name?: string; slug?: string }) => {
              const name = typeof c.name === 'string' ? c.name : '';
              const slug = typeof c.slug === 'string' ? c.slug : '';
              if (!name || !slug) return null;
              return { label: `Category: ${name}`, href: `/categories/${slug}` };
            })
            .filter(Boolean) as Array<{ label: string; href: string }>;
          setCtaOptions((opts) => [...opts, ...cats]);
        }
      } catch {
        // ignore fetch errors; keep static options
      }
    })();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        if (data?.url) uploaded.push(data.url);
      }
      const next = Array.isArray(hero.imageUrls) ? [...hero.imageUrls] : [];
      setHero({ imageUrls: [...next, ...uploaded] });
    } catch (err) {
      console.error(err);
      alert('Failed to upload image(s)');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-bold text-[#8B95A5]">Homepage</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Hero settings</h2>
        <p className="mt-2 text-sm text-[#8B95A5]">Update hero title, subtitle, and image. Saved locally for now.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-black text-[#1A1D29]">Hero content</div>
            <div className="mt-1 text-sm text-[#8B95A5]">Controls the top hero section.</div>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
            <ImageIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Title</label>
            <Input
              value={hero.title}
              onChange={(e) => setHero({ title: e.target.value })}
              className={`mt-2 h-11 rounded-xl ${titleValid ? '' : 'border-[#FF6B4A]'}`}
              placeholder="Enter a hero title"
            />
            {!titleValid && <div className="mt-1 text-xs font-semibold text-[#FF6B4A]">Title is required</div>}
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">Subtitle</label>
            <Input
              value={hero.subtitle}
              onChange={(e) => setHero({ subtitle: e.target.value })}
              className={`mt-2 h-11 rounded-xl ${subtitleValid ? '' : 'border-[#FF6B4A]'}`}
              placeholder="Enter a hero subtitle"
            />
            {!subtitleValid && <div className="mt-1 text-xs font-semibold text-[#FF6B4A]">Subtitle is required</div>}
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">CTA label</label>
            <Input value={hero.ctaLabel || ''} onChange={(e) => setHero({ ctaLabel: e.target.value })} className="mt-2 h-11 rounded-xl" placeholder="Shop Now" />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#1A1D29]">CTA link</label>
            <select
              value={hero.ctaHref || ''}
              onChange={(e) => setHero({ ctaHref: e.target.value })}
              className="mt-2 h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none"
            >
              <option value="">Select destination…</option>
              {ctaOptions.map((o) => (
                <option key={o.href} value={o.href}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-[#1A1D29]">Hero images</label>
            <div className="mt-2 flex gap-3">
              <Input value={addUrl} onChange={(e) => setAddUrl(e.target.value)} className="h-11 rounded-xl flex-1" placeholder="https://..." />
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  accept="image/*"
                  multiple
                  disabled={isUploading || !titleValid || !subtitleValid}
                />
                <button className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-[#1A1D29] hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploading ? 'Uploading...' : 'Upload image(s)'}
                </button>
              </div>
              <button
                className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#1A1D29] hover:bg-gray-50"
                onClick={() => {
                  const u = addUrl.trim();
                  if (!u || !titleValid || !subtitleValid) return;
                  const next = Array.isArray(hero.imageUrls) ? [...hero.imageUrls] : [];
                  setHero({ imageUrls: [...next, u] });
                  setAddUrl('');
                }}
                disabled={!titleValid || !subtitleValid}
              >
                Add URL
              </button>
            </div>
            <div className="mt-2 text-xs text-[#8B95A5]">Add multiple images via upload or by URL.</div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {(hero.imageUrls || []).map((img) => (
                <div key={img} className="relative h-24 rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <a href={img} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
                    <img
                      src={img}
                      alt="Hero"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/products/placeholder.svg';
                      }}
                      className="h-full w-full object-cover"
                    />
                  </a>
                  <button
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 flex items-center justify-center hover:bg-white transition"
                    onClick={(e) => {
                      e.preventDefault();
                      const next = (hero.imageUrls || []).filter((u) => u !== img);
                      setHero({ imageUrls: next });
                    }}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex items-center justify-center rounded-xl premium-gradient px-5 py-2.5 text-sm font-semibold text-white">
            <Save className="h-4 w-4 mr-2" />
            View homepage
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1D29] hover:bg-gray-50"
            onClick={async () => {
              if (isGenerating) return;
              if (!titleValid || !subtitleValid) {
                alert('Enter both title and subtitle before generating images.');
                return;
              }
              setIsGenerating(true);
              try {
                const res = await fetch('/api/generate-hero', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: hero.title,
                    subtitle: hero.subtitle,
                    count: 4,
                  }),
                });
                const data = await res.json();
                const urls: string[] = Array.isArray(data?.urls) ? data.urls : [];
                if (urls.length > 0) {
                  setGenerated(urls);
                  const next = Array.isArray(hero.imageUrls) ? [...hero.imageUrls] : [];
                  setHero({ imageUrls: [...urls, ...next] });
                } else {
                  alert('No images generated');
                }
              } catch {
                alert('Failed to generate images');
              } finally {
                setIsGenerating(false);
              }
            }}
            disabled={!titleValid || !subtitleValid}
          >
            {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            {isGenerating ? 'Generating…' : 'Generate hero images'}
          </button>
        </div>
        {generated.length > 0 && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
            <div className="font-black text-[#1A1D29]">Generated header images</div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {generated.map((img, idx) => (
                <div key={img} className="relative h-24 rounded-xl border border-gray-200 bg-white overflow-hidden group">
                  <a href={img} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
                    <img
                      src={img}
                      alt="Generated"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/products/placeholder.svg';
                      }}
                      className="h-full w-full object-cover"
                    />
                  </a>
                  <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      className="px-2 py-1 rounded-md bg-white/95 border border-gray-200 text-xs font-semibold text-[#1A1D29] hover:bg-white"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await fetch('/api/generate-hero', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: hero.title, subtitle: hero.subtitle, count: 1 }),
                          });
                          const data = await res.json();
                          const url: string | undefined = Array.isArray(data?.urls) ? data.urls[0] : undefined;
                          if (url) {
                            const nextGen = [...generated];
                            nextGen[idx] = url;
                            setGenerated(nextGen);
                            const all = Array.isArray(hero.imageUrls) ? [...hero.imageUrls] : [];
                            const indexInAll = all.indexOf(img);
                            if (indexInAll >= 0) {
                              all[indexInAll] = url;
                              setHero({ imageUrls: all });
                            }
                          }
                        } catch {}
                      }}
                    >
                      Replace
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        className="px-2 py-1 rounded-md bg-white/95 border border-gray-200 text-xs font-semibold text-[#1A1D29] hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          if (idx <= 0) return;
                          const nextGen = [...generated];
                          const [move] = nextGen.splice(idx, 1);
                          nextGen.splice(idx - 1, 0, move);
                          setGenerated(nextGen);
                          const all = Array.isArray(hero.imageUrls) ? [...hero.imageUrls] : [];
                          const iAll = all.indexOf(img);
                          if (iAll > 0) {
                            const [mv] = all.splice(iAll, 1);
                            all.splice(iAll - 1, 0, mv);
                            setHero({ imageUrls: all });
                          }
                        }}
                      >
                        ↑
                      </button>
                      <button
                        className="px-2 py-1 rounded-md bg-white/95 border border-gray-200 text-xs font-semibold text-[#1A1D29] hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          if (idx >= generated.length - 1) return;
                          const nextGen = [...generated];
                          const [move] = nextGen.splice(idx, 1);
                          nextGen.splice(idx + 1, 0, move);
                          setGenerated(nextGen);
                          const all = Array.isArray(hero.imageUrls) ? [...hero.imageUrls] : [];
                          const iAll = all.indexOf(img);
                          if (iAll >= 0 && iAll < all.length - 1) {
                            const [mv] = all.splice(iAll, 1);
                            all.splice(iAll + 1, 0, mv);
                            setHero({ imageUrls: all });
                          }
                        }}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
