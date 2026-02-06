'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Camera, Mic, Square, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';

type Recognition = {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: unknown) => void;
  onend: () => void;
};

type RecognitionCtor = new () => Recognition;

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      return;
    }
    fetch(`/api/search/smart?q=${encodeURIComponent(q)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        const nextQ = data?.normalizedQuery || q;
        router.push(`/search?q=${encodeURIComponent(nextQ)}&smart=1`);
      })
      .catch(() => {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      });
  };

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const onImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/search/image', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        const nextQ = data?.query || 'image';
        router.push(`/search?q=${encodeURIComponent(nextQ)}&via=image`);
      } else {
        router.push(`/search?q=${encodeURIComponent('image')}&via=image`);
      }
    } catch {
      router.push(`/search?q=${encodeURIComponent('image')}&via=image`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const _win = window as unknown as {
      SpeechRecognition?: RecognitionCtor;
      webkitSpeechRecognition?: RecognitionCtor;
    };
    const Ctor = _win.SpeechRecognition || _win.webkitSpeechRecognition;
    if (Ctor) {
      const rec = new Ctor();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (event: unknown) => {
        const e = event as { results?: Array<Array<{ transcript?: string }>> };
        const text = e.results?.[0]?.[0]?.transcript || '';
        if (text && isMountedRef.current) {
          setQuery(text);
        }
      };
      rec.onend = () => {
        if (isMountedRef.current) {
          setListening(false);
        }
      };
      recognitionRef.current = rec;
    }
    return () => {
      isMountedRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    if (listening) return;

    try {
      recognitionRef.current.start();
      if (isMountedRef.current) {
        setListening(true);
      }
    } catch (e: any) {
      // Ignore if already started, otherwise log
      if (e?.name !== 'InvalidStateError' && !e?.message?.includes('already started')) {
        console.error('Speech recognition error:', e);
      } else {
        // If it was already started, ensure state reflects that
        if (isMountedRef.current) {
          setListening(true);
        }
      }
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    if (isMountedRef.current) {
      setListening(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Top Navigation */}
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="text-3xl font-black tracking-tighter">
                <span className="text-[#0B1220]">PEBOLI</span>
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={onSubmit} className="relative group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B95A5] transition-colors group-focus-within:text-[#0B1220]" />
              <Input
                type="search"
                placeholder="Search products, brands, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-28 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0B1220] focus:outline-none transition-all duration-200 text-base"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onImageSelected} />
                <Button type="button" variant="ghost" className="h-9 w-9 rounded-lg" onClick={openImagePicker} aria-label="Image search">
                  <Camera className="h-5 w-5 text-[#1A1D29]" />
                </Button>
                {!listening ? (
                  <Button type="button" variant="ghost" className="h-9 w-9 rounded-lg" onClick={startListening} aria-label="Voice search">
                    <Mic className="h-5 w-5 text-[#1A1D29]" />
                  </Button>
                ) : (
                  <Button type="button" variant="ghost" className="h-9 w-9 rounded-lg" onClick={stopListening} aria-label="Stop voice">
                    <Square className="h-5 w-5 text-red-600" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl hover:bg-gray-100 transition-all duration-200"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-[#FF6B4A] text-xs font-bold text-white flex items-center justify-center">
                {Math.min(cartCount, 9)}
              </span>
            </Link>
            <Link
              href="/account"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl hover:bg-gray-100 transition-all duration-200"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="flex h-14 items-center gap-8 border-t border-gray-100">
          <Link 
            href="/deals" 
            className="text-sm font-semibold text-[#1A1D29] hover:text-[#0B1220] transition-all duration-200 relative group"
          >
            Deals
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B1220] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/sell" 
            className="text-sm font-semibold text-[#1A1D29] hover:text-[#0B1220] transition-all duration-200 relative group"
          >
            Sell
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B1220] group-hover:w-full transition-all duration-300"></span>
          </Link>
          {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Baby', 'Books', 'Outlet'].map((cat) => (
            <Link
              key={cat}
              href={`/categories/${cat.toLowerCase()}`}
              className="text-sm font-semibold text-[#1A1D29] hover:text-[#0B1220] transition-all duration-200 relative group"
            >
              {cat}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B1220] group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
