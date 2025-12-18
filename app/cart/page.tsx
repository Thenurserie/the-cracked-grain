'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/types';
import { getCartItems, updateCartItemQuantity, removeFromCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';
import { getDirectusAssetUrl } from '@/lib/directus';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    setLoading(true);
    const items = await getCartItems();
    setCartItems(items || []);
    setLoading(false);
  }

  async function handleUpdateQuantity(itemId: string, newQuantity: number) {
    const success = await updateCartItemQuantity(itemId, newQuantity);

    if (success) {
      await loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update quantity. Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function handleRemoveItem(itemId: string) {
    const success = await removeFromCart(itemId);

    if (success) {
      await loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to remove item. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 8.99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-card rounded w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-card rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center py-16">
          <ShoppingBag className="h-24 w-24 text-cream/30 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-cream mb-4">Your cart is empty</h1>
          <p className="text-cream/70 mb-8">
            Add some homebrew supplies to get started!
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-amber hover:bg-gold text-white">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-cream mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item.id}
                className="bg-card border border-amber/20 rounded-lg p-6 flex flex-col sm:flex-row gap-6"
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#2a2a2a]"
                >
                  <Image
                    src={getDirectusAssetUrl(product.image_url, {
                      width: 128,
                      height: 128,
                      fit: 'cover',
                      quality: 80
                    })}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </Link>

                <div className="flex-1 space-y-3">
                  <div>
                    <Link
                      href={`/shop/${product.slug}`}
                      className="text-lg font-semibold text-cream hover:text-gold transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-cream/70 line-clamp-2">
                      {product.short_description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-amber/20 rounded">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-cream hover:bg-amber/10"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-1 text-cream border-x border-amber/20">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-cream hover:bg-amber/10"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-cream/60 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="text-xl font-bold text-gold">
                      ${(product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Mobile Action Buttons */}
          <div className="lg:hidden flex flex-col gap-3 pt-4">
            <Link href="/checkout">
              <Button
                size="lg"
                className="w-full bg-amber hover:bg-gold text-white"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-amber/30 text-cream hover:bg-amber/10"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-amber/20 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-cream mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-cream/80">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cream/80">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal < 50 && subtotal > 0 && (
                <p className="text-xs text-amber">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="border-t border-amber/20 pt-3 flex justify-between text-xl font-bold text-cream">
                <span>Total</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button
                size="lg"
                className="w-full bg-amber hover:bg-gold text-white mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-amber/30 text-cream hover:bg-amber/10"
              >
                Continue Shopping
              </Button>
            </Link>

            <div className="mt-6 pt-6 border-t border-amber/20 space-y-3 text-sm text-cream/70">
              <div className="flex items-center">
                <span className="text-gold mr-2">✓</span>
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center">
                <span className="text-gold mr-2">✓</span>
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center">
                <span className="text-gold mr-2">✓</span>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
