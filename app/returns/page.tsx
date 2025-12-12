import { RotateCcw, Package, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return Policy | The Cracked Grain',
  description: '30-day return policy on homebrew supplies. Easy returns on unopened items, defective product replacements, and hassle-free refunds. Customer satisfaction guaranteed.',
  openGraph: {
    title: 'Return Policy',
    description: '30-day returns on unopened items. Customer satisfaction guaranteed.',
    url: '/returns',
  },
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">Return Policy</h1>
        <p className="text-cream/70 text-lg mb-12">
          We want you to be completely satisfied with your purchase. If you're not, we're here to help.
        </p>

        <div className="space-y-12">
          <section className="bg-amber/10 border border-amber/30 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <RotateCcw className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-cream mb-2">30-Day Return Policy</h2>
                <p className="text-cream/80 leading-relaxed">
                  You may return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the return shipping costs if the return is a result of our error.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Return Conditions</h2>
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <p className="text-cream/80 mb-4">To be eligible for a return, items must meet the following criteria:</p>
              <ul className="space-y-3 text-cream/80">
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-1">✓</span>
                  <span>Item must be unused and in the same condition that you received it</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-1">✓</span>
                  <span>Item must be in original packaging with all tags and labels attached</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-1">✓</span>
                  <span>Return must be initiated within 30 days of delivery</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-1">✓</span>
                  <span>Proof of purchase (receipt or order number) is required</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">How to Initiate a Return</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-amber/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gold">1</span>
                </div>
                <h3 className="text-cream font-semibold mb-2">Contact Us</h3>
                <p className="text-sm text-cream/70">
                  Email us at info@thecrackedgrain.com or call (501) 438-0808 with your order number.
                </p>
              </div>

              <div className="bg-card border border-amber/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gold">2</span>
                </div>
                <h3 className="text-cream font-semibold mb-2">Get RMA Number</h3>
                <p className="text-sm text-cream/70">
                  We'll provide you with a Return Merchandise Authorization (RMA) number and instructions.
                </p>
              </div>

              <div className="bg-card border border-amber/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gold">3</span>
                </div>
                <h3 className="text-cream font-semibold mb-2">Ship It Back</h3>
                <p className="text-sm text-cream/70">
                  Package the item securely with your RMA number and ship to the address provided.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Refund Processing</h2>
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-cream/80 leading-relaxed mb-4">
                    Once we receive your return, we'll inspect it and notify you of the approval or rejection of your refund.
                  </p>
                  <p className="text-cream/80 leading-relaxed">
                    If approved, your refund will be processed within <strong className="text-cream">5-7 business days</strong>, and a credit will automatically be applied to your original method of payment.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Exchanges</h2>
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <p className="text-cream/80 leading-relaxed mb-4">
                If you need to exchange an item for the same product (different size, color, etc.), please contact us for the fastest service.
              </p>
              <p className="text-cream/80 leading-relaxed">
                Send us an email at info@thecrackedgrain.com with your order number and the item(s) you'd like to exchange.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Damaged or Defective Items</h2>
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-cream/80 leading-relaxed mb-4">
                    If you receive a damaged or defective item, please contact us immediately at info@thecrackedgrain.com with:
                  </p>
                  <ul className="space-y-2 text-cream/80">
                    <li className="flex items-start space-x-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Your order number</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Photos of the damaged or defective item</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-gold mt-1">•</span>
                      <span>Description of the issue</span>
                    </li>
                  </ul>
                  <p className="text-cream/80 leading-relaxed mt-4">
                    We'll replace the item or issue a full refund, including shipping costs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Non-Returnable Items</h2>
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-cream/80 mb-4">The following items cannot be returned:</p>
                  <ul className="space-y-2 text-cream/80">
                    <li className="flex items-start space-x-2">
                      <span className="text-gold mt-1">×</span>
                      <span>Opened or used grains, hops, and yeast</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-gold mt-1">×</span>
                      <span>Perishable ingredients past their return window</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-gold mt-1">×</span>
                      <span>Custom or special-order items</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-gold mt-1">×</span>
                      <span>Gift cards</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-gold mt-1">×</span>
                      <span>Sale or clearance items (unless defective)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-amber/20 pt-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-cream mb-4">Questions About Returns?</h2>
              <p className="text-cream/70 mb-6">
                Our customer service team is here to help make your return as easy as possible.
              </p>
              <Link href="/contact">
                <Button className="bg-amber hover:bg-gold text-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
