import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

export default function OrderConfirmationPage() {
  const orderNumber = 'TCG-' + Math.random().toString(36).substring(7).toUpperCase();
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-cream/70 text-lg">
            We're excited to help you brew better beer
          </p>
        </div>

        <div className="bg-card border border-amber/20 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-amber/20">
            <Package className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-cream mb-2">Order #{orderNumber}</h2>
              <p className="text-cream/70">
                A confirmation email has been sent to your email address with your order details.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Truck className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-cream mb-1">Estimated Delivery</h3>
                <p className="text-cream/80">{estimatedDelivery}</p>
                <p className="text-sm text-cream/60 mt-1">
                  You'll receive a tracking number once your order ships
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-cream mb-1">Order Updates</h3>
                <p className="text-cream/80">
                  We'll send you email updates about your order status
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-amber/20 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-cream mb-4">Shipping Address</h3>
          <div className="text-cream/80">
            <p>John Doe</p>
            <p>123 Main Street</p>
            <p>Bryant, AR 72022</p>
            <p className="mt-2">Phone: (501) 555-0123</p>
          </div>
        </div>

        <div className="bg-amber/10 border border-amber/30 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-cream mb-2">What's Next?</h3>
          <ul className="space-y-2 text-cream/80 text-sm">
            <li className="flex items-start">
              <span className="text-gold mr-2">1.</span>
              <span>We'll process your order within 1-2 business days</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-2">2.</span>
              <span>You'll receive a shipping confirmation with tracking information</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-2">3.</span>
              <span>Your package will arrive within the estimated delivery window</span>
            </li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <Link href="/shop">
            <Button size="lg" className="bg-amber hover:bg-gold text-white px-8">
              Continue Shopping
            </Button>
          </Link>
          <p className="text-sm text-cream/60">
            Need help? <Link href="/contact" className="text-gold hover:text-amber underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
