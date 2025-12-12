import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | The Cracked Grain',
  description: 'Terms of service for The Cracked Grain homebrew supply store. Review our policies, user responsibilities, and legal agreements.',
  openGraph: {
    title: 'Terms of Service',
    description: 'Review our terms and conditions.',
    url: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">Terms of Service</h1>
        <p className="text-cream/70 text-lg mb-12">
          Last updated: January 2025
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">1. Acceptance of Terms</h2>
          <p className="text-cream/80 leading-relaxed">
            By accessing and using The Cracked Grain website, you accept and agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">2. Use of Website</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            You must be at least 21 years old to use this website and purchase products. By using this site, you represent that you meet this age requirement.
          </p>
          <p className="text-cream/80 leading-relaxed mb-4">You agree not to:</p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li>Use the website for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to any portion of the website</li>
            <li>Interfere with or disrupt the website or servers</li>
            <li>Impersonate any person or entity</li>
            <li>Post or transmit any harmful, threatening, or offensive content</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">3. Account Responsibilities</h2>
          <p className="text-cream/80 leading-relaxed">
            If you create an account, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">4. Product Information</h2>
          <p className="text-cream/80 leading-relaxed">
            We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions, images, pricing, or other content is accurate, complete, or error-free. We reserve the right to correct any errors and to change or update information at any time without prior notice.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">5. Pricing and Availability</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            All prices are subject to change without notice. We reserve the right to:
          </p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li>Limit quantities of products purchased</li>
            <li>Discontinue products at any time</li>
            <li>Refuse service to anyone for any reason</li>
            <li>Correct pricing errors even after an order is submitted</li>
          </ul>
          <p className="text-cream/80 leading-relaxed mt-4">
            If a product is listed at an incorrect price due to an error, we will contact you before processing your order.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">6. Payment Terms</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            Payment is due at the time of order placement. We accept major credit cards and other payment methods as indicated on our website. By providing payment information, you represent that you are authorized to use the payment method.
          </p>
          <p className="text-cream/80 leading-relaxed">
            All payments are processed securely through our third-party payment processor. We do not store complete credit card information on our servers.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">7. Shipping and Delivery</h2>
          <p className="text-cream/80 leading-relaxed">
            Shipping terms and delivery estimates are provided at checkout. Title and risk of loss pass to you upon delivery to the carrier. We are not responsible for delays caused by shipping carriers or circumstances beyond our control. See our Shipping Policy for complete details.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">8. Returns and Refunds</h2>
          <p className="text-cream/80 leading-relaxed">
            Our return policy is outlined in detail on our Returns page. Returns must comply with our stated conditions and timeframes. We reserve the right to refuse returns that do not meet our policy requirements.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">9. Intellectual Property</h2>
          <p className="text-cream/80 leading-relaxed">
            All content on this website, including text, graphics, logos, images, and software, is the property of The Cracked Grain or its content suppliers and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">10. Limitation of Liability</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            To the fullest extent permitted by law, The Cracked Grain shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
          </p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li>Your use or inability to use our website or products</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Any errors or omissions in content</li>
            <li>Any conduct or content of third parties</li>
          </ul>
          <p className="text-cream/80 leading-relaxed mt-4">
            Our total liability shall not exceed the amount you paid for the product giving rise to the claim.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">11. Indemnification</h2>
          <p className="text-cream/80 leading-relaxed">
            You agree to indemnify and hold harmless The Cracked Grain, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the website or violation of these Terms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">12. Governing Law</h2>
          <p className="text-cream/80 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the State of Arkansas, without regard to its conflict of law provisions. Any legal action or proceeding shall be brought exclusively in the courts of Arkansas.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">13. Changes to Terms</h2>
          <p className="text-cream/80 leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the website after changes are posted constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">14. Contact Information</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            For questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-card border border-amber/20 rounded-lg p-6">
            <p className="text-cream font-semibold mb-2">The Cracked Grain</p>
            <p className="text-cream/80">Part of The Nurserie Family</p>
            <p className="text-cream/80">Bryant, Arkansas</p>
            <p className="text-cream/80">Email: info@thecrackedgrain.com</p>
            <p className="text-cream/80">Phone: (501) 438-0808</p>
          </div>
        </section>
      </div>
    </div>
  );
}
