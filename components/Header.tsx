'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, User, LogOut, Package, Beaker, Trophy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { getCartCount } from '@/lib/cartClient';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const { currentUser, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    loadCartCount();
    window.addEventListener('cartUpdated', loadCartCount);

    return () => {
      window.removeEventListener('cartUpdated', loadCartCount);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      loadSubscription();
    }
  }, [isLoggedIn, currentUser]);

  async function loadSubscription() {
    try {
      const response = await fetch('/api/user/subscription');
      const data = await response.json();

      if (data.success && data.subscription) {
        setIsPremium(data.subscription.tier === 'premium');
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  async function loadCartCount() {
    const count = await getCartCount();
    setCartCount(count);
  }

  async function handleLogout() {
    await logout();
    setUserMenuOpen(false);
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber/20 bg-[#1a1a1a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1a1a]/80">
      <div className="container mx-auto flex h-32 md:h-40 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="https://admin.thecrackedgrain.com/assets/d7a88cfe-5eea-405c-92de-8b7003ff3618"
            alt="The Cracked Grain"
            width={560}
            height={140}
            className="h-[100px] md:h-[140px] w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Shop
          </Link>
          <Link href="/recipes" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Recipes
          </Link>
          <Link href="/kits" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Kits
          </Link>
          <Link href="/guides" className="text-sm font-medium text-cream hover:text-gold transition-colors">
            Brew Guides
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
          {/* User Menu / Sign In - Desktop */}
          {mounted && (
            <div className="hidden md:block">
              {isLoggedIn && currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-cream hover:text-gold transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-gold" />
                    </div>
                    <span>{currentUser.firstName}</span>
                    {isPremium && (
                      <span className="text-xs bg-gold text-white px-2 py-0.5 rounded font-bold">PRO</span>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-amber/20 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-amber/20">
                        <p className="text-sm font-medium text-cream">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-cream/60">{currentUser.email}</p>
                      </div>

                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-cream hover:bg-amber/10 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        My Account
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-cream hover:bg-amber/10 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>

                      <Link
                        href="/brewing"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-cream hover:bg-amber/10 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Beaker className="h-4 w-4" />
                        My Brewing Tools
                      </Link>

                      <div className="border-t border-amber/20 mt-2 pt-2">
                        <div className="flex items-center gap-3 px-4 py-2 text-sm text-cream/70">
                          <Trophy className="h-4 w-4 text-gold" />
                          <span>{currentUser.loyaltyPoints} Loyalty Points</span>
                        </div>
                      </div>

                      <div className="border-t border-amber/20 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-amber/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-amber hover:bg-gold text-white">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          )}

          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-cream hover:text-gold hover:bg-amber/10"
              aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} item${cartCount !== 1 ? 's' : ''}` : ''}`}
            >
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
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber/20 bg-[#1a1a1a] px-4 py-4">
          <nav className="flex flex-col space-y-3">
            {/* User section in mobile menu */}
            {mounted && (
              <>
                {isLoggedIn && currentUser ? (
                  <div className="pb-3 border-b border-amber/20">
                    <p className="text-sm font-medium text-cream mb-1">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-xs text-cream/60 mb-3">{currentUser.email}</p>

                    <Link
                      href="/account"
                      className="flex items-center gap-2 py-2 text-sm text-cream hover:text-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      My Account
                    </Link>

                    <Link
                      href="/orders"
                      className="flex items-center gap-2 py-2 text-sm text-cream hover:text-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>

                    <div className="flex items-center gap-2 py-2 text-sm text-cream/70">
                      <Trophy className="h-4 w-4 text-gold" />
                      {currentUser.loyaltyPoints} Points
                    </div>

                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2 py-2 text-sm text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="py-2 text-sm font-medium text-gold hover:text-amber transition-colors border-b border-amber/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

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
              href="/recipes"
              className="text-sm font-medium text-cream hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipes
            </Link>
            <Link
              href="/kits"
              className="text-sm font-medium text-cream hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kits
            </Link>
            <Link
              href="/guides"
              className="text-sm font-medium text-cream hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Brew Guides
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
