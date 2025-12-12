'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!mounted || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-amber/30 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-cream/90 text-sm md:text-base mb-2">
              We use cookies to enhance your browsing experience and analyze site traffic.
            </p>
            <Link href="/privacy" className="text-gold hover:text-amber text-sm underline">
              Learn more in our Privacy Policy
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleAccept}
              className="bg-amber hover:bg-gold text-white"
              size="sm"
            >
              Accept All
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="border-cream/30 text-cream hover:bg-cream/10"
              size="sm"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
