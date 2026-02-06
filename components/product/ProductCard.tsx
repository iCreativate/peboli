'use client';

import Link from 'next/link';
import { ShoppingCart, Timer, Heart, Share2, Star } from 'lucide-react';
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
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 h-full flex flex-col"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-white p-4">
          <img
            src={product.images[0] || '/products/placeholder.svg'}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/products/placeholder.svg';
            }}
          />
          
          {/* Savings Badge */}
          {savingsPercentage > 0 && (
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
              <Badge className="bg-red-500 text-white font-bold text-[10px] px-2 py-1 shadow-sm border-0">
                -{savingsPercentage}%
              </Badge>
            </div>
          )}

          {/* Splash Sale Badge */}
          {(product.isFlashSale || product.isSplashDeal) && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-[#FF6B4A] text-white font-bold text-[10px] px-2 py-1 shadow-sm border-0 flex items-center gap-1">
                <Timer className="h-3 w-3" />
                Splash Sale
              </Badge>
            </div>
          )}

          {/* Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 bg-gradient-to-t from-white/90 via-white/50 to-transparent pt-8">
            <Button
              className="flex-1 bg-[#0B1220] hover:bg-[#1A1D29] text-white font-medium text-sm rounded-lg h-10 shadow-lg transition-transform hover:scale-105"
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
              <ShoppingCart className="h-3.5 w-3.5 mr-2" />
              Add
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={`h-10 w-10 rounded-lg shadow-lg ${inWishlist ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
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
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col gap-2">
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#8B95A5] uppercase tracking-wider">{product.brand}</p>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-[#1A1D29]">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-[#1A1D29] text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-auto pt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#1A1D29]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#8B95A5] line-through decoration-gray-400">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
