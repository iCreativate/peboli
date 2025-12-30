// Core Types for Peboli Platform

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  savings?: number;
  savingsPercentage?: number;
  images: string[];
  category: string;
  subcategory?: string;
  condition: 'new' | 'like-new' | 'refurbished';
  stock: number;
  origin?: string;
  standardDeliveryPrice?: number;
  expressDeliveryPrice?: number;
  sku: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  vendorId: string;
  vendor: Vendor;
  specifications?: Record<string, string>;
  deliveryTime?: string;
  isFlashSale?: boolean; // Deprecated: Use isSplashDeal
  flashSaleEndsAt?: Date; // Deprecated: Use splashSaleEndsAt
  isSplashDeal?: boolean;
  splashSaleEndsAt?: Date;
  bulkDiscounts?: BulkDiscount[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  vendorResponse?: {
    comment: string;
    createdAt: Date;
  };
}

export interface BulkDiscount {
  minQuantity: number;
  price: number;
  savings: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rating: number;
  reviewCount: number;
  positiveRating: number;
  verificationTier: 'basic' | 'premium' | 'elite';
  isVerified: boolean;
  joinedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  savings: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryAddress: Address;
  deliveryMethod: string;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
  vendorId: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  vendorResponse?: {
    comment: string;
    createdAt: Date;
  };
}

export interface FlashSale {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  products: Product[];
  estimatedGMV: number;
  status: 'upcoming' | 'active' | 'ended';
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'vendor' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export interface FilterOptions {
  priceRange?: [number, number];
  brands?: string[];
  deliveryTime?: string[];
  ratings?: number;
  condition?: string[];
  sortBy?: 'recommended' | 'price-low' | 'price-high' | 'newest' | 'bestselling' | 'top-rated';
}

