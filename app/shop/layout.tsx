import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Homebrew Supplies | The Cracked Grain',
  description: 'Browse our complete selection of premium homebrew supplies. Shop quality grains, hops, yeast, brewing equipment, and more. Free shipping on orders over $75.',
  openGraph: {
    title: 'Shop Homebrew Supplies',
    description: 'Premium brewing ingredients and equipment. Free shipping on orders over $75.',
    url: '/shop',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
