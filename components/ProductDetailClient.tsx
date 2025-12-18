'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [shopReturnUrl, setShopReturnUrl] = useState('/shop');

  useEffect(() => {
    // Get the saved shop return URL
    if (typeof window !== 'undefined') {
      const savedUrl = sessionStorage.getItem('shopReturnUrl');
      if (savedUrl) {
        setShopReturnUrl(savedUrl);
      }
    }
  }, []);

  function handleContinueShopping() {
    // Don't restore scroll here - let ShopContent handle it after products load
    router.push(shopReturnUrl, { scroll: false });
  }

  async function handleAddToCart() {
    setAddingToCart(true);
    const success = await addToCart(product.id, quantity);

    if (success) {
      toast({
        title: 'Added to cart',
        description: (
          <div className="space-y-3">
            <p className="text-sm">{quantity} x {product.name} added to your cart.</p>
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
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }

    setAddingToCart(false);
  }

  return (
    <div className="border-t border-amber/20 pt-6 space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-cream font-medium">Quantity:</label>
        <div className="flex items-center border border-amber/20 rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-cream hover:bg-amber/10"
          >
            -
          </button>
          <span className="px-6 py-2 text-cream border-x border-amber/20">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 text-cream hover:bg-amber/10"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          size="lg"
          className="flex-1 bg-amber hover:bg-gold text-white"
          onClick={handleAddToCart}
          disabled={!product.in_stock || addingToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {addingToCart ? 'Adding...' : product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>

      {product.in_stock && (
        <p className="text-sm text-green-500">
          ✓ In stock ({product.stock_quantity} available)
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4 border-t border-amber/20">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-amber/30 text-cream hover:bg-amber/10"
          onClick={handleContinueShopping}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Continue Shopping
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-amber/30 text-cream hover:bg-amber/10"
          onClick={() => router.push('/cart')}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          View Cart
        </Button>
      </div>
    </div>
  );
}
