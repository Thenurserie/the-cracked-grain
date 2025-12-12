import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gold mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            Page Not Found
          </h2>
          <p className="text-cream/70 text-lg mb-8">
            Oops! The page you're looking for seems to have wandered off like a wild yeast strain.
          </p>
        </div>

        <div className="bg-card border border-amber/20 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-cream mb-4">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href="/shop?category=grains-malts">
              <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
                Grains & Malts
              </Button>
            </Link>
            <Link href="/shop?category=hops">
              <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
                Hops
              </Button>
            </Link>
            <Link href="/shop?category=yeast">
              <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
                Yeast
              </Button>
            </Link>
            <Link href="/shop?category=equipment">
              <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
                Equipment
              </Button>
            </Link>
            <Link href="/shop?category=fermentation">
              <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
                Fermentation
              </Button>
            </Link>
            <Link href="/shop?category=testing">
              <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
                Testing
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-amber hover:bg-gold text-white">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg" variant="outline" className="border-2 border-amber/30 text-cream hover:bg-amber/10">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Shop
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-amber/20">
          <p className="text-cream/70 mb-4">Need help finding something?</p>
          <Link href="/contact" className="text-gold hover:text-amber underline">
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
}
