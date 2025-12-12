'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our products, add items to your cart, and proceed to checkout. You will need to provide shipping information and payment details to complete your order.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) processed securely through Square. We also accept PayPal.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! Once your order ships, you will receive a tracking number via email. You can use this to track your package through the carrier website.',
      },
      {
        q: 'Can I cancel or modify my order?',
        a: 'You can cancel or modify your order within 1 hour of placing it. After that, it may have already been processed. Contact us immediately at (501) 438-0808 for assistance.',
      },
    ],
  },
  {
    category: 'Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 5-7 business days, expedited 2-3 days, and overnight 1 business day. Processing time is 1-2 business days.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders over $75. Orders under $75 have a $7.99 shipping fee.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we only ship within the United States, including Alaska and Hawaii. We do not ship internationally at this time.',
      },
      {
        q: 'Do you offer local pickup?',
        a: 'Yes! Select Local Pickup at checkout if you are in the Bryant, Arkansas area. We will notify you when your order is ready, typically within 1 business day.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'How fresh are your ingredients?',
        a: 'We rotate our inventory regularly to ensure maximum freshness. Hops are stored in cold storage, and yeast is refrigerated. We include best by dates on all perishable items.',
      },
      {
        q: 'How should I store my brewing ingredients?',
        a: 'Store grains in a cool, dry place. Keep hops in the freezer. Refrigerate liquid yeast and use within 3-6 months. Dry yeast can be stored at room temperature.',
      },
      {
        q: 'Can I substitute ingredients in a recipe?',
        a: 'Many ingredients can be substituted, but it may affect the final flavor. Contact us for guidance on substitutions - our staff are experienced brewers happy to help!',
      },
      {
        q: 'Do you offer organic ingredients?',
        a: 'We carry select organic malts and hops. Look for the Organic label in product descriptions, or filter by organic in the shop.',
      },
    ],
  },
  {
    category: 'Brewing',
    questions: [
      {
        q: 'I am new to homebrewing - where should I start?',
        a: 'We recommend starting with an extract brewing kit, which includes all the equipment and ingredients you need for your first batch. Visit our store or call us for personalized recommendations!',
      },
      {
        q: 'What equipment do I need to start brewing?',
        a: 'Basic equipment includes a brew kettle, fermenter, airlock, siphon, bottles, and sanitizer. We offer starter kits that include everything you need.',
      },
      {
        q: 'How much beer does a typical batch make?',
        a: 'Most homebrew recipes make 5-gallon batches, which yields approximately 50 twelve-ounce bottles or two cases of beer.',
      },
      {
        q: 'How long does it take to brew beer?',
        a: 'Brewing day typically takes 4-6 hours. Fermentation takes 1-2 weeks, followed by 2 weeks of bottle conditioning. Total time from brew to pour is about 4-6 weeks.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns of unopened, unused items within 30 days of delivery. Items must be in original packaging. Contact us for a Return Authorization (RMA) number before shipping back.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Once we receive and inspect your return, refunds are processed within 5-7 business days. The credit will appear on your original payment method.',
      },
      {
        q: 'Can I return opened ingredients?',
        a: 'For health and safety reasons, we cannot accept returns of opened grains, hops, yeast, or other brewing ingredients unless they are defective.',
      },
      {
        q: 'What if I receive a damaged item?',
        a: 'Contact us immediately with photos of the damage. We will arrange for a replacement or full refund, including shipping costs.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card border border-amber/20 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-amber/5 transition-colors"
      >
        <span className="text-cream font-medium pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gold flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-amber/20 bg-[#2a2a2a]">
          <p className="text-cream/80 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-cream/70 text-lg">
            Find answers to common questions about ordering, shipping, products, and brewing.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-gold mb-6">{section.category}</h2>
              <div className="space-y-3">
                {section.questions.map((item, qIdx) => (
                  <FAQItem key={qIdx} question={item.q} answer={item.a} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center bg-card border border-amber/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-cream mb-4">Still Have Questions?</h2>
          <p className="text-cream/70 mb-6">
            Our knowledgeable staff is here to help with all your homebrewing questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="inline-block">
              <button className="bg-amber hover:bg-gold text-white px-8 py-3 rounded font-semibold transition-colors">
                Contact Us
              </button>
            </a>
            <a href="tel:+15014380808" className="inline-block">
              <button className="bg-transparent border-2 border-amber/30 text-cream hover:bg-amber/10 px-8 py-3 rounded font-semibold transition-colors">
                Call (501) 438-0808
              </button>
            </a>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.flatMap((section) =>
              section.questions.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.a,
                },
              }))
            ),
          }),
        }}
      />
    </div>
  );
}
