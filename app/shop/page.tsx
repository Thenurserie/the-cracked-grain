'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Available categories (hardcoded for now)
const CATEGORIES = [
  { id: '1', name: 'Grains & Extracts', slug: 'grains-extracts' },
  { id: '2', name: 'Hops', slug: 'hops' },
  { id: '3', name: 'Yeast & Bacteria', slug: 'yeast-bacteria' },
  { id: '4', name: 'Equipment', slug: 'equipment' },
  { id: '5', name: 'Chemicals & Additives', slug: 'chemicals-additives' },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy]);

  async function loadProducts() {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('sortBy', sortBy);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cream mb-4">Shop Homebrew Supplies</h1>
        <p className="text-cream/70">
          Browse our complete selection of premium brewing ingredients and equipment
        </p>
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
            <h3 className="text-lg font-semibold text-cream mb-4">Price Range</h3>
            <div className="space-y-2 text-sm text-cream/80">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>Under $10</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>$10 - $25</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>$25 - $50</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>$50+</label>
              </div>
            </div>
          </div>

          <div className="bg-card border border-amber/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-cream mb-4">Availability</h3>
            <div className="space-y-2 text-sm text-cream/80">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>In Stock</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label>Featured</label>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-cream/70">
              {loading ? 'Loading...' : `${products.length} products found`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
