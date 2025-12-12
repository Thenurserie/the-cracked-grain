'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CartItem } from '@/lib/types';
import { getCartItems } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    saveInfo: false,
    orderNotes: '',
  });

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    const items = await getCartItems();
    setCartItems(items);
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shippingCost =
    shippingMethod === 'standard'
      ? subtotal >= 75
        ? 0
        : 7.99
      : shippingMethod === 'expedited'
      ? 14.99
      : 29.99;

  const tax = subtotal * 0.095;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-cream mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-cream">1. Shipping Information</h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-gold hover:text-amber text-sm">
                    Edit
                  </button>
                )}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cream mb-2">Email *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cream mb-2">First Name *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cream mb-2">Last Name *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cream mb-2">Address *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cream mb-2">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cream mb-2">City *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cream mb-2">State *</label>
                      <select className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold">
                        <option value="">Select state</option>
                        <option value="AR">Arkansas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cream mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cream mb-2">Phone *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <label className="text-sm text-cream/80">Save this information for next time</label>
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full bg-amber hover:bg-gold text-white py-6">
                    Continue to Shipping Method
                  </Button>
                </div>
              )}
            </div>

            {step >= 2 && (
              <div className="bg-card border border-amber/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-cream">2. Shipping Method</h2>
                  {step > 2 && (
                    <button onClick={() => setStep(2)} className="text-gold hover:text-amber text-sm">
                      Edit
                    </button>
                  )}
                </div>

                {step === 2 && (
                  <div className="space-y-3">
                    <label className="block">
                      <div className="flex items-center justify-between p-4 border-2 border-amber/30 rounded cursor-pointer hover:border-gold">
                        <div className="flex items-center">
                          <input type="radio" name="shipping" value="standard" checked className="mr-3" />
                          <div>
                            <p className="text-cream font-medium">Standard Shipping</p>
                            <p className="text-sm text-cream/70">5-7 business days</p>
                          </div>
                        </div>
                        <span className="text-gold font-semibold">
                          {subtotal >= 75 ? 'FREE' : '$7.99'}
                        </span>
                      </div>
                    </label>

                    <label className="block">
                      <div className="flex items-center justify-between p-4 border-2 border-amber/30 rounded cursor-pointer hover:border-gold">
                        <div className="flex items-center">
                          <input type="radio" name="shipping" value="expedited" className="mr-3" />
                          <div>
                            <p className="text-cream font-medium">Expedited Shipping</p>
                            <p className="text-sm text-cream/70">2-3 business days</p>
                          </div>
                        </div>
                        <span className="text-gold font-semibold">$14.99</span>
                      </div>
                    </label>

                    <label className="block">
                      <div className="flex items-center justify-between p-4 border-2 border-amber/30 rounded cursor-pointer hover:border-gold">
                        <div className="flex items-center">
                          <input type="radio" name="shipping" value="overnight" className="mr-3" />
                          <div>
                            <p className="text-cream font-medium">Overnight Shipping</p>
                            <p className="text-sm text-cream/70">1 business day</p>
                          </div>
                        </div>
                        <span className="text-gold font-semibold">$29.99</span>
                      </div>
                    </label>

                    <Button onClick={() => setStep(3)} className="w-full bg-amber hover:bg-gold text-white py-6 mt-6">
                      Continue to Payment
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step >= 3 && (
              <div className="bg-card border border-amber/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-cream mb-6">3. Payment</h2>

                <div className="bg-[#2a2a2a] border border-amber/30 rounded-lg p-8 text-center mb-6">
                  <Lock className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-cream mb-2">Secure Checkout with Square</h3>
                  <p className="text-cream/70 mb-6">Your payment information is encrypted and secure.</p>

                  <div className="flex justify-center gap-3 mb-6">
                    <CreditCard className="h-8 w-12 text-cream/40" />
                    <CreditCard className="h-8 w-12 text-cream/40" />
                    <CreditCard className="h-8 w-12 text-cream/40" />
                    <CreditCard className="h-8 w-12 text-cream/40" />
                  </div>

                  <Button className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white py-6">
                    Pay with Square
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold resize-none"
                    placeholder="Special instructions or gift message..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-amber/20 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-cream mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-[#2a2a2a] rounded">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-cream font-medium truncate">{product.name}</p>
                        <p className="text-sm text-cream/70">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-amber/20 pt-4 space-y-2">
                <div className="flex justify-between text-cream/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cream/80">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-cream/80">
                  <span>Tax (9.5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-cream pt-2 border-t border-amber/20">
                  <span>Total</span>
                  <span className="text-gold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
