'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/types';
import { getCartItems } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    setLoading(true);
    const items = await getCartItems();
    setCartItems(items || []);
    setLoading(false);
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 8.99;
  const total = subtotal + shipping;

  async function handleCheckout() {
    setCheckoutLoading(true);

    try {
      // Prepare items for Square checkout
      const items = cartItems.map((item) => ({
        name: item.product?.name || 'Unknown Product',
        price: item.product?.price || 0,
        quantity: item.quantity,
      }));

      // Call Square checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Square checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Error',
        description: error.message || 'Failed to initiate checkout. Please try again.',
        variant: 'destructive',
      });
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-card rounded w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-card rounded" />
            <div className="h-96 bg-card rounded" />
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
            Add some items to your cart before checking out.
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-amber hover:bg-gold text-white">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-cream mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Review */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-amber/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-cream mb-6">Order Review</h2>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-amber/10 last:border-0 last:pb-0"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-[#2a2a2a]">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-cream">{product.name}</h3>
                      <p className="text-sm text-cream/70 line-clamp-2">
                        {product.short_description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-cream/60">Qty: {item.quantity}</span>
                        <span className="font-bold text-gold">
                          ${(product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-amber/20 space-y-3 text-sm text-cream/70">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cream">Secure Square Payment</p>
                  <p className="text-xs">Your payment information is processed securely by Square</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cream">Shipping Address</p>
                  <p className="text-xs">You'll provide your shipping address on the next page</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cream">Order Confirmation</p>
                  <p className="text-xs">You'll receive a confirmation email after checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-amber/20 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-cream mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-[#2a2a2a]">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cream truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-cream/70">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-gold">
                          ${(product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 mb-6 pt-6 border-t border-amber/20">
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

              <Button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                size="lg"
                className="w-full bg-amber hover:bg-gold text-white disabled:opacity-50"
              >
                {checkoutLoading ? 'Redirecting to Square...' : 'Proceed to Payment'}
              </Button>

              <p className="mt-4 text-xs text-cream/50 text-center">
                Secure payment powered by Square
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
