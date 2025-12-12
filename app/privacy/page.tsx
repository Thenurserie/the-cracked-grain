import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Cracked Grain',
  description: 'The Cracked Grain privacy policy. Learn how we collect, use, and protect your personal information when you shop for homebrew supplies.',
  openGraph: {
    title: 'Privacy Policy',
    description: 'Learn how we protect your personal information.',
    url: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-cream mb-6">Privacy Policy</h1>
        <p className="text-cream/70 text-lg mb-12">
          Last updated: January 2025
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Introduction</h2>
          <p className="text-cream/80 leading-relaxed">
            The Cracked Grain ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from our store.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Information We Collect</h2>
          <h3 className="text-xl font-semibold text-cream mb-3">Personal Information</h3>
          <p className="text-cream/80 leading-relaxed mb-4">
            When you make a purchase or create an account, we collect:
          </p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li>Name and contact information (email, phone number)</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely through our payment processor)</li>
            <li>Order history and preferences</li>
          </ul>

          <h3 className="text-xl font-semibold text-cream mb-3 mt-6">Automatically Collected Information</h3>
          <p className="text-cream/80 leading-relaxed mb-4">
            When you visit our website, we automatically collect:
          </p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>Clickstream data</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">How We Use Your Information</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and customer experience</li>
            <li>Prevent fraudulent transactions and protect our business</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us:
          </p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li>Remember your preferences and shopping cart items</li>
            <li>Understand how you use our website</li>
            <li>Provide personalized content and recommendations</li>
            <li>Analyze website traffic and performance</li>
          </ul>
          <p className="text-cream/80 leading-relaxed mt-4">
            You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Third-Party Services</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            We work with trusted third-party service providers who assist us in operating our website and business:
          </p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li><strong>Payment Processors:</strong> We use secure payment processors to handle transactions. We do not store your complete credit card information.</li>
            <li><strong>Shipping Partners:</strong> We share delivery information with shipping carriers to fulfill your orders.</li>
            <li><strong>Analytics Services:</strong> We use analytics tools to understand website usage and improve our services.</li>
            <li><strong>Email Service Providers:</strong> We use email services to send order confirmations and marketing communications.</li>
          </ul>
          <p className="text-cream/80 leading-relaxed mt-4">
            These third parties have access to your information only to perform specific tasks on our behalf and are obligated to protect your data.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Data Retention</h2>
          <p className="text-cream/80 leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Order information is typically retained for 7 years for accounting and tax purposes.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Your Rights</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="space-y-2 text-cream/80 list-disc pl-6">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
            <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
          </ul>
          <p className="text-cream/80 leading-relaxed mt-4">
            To exercise these rights, please contact us at info@thecrackedgrain.com.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Security</h2>
          <p className="text-cream/80 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Children's Privacy</h2>
          <p className="text-cream/80 leading-relaxed">
            Our website is not intended for individuals under the age of 21. We do not knowingly collect personal information from anyone under 21. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Changes to This Policy</h2>
          <p className="text-cream/80 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gold mb-4">Contact Us</h2>
          <p className="text-cream/80 leading-relaxed mb-4">
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-card border border-amber/20 rounded-lg p-6">
            <p className="text-cream font-semibold mb-2">The Cracked Grain</p>
            <p className="text-cream/80">Bryant, Arkansas</p>
            <p className="text-cream/80">Email: info@thecrackedgrain.com</p>
            <p className="text-cream/80">Phone: (501) 438-0808</p>
          </div>
        </section>
      </div>
    </div>
  );
}
