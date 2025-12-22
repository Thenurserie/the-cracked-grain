'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, ChevronRight, ChevronDown, Package, Loader2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';
import { ProductImage } from '@/components/ProductImage';

export interface QuickShopItem {
  name: string;
  category?: string;
  subcategory?: string;
  searchTerm?: string;
}

interface QuickShopBoxProps {
  title: string;
  items: QuickShopItem[];
  browseAllCategory?: string;
  className?: string;
}

export function QuickShopBox({ title, items, browseAllCategory, className = '' }: QuickShopBoxProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const fetchedProducts: Product[] = [];

      // Fetch products for each item
      for (const item of items) {
        try {
          const params = new URLSearchParams();

          if (item.category) {
            params.append('category', item.category);
          }
          if (item.subcategory) {
            params.append('subcategory', item.subcategory);
          }

          // If no category/subcategory, try search term
          if (!item.category && !item.subcategory && item.searchTerm) {
            // For search terms, we'll fetch from the main category and filter
            const response = await fetch(`/api/products?limit=5`);
            if (response.ok) {
              const allProducts: Product[] = await response.json();
              // Simple search filter
              const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(item.searchTerm!.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(item.searchTerm!.toLowerCase()))
              ).slice(0, 1); // Take first match
              fetchedProducts.push(...filtered);
            }
          } else {
            const response = await fetch(`/api/products?${params.toString()}&limit=3`);
            if (response.ok) {
              const categoryProducts: Product[] = await response.json();
              // Take first product from category
              if (categoryProducts.length > 0) {
                fetchedProducts.push(categoryProducts[0]);
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching products for ${item.name}:`, error);
        }
      }

      setProducts(fetchedProducts);
      setLoading(false);
    }

    fetchProducts();
  }, [items]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleProductExpansion = (productId: string) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleAddSelectedToCart = async () => {
    if (selectedProducts.size === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select at least one item to add to cart.',
        variant: 'destructive',
      });
      return;
    }

    setAddingToCart(true);

    let successCount = 0;
    for (const productId of Array.from(selectedProducts)) {
      const success = await addToCart(productId, 1);
      if (success) successCount++;
    }

    if (successCount > 0) {
      toast({
        title: 'Added to cart',
        description: (
          <div className="space-y-3">
            <p className="text-sm">{successCount} item{successCount > 1 ? 's' : ''} added to your cart.</p>
            <Link href="/cart">
              <Button
                size="sm"
                className="bg-amber hover:bg-gold text-white"
              >
                View Cart
              </Button>
            </Link>
          </div>
        ),
      });
      window.dispatchEvent(new Event('cartUpdated'));
      setSelectedProducts(new Set());
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add items to cart.',
        variant: 'destructive',
      });
    }

    setAddingToCart(false);
  };

  const browsAllUrl = browseAllCategory
    ? `/shop?category=${encodeURIComponent(browseAllCategory)}`
    : '/shop';

  if (loading) {
    return (
      <Card className={`bg-[#2a2a2a] border-amber/30 my-6 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-amber flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-amber" />
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className={`bg-[#2a2a2a] border-amber/30 my-6 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-amber flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cream/60 text-sm text-center py-4">
            No products found. Browse our full catalog below.
          </p>
          <Link href={browsAllUrl}>
            <Button
              variant="outline"
              className="w-full border-amber/40 text-amber hover:bg-amber/10 hover:text-amber"
            >
              Browse All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-[#2a2a2a] border-amber/30 my-6 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-amber flex items-center gap-2 text-xl">
          <ShoppingCart className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-cream/60 text-sm mt-2">
          Select items to add to your cart, or expand for details
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {products.map((product) => {
            const isExpanded = expandedProducts.has(product.id);
            const isSelected = selectedProducts.has(product.id);

            return (
              <div
                key={product.id}
                className="border border-amber/20 rounded-lg overflow-hidden transition-all duration-200"
              >
                {/* Product Header */}
                <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#252525] transition-colors">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                    className="border-amber/40 data-[state=checked]:bg-amber data-[state=checked]:border-amber"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="text-cream text-sm font-medium hover:text-amber transition-colors truncate"
                      >
                        {product.name}
                      </Link>
                      <span className="text-amber font-semibold text-sm whitespace-nowrap">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    {!product.in_stock && (
                      <span className="text-red-400 text-xs">Out of Stock</span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProductExpansion(product.id)}
                    className="text-cream/70 hover:text-amber p-1 h-auto"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Expanded Product Details */}
                {isExpanded && (
                  <div className="p-3 border-t border-amber/20 bg-[#0f0f0f]">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-[#2a2a2a] rounded overflow-hidden">
                        <ProductImage
                          imageUrl={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          transforms={{
                            width: 160,
                            height: 160,
                            fit: 'cover',
                            quality: 80
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-cream/80 text-xs mb-2 line-clamp-3">
                          {product.short_description || product.description || 'No description available.'}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link href={`/shop/${product.slug}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber/40 text-amber hover:bg-amber/10 text-xs h-7"
                            >
                              View Details
                            </Button>
                          </Link>
                          {product.in_stock && (
                            <span className="text-green-400 text-xs flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              In Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 space-y-2 border-t border-amber/20">
          <Button
            onClick={handleAddSelectedToCart}
            disabled={selectedProducts.size === 0 || addingToCart}
            className="w-full bg-amber hover:bg-gold text-white"
          >
            {addingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding to Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add Selected to Cart ({selectedProducts.size})
              </>
            )}
          </Button>

          <Link href={browsAllUrl}>
            <Button
              variant="outline"
              className="w-full border-amber/40 text-amber hover:bg-amber/10 hover:text-amber"
            >
              Browse All {browseAllCategory}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
