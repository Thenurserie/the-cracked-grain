import { Package, Truck, Zap, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information | The Cracked Grain',
  description: 'Free shipping on orders over $75. Fast, reliable delivery of homebrew supplies. Standard, expedited, and overnight shipping available. Local pickup in Bryant, Arkansas.',
  openGraph: {
    title: 'Shipping Information',
    description: 'Free shipping on orders over $75. Fast, reliable delivery of your brewing supplies.',
    url: '/shipping',
  },
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">Shipping Information</h1>
        <p className="text-cream/70 text-lg mb-12">
          We strive to get your brewing supplies to you quickly and safely.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Shipping Rates & Methods</h2>
            <div className="bg-card border border-amber/20 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#2a2a2a]">
                  <tr>
                    <th className="px-6 py-4 text-left text-cream font-semibold">Method</th>
                    <th className="px-6 py-4 text-left text-cream font-semibold">Delivery Time</th>
                    <th className="px-6 py-4 text-left text-cream font-semibold">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber/20">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-gold" />
                        <span className="text-cream">Standard Shipping</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-cream/80">5-7 business days</td>
                    <td className="px-6 py-4 text-cream">
                      <span className="font-semibold text-gold">FREE</span> on orders $75+
                      <br />
                      <span className="text-sm">$7.99 under $75</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-gold" />
                        <span className="text-cream">Expedited Shipping</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-cream/80">2-3 business days</td>
                    <td className="px-6 py-4 text-cream font-semibold">$14.99</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-gold" />
                        <span className="text-cream">Overnight Shipping</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-cream/80">1 business day</td>
                    <td className="px-6 py-4 text-cream font-semibold">$29.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Processing Time</h2>
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <p className="text-cream/80 leading-relaxed">
                Orders are typically processed within <strong className="text-cream">1-2 business days</strong> after payment confirmation. Orders placed on weekends or holidays will be processed the next business day.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Shipping Coverage</h2>
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-cream font-semibold mb-2">We Ship To:</p>
                  <p className="text-cream/80 leading-relaxed">
                    All 50 United States, including Alaska and Hawaii. Additional shipping charges may apply for Alaska, Hawaii, and territories.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Shipping Restrictions</h2>
            <div className="bg-card border border-amber/20 rounded-lg p-6">
              <ul className="space-y-3 text-cream/80">
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Some items may have shipping restrictions due to size or weight</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Liquid yeast products may require expedited shipping during warm months</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-1">•</span>
                  <span>Certain items cannot be shipped via air freight</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gold mt-1">•</span>
                  <span>We reserve the right to upgrade shipping methods for perishable items</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-card border border-amber/20 rounded-lg p-6">
                <h3 className="text-cream font-semibold mb-2">Do you offer local pickup?</h3>
                <p className="text-cream/80">
                  Yes! Select "Local Pickup" at checkout if you're in the Bryant, Arkansas area. We'll notify you when your order is ready, typically within 1 business day.
                </p>
              </div>

              <div className="bg-card border border-amber/20 rounded-lg p-6">
                <h3 className="text-cream font-semibold mb-2">How do I track my order?</h3>
                <p className="text-cream/80">
                  Once your order ships, you'll receive a tracking number via email. You can use this to track your package through the carrier's website.
                </p>
              </div>

              <div className="bg-card border border-amber/20 rounded-lg p-6">
                <h3 className="text-cream font-semibold mb-2">What if my package is damaged?</h3>
                <p className="text-cream/80">
                  Please inspect your package upon delivery. If you notice any damage, take photos and contact us within 48 hours. We'll work with you to resolve the issue quickly.
                </p>
              </div>

              <div className="bg-card border border-amber/20 rounded-lg p-6">
                <h3 className="text-cream font-semibold mb-2">Can I ship to a business address?</h3>
                <p className="text-cream/80">
                  Absolutely! Just provide the business name and address at checkout. Note that commercial addresses may have different delivery requirements.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
