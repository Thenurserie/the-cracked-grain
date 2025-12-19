'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

// Available categories (hardcoded for now)
// Note: All products currently have category='Homebrew' in database
// TODO: Implement proper categorization in database
const CATEGORIES = [
  { id: '1', name: 'Grains & Extracts', slug: 'Homebrew' },
  { id: '2', name: 'Hops', slug: 'Homebrew' },
  { id: '3', name: 'Yeast & Bacteria', slug: 'Homebrew' },
  { id: '4', name: 'Equipment', slug: 'Homebrew' },
  { id: '5', name: 'Chemicals & Additives', slug: 'Homebrew' },
  { id: '6', name: 'Wine Supplies', slug: 'Homebrew' },
];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');
  const pageParam = searchParams.get('page');

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [loading, setLoading] = useState(true);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Sync currentPage with URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    } else {
      params.delete('page');
    }

    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    router.replace(newUrl, { scroll: false });
  }, [currentPage, router]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    applyFiltersAndPagination();
  }, [priceRanges, inStockOnly, currentPage, itemsPerPage, allProducts, searchQuery]);

  // Reset to page 1 when filters or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, priceRanges, inStockOnly, itemsPerPage, searchQuery]);

  // Restore scroll position after products load (for "Continue Shopping" navigation)
  useEffect(() => {
    if (!loading && products.length > 0) {
      const savedScrollPosition = sessionStorage.getItem('shopScrollPosition');
      if (savedScrollPosition) {
        const scrollPos = parseInt(savedScrollPosition);
        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
        });
        // Clear the saved position so it doesn't restore on next visit
        sessionStorage.removeItem('shopScrollPosition');
      }
    }
  }, [loading, products]);

  async function loadProducts() {
    setLoading(true);

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

  function applyFiltersAndPagination() {
    let filtered = [...allProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

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

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setProducts(filtered.slice(startIndex, endIndex));
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

  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

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
    return filtered;
  };

  const filteredTotal = getFilteredProducts().length;
  const totalPages = Math.ceil(filteredTotal / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredTotal);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const PaginationControls = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-amber/30 text-cream hover:bg-amber/10 disabled:opacity-50"
        >
          Previous
        </Button>

        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => goToPage(page)}
              className={
                currentPage === page
                  ? 'bg-amber hover:bg-gold text-white'
                  : 'border-amber/30 text-cream hover:bg-amber/10'
              }
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="text-cream/50 px-2">
              {page}
            </span>
          )
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-amber/30 text-cream hover:bg-amber/10 disabled:opacity-50"
        >
          Next
        </Button>
      </div>

      <p className="text-sm text-cream/60">
        Page {currentPage} of {totalPages} ({filteredTotal} total products)
      </p>
    </div>
  );

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden mb-8">
        <Image
          src="https://admin.thecrackedgrain.com/assets/84fcb51f-f054-4e87-80ea-f846e3812ce9?width=1920&quality=80&format=webp"
          alt="Homebrew supplies and ingredients"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-cream mb-4">Shop Homebrew Supplies</h1>
          <p className="text-xl text-cream/90">
            Browse our complete selection of premium brewing ingredients and equipment
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">

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
                  aria-label="Clear all filters"
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
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cream/50" />
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-card border border-amber/20 rounded-lg text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cream/50 hover:text-cream"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Product Count and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <p className="text-sm md:text-base text-cream/70">
                {loading ? 'Loading...' : `Showing ${startItem}-${endItem} of ${filteredTotal} products`}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden md:flex items-center gap-2">
                <label className="text-sm text-cream/70 whitespace-nowrap">Per page:</label>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
                  <SelectTrigger className="w-[80px] bg-card border-amber/20 text-cream">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-amber/20">
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] bg-card border-amber/20 text-cream">
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
          </div>

          {/* Pagination - Top */}
          {!loading && products.length > 0 && totalPages > 1 && (
            <div className="mb-6">
              <PaginationControls />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-card border border-amber/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Image
                src="https://admin.thecrackedgrain.com/assets/5a80e87b-402a-4d9b-b8f2-c1622865aa46"
                alt="No products"
                width={96}
                height={96}
                className="w-24 h-24 mx-auto mb-4 opacity-30"
              />
              <p className="text-cream/70 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination - Bottom (centered) */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <PaginationControls />
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
