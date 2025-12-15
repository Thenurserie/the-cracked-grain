'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Available categories (hardcoded for now)
// Note: slugs must match exact category values in database
const CATEGORIES = [
  { id: '1', name: 'Grains & Extracts', slug: 'Grains' },
  { id: '2', name: 'Hops', slug: 'Hops' },
  { id: '3', name: 'Yeast & Bacteria', slug: 'Yeast' },
  { id: '4', name: 'Equipment', slug: 'Equipment' },
  { id: '5', name: 'Chemicals & Additives', slug: 'Chemicals' },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [loading, setLoading] = useState(true);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [displayCount, setDisplayCount] = useState(50);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [priceRanges, inStockOnly, displayCount, allProducts]);

  async function loadProducts() {
    setLoading(true);
    setDisplayCount(50); // Reset display count when loading new products

    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('sortBy', sortBy);
      params.append('limit', '1000'); // Load all products

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...allProducts];

    // Apply client-side filters
    if (priceRanges.length > 0 || inStockOnly) {
      filtered = filtered.filter((product: Product) => {
        // Stock filter
        if (inStockOnly && !product.in_stock) {
          return false;
        }

        // Price range filter
        if (priceRanges.length > 0) {
          const matchesPriceRange = priceRanges.some(range => {
            switch (range) {
              case 'under-10':
                return product.price < 10;
              case '10-25':
                return product.price >= 10 && product.price <= 25;
              case '25-50':
                return product.price > 25 && product.price <= 50;
              case 'over-50':
                return product.price > 50;
              default:
                return true;
            }
          });
          if (!matchesPriceRange) {
            return false;
          }
        }

        return true;
      });
    }

    // Apply display limit
    setProducts(filtered.slice(0, displayCount));
  }

  function togglePriceRange(range: string) {
    setPriceRanges(prev =>
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  }

  function clearFilters() {
    setPriceRanges([]);
    setInStockOnly(false);
  }

  function loadMore() {
    setDisplayCount(prev => prev + 50);
  }

  const filteredTotal = (() => {
    let filtered = [...allProducts];
    if (priceRanges.length > 0 || inStockOnly) {
      filtered = filtered.filter((product: Product) => {
        if (inStockOnly && !product.in_stock) return false;
        if (priceRanges.length > 0) {
          const matchesPriceRange = priceRanges.some(range => {
            switch (range) {
              case 'under-10': return product.price < 10;
              case '10-25': return product.price >= 10 && product.price <= 25;
              case '25-50': return product.price > 25 && product.price <= 50;
              case 'over-50': return product.price > 50;
              default: return true;
            }
          });
          if (!matchesPriceRange) return false;
        }
        return true;
      });
    }
    return filtered.length;
  })();

  const hasMore = products.length < filteredTotal;

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-cream mb-4">Shop Homebrew Supplies</h1>
          <p className="text-xl text-cream/90">
            Browse our complete selection of premium brewing ingredients and equipment
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">

      {/* Featured Banner */}
      <div className="mb-8 relative h-[200px] rounded-xl overflow-hidden border-2 border-amber/30">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1615332579937-4e3a2f6b4b6b?w=1200&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber/90 via-amber/70 to-transparent" />
        <div className="relative z-10 h-full flex items-center px-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Fresh Ingredients Weekly
            </h2>
            <p className="text-white/95 text-lg mb-4">
              Get the finest malts, hops, and yeast for your next brew. Quality guaranteed.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 space-y-6">
          <div className="bg-card border border-amber/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-cream mb-4">Categories</h3>
            <div className="space-y-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  selectedCategory === 'all'
                    ? 'bg-amber hover:bg-gold text-white'
                    : 'text-cream hover:text-gold hover:bg-amber/10'
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                All Products
              </Button>
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    selectedCategory === category.slug
                      ? 'bg-amber hover:bg-gold text-white'
                      : 'text-cream hover:text-gold hover:bg-amber/10'
                  }`}
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-amber/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cream">Price Range</h3>
              {(priceRanges.length > 0 || inStockOnly) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-amber hover:text-gold"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2 text-sm text-cream/80">
              <label className="flex items-center cursor-pointer hover:text-cream">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  checked={priceRanges.includes('under-10')}
                  onChange={() => togglePriceRange('under-10')}
                />
                <span>Under $10</span>
              </label>
              <label className="flex items-center cursor-pointer hover:text-cream">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  checked={priceRanges.includes('10-25')}
                  onChange={() => togglePriceRange('10-25')}
                />
                <span>$10 - $25</span>
              </label>
              <label className="flex items-center cursor-pointer hover:text-cream">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  checked={priceRanges.includes('25-50')}
                  onChange={() => togglePriceRange('25-50')}
                />
                <span>$25 - $50</span>
              </label>
              <label className="flex items-center cursor-pointer hover:text-cream">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  checked={priceRanges.includes('over-50')}
                  onChange={() => togglePriceRange('over-50')}
                />
                <span>$50+</span>
              </label>
            </div>
          </div>

          <div className="bg-card border border-amber/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-cream mb-4">Availability</h3>
            <div className="space-y-2 text-sm text-cream/80">
              <label className="flex items-center cursor-pointer hover:text-cream">
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-cream/70">
              {loading ? 'Loading...' : `Showing ${products.length} of ${filteredTotal} products`}
            </p>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] bg-card border-amber/20 text-cream">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card border-amber/20">
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-card border border-amber/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cream/70 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 text-center">
                  <Button
                    size="lg"
                    onClick={loadMore}
                    className="bg-amber hover:bg-gold text-white px-12"
                  >
                    Load More Products
                  </Button>
                  <p className="text-sm text-cream/60 mt-3">
                    Showing {products.length} of {filteredTotal} products
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
