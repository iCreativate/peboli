'use client';

import Link from 'next/link';
import { ShoppingCart, Timer, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';
const isNavigatorShare = (n: Navigator): n is Navigator & { share: (data: { title?: string; text?: string; url?: string }) => Promise<void> } => {
  return typeof (n as unknown as { share?: unknown }).share !== 'undefined';
};
const copyText = async (text: string) => {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  } catch {}
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addCart = useCartStore((s) => s.addItem);
  const addWishlist = useWishlistStore((s) => s.addItem);
  const removeWishlist = useWishlistStore((s) => s.removeItem);
  const inWishlist = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const savingsPercentage = product.savingsPercentage || 
    (product.compareAtPrice 
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0);

  const formatPrice = (price: number) => {
    const rounded = Math.round(price);
    const grouped = new Intl.NumberFormat('en-US', {
      useGrouping: true,
      maximumFractionDigits: 0,
    }).format(rounded);
    return `R ${grouped}`;
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden premium-shadow hover:premium-shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={product.images[0] || '/products/placeholder.svg'}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.currentTarget.src = '/products/placeholder.svg';
            }}
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Savings Badge */}
          {savingsPercentage > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-3 right-3 z-10"
            >
              <Badge className="bg-gradient-to-r from-[#00C48C] to-[#00A878] text-white font-bold text-xs px-3 py-1.5 premium-shadow">
                -{savingsPercentage}%
              </Badge>
            </motion.div>
          )}

          {/* Splash Sale Badge */}
          {(product.isFlashSale || product.isSplashDeal) && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-3 left-3 z-10"
            >
              <Badge className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white font-bold text-xs px-3 py-1.5 flex items-center gap-1.5 premium-shadow">
                <Timer className="h-3.5 w-3.5" />
                Splash Sale
              </Badge>
            </motion.div>
          )}

          {/* Quick Add Button - Shows on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/98 backdrop-blur-md transform translate-y-full group-hover:translate-y-0 transition-all duration-300 border-t border-gray-100">
            <div className="flex items-center gap-2">
            <Button
              className="flex-1 bg-gradient-to-r from-[#0B1220] to-[#050A14] hover:from-[#050A14] hover:to-[#050A14] text-white font-semibold rounded-xl h-11 premium-shadow hover:scale-105 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  qty: 1,
                  vendor: product.vendor?.name,
                  image: product.images[0],
                });
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-11 w-11 rounded-xl border ${inWishlist ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-[#0B1220] hover:bg-[#0B1220]/5'} transition-all duration-200`}
              aria-pressed={inWishlist}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (inWishlist) {
                  removeWishlist(product.id);
                } else {
                  addWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    vendor: product.vendor?.name,
                    image: product.images[0],
                    categoryHref: `/categories/${product.category}`,
                  });
                }
              }}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'text-pink-600' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-xl border-gray-200 hover:border-[#0B1220] hover:bg-[#0B1220]/5 transition-all duration-200"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = typeof window !== 'undefined' ? `${window.location.origin}/products/${product.slug}` : '';
                const title = product.name;
                const text = product.description;
                try {
                  const nav = typeof window !== 'undefined' ? window.navigator : undefined;
                  if (nav && isNavigatorShare(nav)) {
                    await nav.share({ title, text, url });
                  } else {
                    await copyText(url);
                  }
                } catch {}
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <p className="text-xs font-medium text-[#8B95A5] uppercase tracking-wide">{product.brand}</p>
          <h3 className="font-bold text-[#1A1D29] text-base line-clamp-2 group-hover:text-gradient transition-all duration-200 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}>
                  ★
                </span>
              ))}
            </div>
            <span className="font-semibold text-[#1A1D29]">{product.rating}</span>
            <span className="text-[#8B95A5]">({product.reviewCount})</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1 mt-auto">
            <span className="text-2xl font-black text-[#1A1D29] tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-sm text-[#8B95A5] line-through font-medium">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="text-xs font-bold text-[#00C48C] bg-[#00C48C]/10 px-2 py-0.5 rounded-md">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Stock Indicator */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <div className="h-2 w-2 rounded-full bg-[#FF6B4A] animate-pulse"></div>
              <p className="text-xs font-semibold text-[#FF6B4A]">
                Only {product.stock} left!
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
