'use client';

import { useEffect, useMemo, useState } from 'react';
import { Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/types';
interface CategoryPageContentProps {
  category: Category;
}

export function CategoryPageContent({ category }: CategoryPageContentProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'newest' | 'bestselling' | 'top-rated'>('recommended');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(category.slug)}&limit=48`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          setProducts([]);
          setError('Failed to load products');
        } else {
          setProducts(data as Product[]);
        }
      } catch {
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category.slug]);

  const categoryProducts = useMemo(() => {
    let result = products.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = [...result].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      default:
        break;
    }
    return result;
  }, [products, priceRange, selectedBrands, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[#1A1D29] mb-2">{category.name}</h1>
        <p className="text-[#8B95A5]">
          {categoryProducts.length} products found
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white border rounded-lg p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-[#1A1D29] flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#1A1D29] mb-4">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={50000}
                step={100}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-semibold text-[#1A1D29] mb-4">Brands</h3>
              <div className="space-y-2">
                {['Samsung', 'Apple', 'Sony', 'LG'].map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-[#1A1D29]">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPriceRange([0, 50000]);
                setSelectedBrands([]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort & View Options */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-[#8B95A5]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'recommended' | 'price-low' | 'price-high' | 'newest' | 'bestselling' | 'top-rated'
                  )
                }
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1220]"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="bestselling">Best Selling</option>
                <option value="top-rated">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedBrands.map((brand) => (
                <Badge key={brand} variant="secondary" className="gap-2">
                  {brand}
                  <button
                    onClick={() => setSelectedBrands(selectedBrands.filter((b) => b !== brand))}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                <Badge variant="secondary" className="gap-2">
                  R{priceRange[0]} - R{priceRange[1]}
                  <button
                    onClick={() => setPriceRange([0, 50000])}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {loading && <div className="text-sm text-[#8B95A5]">Loading products…</div>}
          {error && <div className="text-sm font-semibold text-[#FF6B4A]">{error}</div>}
          {categoryProducts.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-[#8B95A5] mb-4">No products found</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 50000]);
                  setSelectedBrands([]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
