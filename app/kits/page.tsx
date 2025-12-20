'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

const KIT_SUBCATEGORIES = [
  { name: 'All Kits', value: 'all', description: 'Browse all available kits' },
  { name: 'Beer Kits', value: 'Beer Kits', description: 'Complete ingredient kits for beer' },
  { name: 'Equipment Kits', value: 'Equipment Kits', description: 'Everything you need to start brewing' },
  { name: 'Other Kits', value: 'Other Kits', description: 'Wine, mead, and specialty kits' },
];

export default function KitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  useEffect(() => {
    loadKits();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedSubcategory]);

  async function loadKits() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('category', 'Kits');
      params.append('sort', 'name');

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to load kits:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterProducts() {
    if (selectedSubcategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.subcategory === selectedSubcategory
      );
      setFilteredProducts(filtered);
    }
  }

  const groupedProducts = KIT_SUBCATEGORIES.filter(sub => sub.value !== 'all').reduce((acc, sub) => {
    acc[sub.value] = products.filter(p => p.subcategory === sub.value);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber/10 to-background border-b border-amber/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              Brewing Kits
            </h1>
            <p className="text-lg md:text-xl text-cream/80 mb-2">
              Everything you need to get started
            </p>
            <p className="text-base text-cream/60">
              Perfect for beginners or experienced brewers looking for convenience
            </p>
          </div>
        </div>
      </div>

      {/* Beginner Banner */}
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-r from-amber/20 to-gold/20 border-gold">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center md:text-left">
                <Sparkles className="h-6 w-6 text-gold flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gold mb-1">
                    New to brewing? Kits include everything you need to make your first batch!
                  </p>
                  <p className="text-xs text-cream/70">
                    Get started with equipment kits or try a beer kit with pre-measured ingredients
                  </p>
                </div>
              </div>
              <Link href="/brewing?tab=guides">
                <Button className="bg-amber hover:bg-gold text-white whitespace-nowrap">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Beginner Guides
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {KIT_SUBCATEGORIES.map((subcategory) => (
              <Button
                key={subcategory.value}
                onClick={() => setSelectedSubcategory(subcategory.value)}
                variant={selectedSubcategory === subcategory.value ? 'default' : 'outline'}
                className={
                  selectedSubcategory === subcategory.value
                    ? 'bg-amber hover:bg-gold'
                    : 'border-amber/30 text-cream hover:bg-amber/10'
                }
              >
                {subcategory.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto mb-4" />
                <p className="text-cream/70">Loading kits...</p>
              </div>
            </div>
          ) : selectedSubcategory === 'all' ? (
            // Show all kits grouped by subcategory
            <div className="space-y-12">
              {KIT_SUBCATEGORIES.filter(sub => sub.value !== 'all').map((subcategory) => {
                const categoryProducts = groupedProducts[subcategory.value] || [];
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={subcategory.value}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-cream flex items-center gap-2">
                          <Package className="h-6 w-6 text-gold" />
                          {subcategory.name}
                        </h2>
                        <p className="text-sm text-cream/60 mt-1">{subcategory.description}</p>
                      </div>
                      <Badge className="bg-amber/20 text-gold border-amber/40">
                        {categoryProducts.length} {categoryProducts.length === 1 ? 'kit' : 'kits'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {products.length === 0 && (
                <Card className="bg-card border-amber/20">
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-cream/40 mx-auto mb-4" />
                    <p className="text-cream/70 mb-4">No kits available at this time</p>
                    <Link href="/shop">
                      <Button variant="outline" className="border-amber/30 text-cream hover:bg-amber/10">
                        Browse All Products
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            // Show filtered kits
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-cream flex items-center gap-2">
                  <Package className="h-6 w-6 text-gold" />
                  {KIT_SUBCATEGORIES.find(s => s.value === selectedSubcategory)?.name}
                </h2>
                <Badge className="bg-amber/20 text-gold border-amber/40">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'kit' : 'kits'}
                </Badge>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-amber/20">
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-cream/40 mx-auto mb-4" />
                    <p className="text-cream/70 mb-4">No kits found in this category</p>
                    <Button
                      onClick={() => setSelectedSubcategory('all')}
                      variant="outline"
                      className="border-amber/30 text-cream hover:bg-amber/10"
                    >
                      View All Kits
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
