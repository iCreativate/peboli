'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Truck, MapPin, Star, Check, ChevronLeft, ChevronRight, Rocket, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Review } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';
import { SplashSaleTimer } from '@/components/deals/SplashSaleTimer';
import { useCartStore } from '@/lib/stores/cart';
import { useWishlistStore } from '@/lib/stores/wishlist';
import { useAuthStore } from '@/lib/stores/auth';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { user } = useAuthStore();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  useEffect(() => {
    if (isChatModalOpen && product?.id) {
      const fetchChat = () => {
        fetch(`/api/chat/product?productId=${product.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.messages) setChatMessages(data.messages);
          })
          .catch(console.error);
      };
      
      fetchChat();
      const interval = setInterval(fetchChat, 5000);
      return () => clearInterval(interval);
    }
  }, [isChatModalOpen, product?.id]);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    if (!user) {
      alert('Please log in to chat');
      return;
    }

    setIsSendingChat(true);
    try {
      const res = await fetch('/api/chat/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userId: user.id,
          message: chatInput
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setChatMessages([...chatMessages, data.chat]);
        setChatInput('');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to send message');
      }
    } catch (e) {
      alert('Error sending message');
    } finally {
      setIsSendingChat(false);
    }
  };

  useEffect(() => {
    if (product?.id) {
      setReviewsLoading(true);
      fetch(`/api/reviews?productId=${product.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.reviews) setReviews(data.reviews);
        })
        .catch(err => console.error(err))
        .finally(() => setReviewsLoading(false));
    }
  }, [product?.id]);

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) return;
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userId: user.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
          userName: user.name || user.email,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setReviews([data.review, ...reviews]);
        setIsReviewModalOpen(false);
        setReviewRating(5);
        setReviewTitle('');
        setReviewComment('');
      } else {
        alert('Failed to submit review');
      }
    } catch (e) {
      alert('Error submitting review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addCart = useCartStore((s) => s.addItem);
  const addWishlist = useWishlistStore((s) => s.addItem);
  const removeWishlist = useWishlistStore((s) => s.removeItem);
  const inWishlist = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const savings = product.compareAtPrice 
    ? product.compareAtPrice - product.price 
    : 0;
  const savingsPercentage = product.compareAtPrice
    ? Math.round((savings / product.compareAtPrice) * 100)
    : 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30">
      <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm mb-8">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <nav className="text-sm text-[#8B95A5] font-medium">
            <Link href="/" className="hover:text-[#0B1220] transition-colors">Home</Link>
            {' / '}
            <Link href={`/categories/${product.category}`} className="hover:text-[#0B1220] transition-colors">
              {product.category}
            </Link>
            {' / '}
            <span className="text-[#1A1D29] font-semibold">{product.name}</span>
          </nav>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 premium-shadow-lg">
              <Image
                src={product.images[selectedImage] || '/products/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
              {product.images.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={() =>
                      setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 flex items-center justify-center premium-shadow hover:bg-white transition"
                  >
                    <ChevronLeft className="h-5 w-5 text-[#1A1D29]" />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 flex items-center justify-center premium-shadow hover:bg-white transition"
                  >
                    <ChevronRight className="h-5 w-5 text-[#1A1D29]" />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 premium-shadow hover:premium-shadow-lg ${
                    selectedImage === index 
                      ? 'border-[#0B1220] ring-2 ring-[#0B1220]/20 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Link
                href={`/brands/${product.brand.toLowerCase()}`}
                className="text-sm text-[#0B1220] hover:underline"
              >
                {product.brand}
              </Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-[#1A1D29] mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-[#1A1D29]">{product.rating}</span>
              <span className="text-[#8B95A5]">({product.reviewCount} reviews)</span>
              <span className="text-[#8B95A5]">•</span>
              <span className="text-[#8B95A5]">{product.soldCount.toLocaleString()} sold</span>
            </div>

            <Separator className="mb-6" />

            {/* Price Section */}
            <div className="bg-gradient-to-br from-[#0B1220]/6 via-[#FF6B4A]/5 to-[#00C48C]/5 rounded-2xl p-4 md:p-8 mb-8 border border-gray-100 premium-shadow">
              <div className="flex items-baseline gap-4 mb-3 flex-wrap">
                <span className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1A1D29] tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg md:text-xl lg:text-2xl text-[#8B95A5] line-through font-semibold">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-[#00C48C] to-[#00A878] text-white font-bold text-sm px-4 py-2 premium-shadow">
                    YOU SAVE {formatPrice(savings)} ({savingsPercentage}%)
                  </Badge>
                </div>
              )}
            </div>

            {/* Splash Sale Timer */}
            {(product.isSplashDeal && product.splashSaleEndsAt) && (
              <div className="mb-6 p-4 bg-[#FF6B4A]/10 rounded-lg border border-[#FF6B4A]/20">
                <SplashSaleTimer endTime={product.splashSaleEndsAt} />
              </div>
            )}

            {/* Delivery Info */}
            <div className="mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-[#0B1220] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1D29]">
                    Delivery by Thursday, Dec 26
                  </p>
                  <p className="text-sm text-[#8B95A5]">
                    or Collect from 12 pickup points
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#0B1220] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1A1D29]">Free delivery over R500</p>
                  <p className="text-sm text-[#8B95A5]">Standard delivery: R50</p>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Quantity & Actions */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1A1D29] mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-[#8B95A5]">
                  {product.stock} in stock
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-[#0B1220] to-[#050A14] hover:from-[#050A14] hover:to-[#050A14] text-white font-bold h-14 rounded-xl premium-shadow-lg hover:scale-105 transition-all duration-200"
                  size="lg"
                  onClick={() =>
                    addCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      qty: quantity,
                      vendor: product.vendor.name,
                      image: product.images[0],
                    })
                  }
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-14 rounded-xl border ${inWishlist ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-[#0B1220] hover:bg-[#0B1220]/5'} transition-all duration-200`}
                  aria-pressed={inWishlist}
                  onClick={() => {
                    if (inWishlist) {
                      removeWishlist(product.id);
                    } else {
                      addWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        vendor: product.vendor.name,
                        image: product.images[0],
                        categoryHref: `/categories/${product.category}`,
                      });
                    }
                  }}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'text-pink-600' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-xl border-gray-200 hover:border-[#0B1220] hover:bg-[#0B1220]/5 transition-all duration-200"
                  onClick={async () => {
                    const url = typeof window !== 'undefined' && window.location ? window.location.href : '';
                    const title = product.name;
                    const text = product.description;
                    try {
                      const nav = typeof window !== 'undefined' ? window.navigator : undefined;
                      if (nav && isNavigatorShare(nav)) {
                        await nav.share({ title, text, url });
                      } else {
                        const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
                        await copyText(url || `${origin}/products/${product.slug}`);
                      }
                    } catch {}
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Community Chat Teaser */}
            <div className="border border-gray-100 rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 premium-shadow mt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MessageCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1A1D29]">Join the Community</h3>
                  <p className="text-sm text-[#8B95A5]">Connect with other buyers after purchase</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm border border-white/50">
                <p className="text-sm text-[#1A1D29] italic">"Has anyone tried this with..."</p>
                <div className="mt-2 text-xs text-[#8B95A5] flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  12 people discussing this product
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-200"
                onClick={() => setIsChatModalOpen(true)}
              >
                Join Chat (Ask questions before you buy!)
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="border border-gray-100 rounded-2xl p-6 bg-white premium-shadow mt-6">
              <h3 className="font-bold text-lg text-[#1A1D29] mb-4">Delivery Options</h3>
              
              {product.origin === 'International' ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-bold text-blue-900">International Shipping</div>
                      <div className="text-sm text-blue-700 mt-1">
                        This item ships from overseas. Delivery times may vary.
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                    onClick={() => {
                        // In a real app, this would open a chat with the vendor
                        alert("Contact vendor feature coming soon!");
                    }}
                  >
                    Contact Vendor about Delivery
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-[#1A1D29]" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#1A1D29]">Standard Delivery</div>
                        <div className="text-xs text-[#8B95A5]">3-5 business days</div>
                      </div>
                    </div>
                    <div className="font-bold text-[#1A1D29]">
                      {product.standardDeliveryPrice ? formatPrice(product.standardDeliveryPrice) : 'Free'}
                    </div>
                  </div>

                  {product.stock > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#0B1220] flex items-center justify-center">
                          <Rocket className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#1A1D29]">Express Delivery</div>
                          <div className="text-xs text-[#8B95A5]">1-2 business days</div>
                        </div>
                      </div>
                      <div className="font-bold text-[#1A1D29]">
                        {product.expressDeliveryPrice ? formatPrice(product.expressDeliveryPrice) : 'R 99'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Vendor Info */}
            <div className="border border-gray-100 rounded-2xl p-6 bg-white premium-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-lg text-[#1A1D29] mb-2">{product.vendor.name}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-[#1A1D29]">{product.vendor.rating}</span>
                    </div>
                    <span className="text-sm text-[#8B95A5] font-medium">
                      {product.vendor.positiveRating}% positive
                    </span>
                  </div>
                </div>
                {product.vendor.verificationTier === 'premium' && (
                  <Badge className="bg-gradient-to-r from-[#0B1220] to-[#050A14] text-white font-bold px-4 py-2 premium-shadow">
                    ★ Premium Seller
                  </Badge>
                )}
              </div>
              <Separator className="my-4" />
              <Button 
                onClick={() => setIsChatModalOpen(true)}
                className="w-full bg-white border border-gray-200 text-[#1A1D29] hover:bg-gray-50 flex items-center justify-center gap-2 h-12 rounded-xl font-bold"
              >
                <MessageCircle className="h-5 w-5" />
                Join Community Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="mt-16">
          <h2 className="text-3xl font-black text-[#1A1D29] mb-8 tracking-tight">Product Details</h2>
          <div className="space-y-6">
            <div className="border border-gray-100 rounded-2xl p-8 bg-white premium-shadow">
              <h3 className="font-bold text-xl text-[#1A1D29] mb-4">Description</h3>
              <p className="text-[#8B95A5] leading-relaxed text-base">{product.description}</p>
            </div>

            {product.specifications && (
              <div className="border border-gray-100 rounded-2xl p-8 bg-white premium-shadow">
                <h3 className="font-bold text-xl text-[#1A1D29] mb-6">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                      <span className="text-[#8B95A5] font-medium">{key}</span>
                      <span className="font-bold text-[#1A1D29]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-gray-100 rounded-2xl p-8 bg-gradient-to-br from-[#00C48C]/5 to-[#0B1220]/6 premium-shadow">
              <h3 className="font-bold text-xl text-[#1A1D29] mb-6">Shipping & Returns</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00C48C] flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[#1A1D29] font-medium">Free delivery on orders over R500</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00C48C] flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[#1A1D29] font-medium">30-day return policy</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00C48C] flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[#1A1D29] font-medium">Buyer protection guarantee</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-100 rounded-2xl p-8 bg-white premium-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-[#1A1D29]">Reviews</h3>
                <Button onClick={() => setIsReviewModalOpen(true)} className="bg-[#0B1220] text-white rounded-xl">
                  Write a Review
                </Button>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-[#1A1D29]">{Number(product.rating).toFixed(1)}</span>
                    </div>
                    <div className="text-sm text-[#8B95A5]">
                      Based on {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1A1D29]">{review.userName}</span>
                            {review.isVerifiedPurchase && (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Verified Purchase</Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        {review.title && <h4 className="font-semibold text-[#1A1D29] mb-1">{review.title}</h4>}
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="font-bold text-[#1A1D29] mb-2">No reviews yet</h4>
                  <p className="text-[#8B95A5] mb-6">Be the first to review this product</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1A1D29]">Write a Review</h2>
            <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-8 w-8 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input 
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-[#0B1220] focus:ring-1 focus:ring-[#0B1220]"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you like or dislike?"
              />
            </div>
            
            <Button 
              onClick={handleSubmitReview} 
              disabled={isSubmittingReview || !reviewComment.trim()}
              className="w-full bg-[#0B1220] text-white"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)}>
        <div className="flex flex-col h-[600px]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#1A1D29]">Community Chat</h2>
            <button onClick={() => setIsChatModalOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.userId === user?.id ? 'flex-row-reverse' : ''}`}>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                     {msg.user?.image ? (
                       <img src={msg.user.image} alt={msg.user.name} className="h-full w-full object-cover" />
                     ) : (
                       <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs font-bold">
                         {msg.user?.name?.[0] || '?'}
                       </div>
                     )}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.userId === user?.id 
                      ? 'bg-[#0B1220] text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                  }`}>
                    <div className="text-xs opacity-70 mb-1">{msg.user?.name || 'Anonymous'}</div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <Input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendChat}
                disabled={isSendingChat || !chatInput.trim()}
                className="bg-[#0B1220] text-white"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
