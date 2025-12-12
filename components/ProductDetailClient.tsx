'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  async function handleAddToCart() {
    setAddingToCart(true);
    const success = await addToCart(product.id, quantity);

    if (success) {
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name} added to your cart.`,
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
    </div>
  );
}
