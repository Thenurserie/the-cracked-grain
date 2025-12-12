import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brewing Blog | The Cracked Grain - Tips, Recipes & Guides',
  description: 'Explore brewing tips, recipes, and guides from The Cracked Grain. Learn homebrewing techniques, ingredient selection, and craft better beer.',
  openGraph: {
    title: 'Brewing Blog & Resources',
    description: 'Homebrewing tips, recipes, and guides to help you craft better beer.',
    url: '/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
