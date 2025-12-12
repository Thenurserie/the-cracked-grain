import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | The Cracked Grain - Homebrew Supply Questions',
  description: 'Find answers to frequently asked questions about ordering, shipping, products, and homebrewing. Learn about our policies, ingredient freshness, and brewing tips.',
  openGraph: {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about homebrewing, our products, shipping, and more.',
    url: '/faq',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
