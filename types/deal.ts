export type DealType = 'SPLASH_SALE' | 'DAILY_DEAL' | 'PRODUCT_CAMPAIGN' | 'ADVERT';
export type DealStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAST' | 'CANCELLED';

export interface Deal {
  id: string;
  type: DealType;
  title: string;
  description?: string;
  status: DealStatus;
  discountPercentage?: number;
  discountAmount?: number;
  itemsCount?: number;
  productId?: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
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
}

