'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDirectusAssetUrl } from '@/lib/directus';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  // Save current shop state before navigating
  useEffect(() => {
    // Save current URL and scroll position for "Continue Shopping"
    if (typeof window !== 'undefined' && window.location.pathname === '/shop') {
      sessionStorage.setItem('shopReturnUrl', window.location.href);
      sessionStorage.setItem('shopScrollPosition', window.scrollY.toString());
    }
  }, []);

  function handleContinueShopping() {
    const returnUrl = sessionStorage.getItem('shopReturnUrl') || '/shop';
    const scrollPosition = parseInt(sessionStorage.getItem('shopScrollPosition') || '0');

    router.push(returnUrl);

    // Restore scroll position after navigation
    setTimeout(() => {
      window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    }, 100);
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    setAdding(true);

    const success = await addToCart(product.id, 1);

    if (success) {
      toast({
        title: 'Added to cart',
        description: (
          <div className="space-y-3">
            <p className="text-sm">{product.name} added to your cart.</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleContinueShopping}
                className="border-amber/30 text-cream hover:bg-amber/10"
              >
                Continue Shopping
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/cart')}
                className="bg-amber hover:bg-gold text-white"
              >
                View Cart
              </Button>
            </div>
          </div>
        ),
      });
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        variant: 'destructive',
      });
    }

    setAdding(false);
  }

  function handleProductClick() {
    // Save shop state before navigating to product detail
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shopReturnUrl', window.location.href);
      sessionStorage.setItem('shopScrollPosition', window.scrollY.toString());
    }
  }

  return (
    <Link href={`/shop/${product.slug}`} onClick={handleProductClick}>
      <div className="group bg-card border border-amber/20 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 hover:shadow-lg hover:shadow-amber/10">
        <div className="relative aspect-square overflow-hidden bg-[#2a2a2a]">
          <Image
            src={getDirectusAssetUrl(product.image_url)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-cream font-semibold">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            {product.featured && (
              <div className="bg-amber px-2 py-1 rounded text-xs font-bold text-white shadow-lg">
                Featured
              </div>
            )}
            {product.in_stock && product.stock_quantity > 10 && (
              <div className="bg-green-600 px-2 py-1 rounded text-xs font-bold text-white shadow-lg">
                In Stock
              </div>
            )}
            {product.in_stock && product.stock_quantity > 0 && product.stock_quantity <= 10 && (
              <div className="bg-yellow-600 px-2 py-1 rounded text-xs font-bold text-white shadow-lg">
                Low Stock
              </div>
            )}
            {!product.in_stock && (
              <div className="bg-red-600 px-2 py-1 rounded text-xs font-bold text-white shadow-lg">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-cream group-hover:text-gold transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-cream/70 line-clamp-2">
            {product.short_description}
          </p>

          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-gold text-gold'
                    : 'text-cream/30'
                }`}
              />
            ))}
            <span className="text-xs text-cream/60 ml-1">
              ({product.review_count})
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-gold">
              ${product.price.toFixed(2)}
            </span>
            <Button
              size="sm"
              className="bg-amber hover:bg-gold text-white"
              onClick={handleAddToCart}
              disabled={!product.in_stock || adding}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
