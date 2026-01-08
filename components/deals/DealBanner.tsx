'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Deal } from '@/types/deal';

type DealBannerProps = {
  deal: Deal;
};

export function DealBanner({ deal }: DealBannerProps) {
  const imageUrl = deal.bannerUrl || deal.imageUrl;
  const linkUrl = deal.linkUrl || (deal.product ? `/products/${deal.product.slug}` : '/deals');

  if (!imageUrl) return null;

  return (
    <Link href={linkUrl} className="block w-full">
      <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden group">
        <Image
          src={imageUrl}
          alt={deal.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {deal.description && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{deal.title}</h3>
              <p className="text-white/90 text-sm md:text-base">{deal.description}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

