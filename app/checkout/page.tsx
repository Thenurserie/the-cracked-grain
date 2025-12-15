'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CartItem } from '@/lib/types';
import { getCartItems } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();

    // Validate form
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip'];
    const emptyFields = requiredFields.filter((field) => !formData[field as keyof typeof formData]);

    if (emptyFields.length > 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // For now, just show confirmation and clear cart
    setOrderPlaced(true);
    localStorage.removeItem('session-id');
    window.dispatchEvent(new Event('cartUpdated'));

    toast({
      title: 'Order Placed!',
      description: 'Thank you for your order. You will receive a confirmation email shortly.',
    });

    // Redirect to home after 3 seconds
    setTimeout(() => {
      router.push('/');
    }, 3000);
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

  if (cartItems.length === 0 && !orderPlaced) {
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

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center py-16">
          <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-cream mb-4">Order Confirmed!</h1>
          <p className="text-cream/70 mb-8">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-cream/50">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-cream mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-cream mb-6">Shipping Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-cream">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 bg-background border-amber/20 text-cream"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-cream">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 bg-background border-amber/20 text-cream"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-cream">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 bg-background border-amber/20 text-cream"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-cream">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 bg-background border-amber/20 text-cream"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-cream">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 bg-background border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-cream">
                      State *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 bg-background border-amber/20 text-cream"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zip" className="text-cream">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zip"
                      name="zip"
                      type="text"
                      required
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="mt-1 bg-background border-amber/20 text-cream"
                    />
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
                type="submit"
                size="lg"
                className="w-full bg-amber hover:bg-gold text-white"
              >
                Place Order
              </Button>

              <p className="mt-4 text-xs text-cream/50 text-center">
                Payment integration coming soon with Stripe
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
