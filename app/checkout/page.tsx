'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/types';
import { getCartItems, clearCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Square: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [card, setCard] = useState<any>(null);
  const [squareLoaded, setSquareLoaded] = useState(false);

  // Shipping info state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
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

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  // Initialize Square Web Payments SDK
  useEffect(() => {
    if (!squareLoaded || !window.Square) {
      console.log('Square SDK not loaded yet');
      return;
    }

    // Wait for DOM to be ready
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) {
      console.error('Card container not found in DOM');
      setError('Payment form container not found. Please refresh.');
      return;
    }

    async function initializeSquare() {
      const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
      const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

      console.log('Initializing Square with:', { appId, locationId });

      if (!appId || !locationId) {
        console.error('Missing Square credentials');
        setError('Payment configuration error. Please contact support.');
        return;
      }

      try {
        const payments = window.Square.payments(appId, locationId);
        console.log('Square payments object created');

        const cardOptions = {
          style: {
            '.input-container': {
              borderColor: '#52525b',
              borderRadius: '8px',
            },
            '.input-container.is-focus': {
              borderColor: '#d97706',
            },
            input: {
              backgroundColor: '#3f3f46',
              color: '#ffffff',
              fontFamily: 'inherit',
            },
            'input::placeholder': {
              color: '#9ca3af',
            },
          },
        };

        const card = await payments.card(cardOptions);
        console.log('Card object created');

        await card.attach('#card-container');
        console.log('Card attached successfully');

        setCard(card);
        setError(''); // Clear any previous error

      } catch (e: any) {
        console.error('Square initialization error:', e);
        console.error('Error details:', JSON.stringify(e, null, 2));
        setError(`Payment form error: ${e.message || 'Unknown error'}. Please refresh or try a different browser.`);
      }
    }

    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(initializeSquare, 100);
    return () => clearTimeout(timer);

  }, [squareLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!card) {
      setError('Payment form not loaded. Please refresh.');
      return;
    }

    // Validate shipping info
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email ||
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zip) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Tokenize the card
      const result = await card.tokenize();

      if (result.status === 'OK') {
        // Prepare items for payment
        const items = cartItems.map((item) => ({
          name: item.product?.name || 'Unknown Product',
          price: item.product?.price || 0,
          quantity: item.quantity,
        }));

        // Send payment to our API
        const response = await fetch('/api/checkout/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            items,
            shippingInfo,
            amount: Math.round(cartTotal * 100) // cents
          })
        });

        const data = await response.json();

        if (data.success) {
          await clearCart();
          router.push(`/checkout/success?orderId=${data.orderId}`);
        } else {
          setError(data.error || 'Payment failed. Please try again.');
        }
      } else {
        setError(result.errors?.[0]?.message || 'Card validation failed.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
    <>
      <Script
        src="https://web.squarecdn.com/v1/square.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Square SDK script loaded');
          setSquareLoaded(true);
        }}
        onError={(e) => {
          console.error('Square SDK failed to load:', e);
          setError('Payment system unavailable. Please try again later.');
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-cream mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-card border border-amber/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-amber mb-4">Shipping Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cream/80 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-amber/20 rounded-lg px-4 py-2 text-cream"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/80 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-amber/20 rounded-lg px-4 py-2 text-cream"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm text-cream/80 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-amber/20 rounded-lg px-4 py-2 text-cream"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/80 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-amber/20 rounded-lg px-4 py-2 text-cream"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-cream/80 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-amber/20 rounded-lg px-4 py-2 text-cream"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm text-cream/80 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-amber/20 rounded-lg px-4 py-2 text-cream"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/80 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-amber/20 rounded-lg px-4 py-2 text-cream"
                      maxLength={2}
                      placeholder="AR"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/80 mb-1">ZIP *</label>
                    <input
                      type="text"
                      name="zip"
                      value={shippingInfo.zip}
                      onChange={handleInputChange}
                      className="w-full bg-background border border-amber/20 rounded-lg px-4 py-2 text-cream"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card border border-amber/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-amber mb-4">Payment</h2>

                <div id="card-container" className="min-h-[100px] bg-background rounded-lg p-4">
                  {!squareLoaded && (
                    <div className="flex items-center justify-center h-full py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber"></div>
                      <span className="ml-3 text-cream/60">Loading payment form...</span>
                    </div>
                  )}
                </div>

                {error && !card && (
                  <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm mb-2">{error}</p>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="text-amber hover:text-gold text-sm underline"
                    >
                      Click here to refresh and try again
                    </button>
                  </div>
                )}

                {card && (
                  <p className="text-cream/50 text-xs mt-2">
                    🔒 Payments securely processed by Square
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-card border border-amber/20 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-amber mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    return (
                      <div key={item.id} className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {product.image_url && (
                            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-[#2a2a2a]">
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-cream text-sm font-medium truncate">{product.name}</p>
                            <p className="text-cream/60 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-cream font-semibold">${(product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-amber/20 pt-4 space-y-2">
                  <div className="flex justify-between text-cream/80">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-cream/80 text-sm">
                    <span>Shipping</span>
                    <span>Calculated after checkout</span>
                  </div>
                  <div className="flex justify-between text-cream text-lg font-bold pt-2 border-t border-amber/20">
                    <span>Total</span>
                    <span className="text-gold">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !card}
                  className="w-full bg-amber hover:bg-gold disabled:bg-amber/50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium mt-6 transition-colors"
                >
                  {isLoading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                </button>

                <p className="text-cream/50 text-xs text-center mt-4">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
