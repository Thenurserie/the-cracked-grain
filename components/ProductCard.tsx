'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductImage } from '@/components/ProductImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  function handleContinueShopping() {
    const returnUrl = sessionStorage.getItem('shopReturnUrl') || '/shop';
    // Don't restore scroll here - let ShopContent handle it after products load
    router.push(returnUrl, { scroll: false });
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
              <Link href="/cart">
                <Button
                  size="sm"
                  className="bg-amber hover:bg-gold text-white"
                >
                  View Cart
                </Button>
              </Link>
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
    <div className="group bg-card border border-amber/20 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 hover:shadow-lg hover:shadow-amber/10">
      <Link href={`/shop/${product.slug}`} onClick={handleProductClick} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#2a2a2a]">
          <ProductImage
            imageUrl={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            transforms={{
              width: 400,
              height: 400,
              fit: 'cover',
              quality: 80
            }}
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
      </Link>

      <div className="p-4 space-y-2">
        <Link href={`/shop/${product.slug}`} onClick={handleProductClick} className="block">
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
        </Link>

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
  );
}
