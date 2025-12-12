'use client';

import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { getCartCount } from '@/lib/cart';

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadCartCount();
    window.addEventListener('cartUpdated', loadCartCount);

    return () => {
      window.removeEventListener('cartUpdated', loadCartCount);
    };
  }, []);

  async function loadCartCount() {
    const count = await getCartCount();
    setCartCount(count);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber/20 bg-[#1a1a1a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1a1a]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gold">The Cracked Grain</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Shop
          </Link>
          <Link href="/brewing" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Brewing Tools
          </Link>
          <Link href="/about" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-cream hover:text-gold hover:bg-amber/10">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <button
            className="md:hidden text-cream"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber/20 bg-[#1a1a1a] px-4 py-4">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-sm font-medium text-cream hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-cream hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/brewing"
              className="text-sm font-medium text-cream hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Brewing Tools
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-cream hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-cream hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
