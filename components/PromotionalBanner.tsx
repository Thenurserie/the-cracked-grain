'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, X } from 'lucide-react';
import Link from 'next/link';

interface Subscription {
  tier: 'free' | 'premium';
}

export function PromotionalBanner() {
  const { isLoggedIn } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed this session
    const dismissed = sessionStorage.getItem('promo-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      setIsLoading(false);
      return;
    }

    if (isLoggedIn) {
      loadSubscription();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const loadSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      const data = await response.json();

      if (data.success && data.subscription) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('promo-banner-dismissed', 'true');
  };

  // Don't show banner if:
  // - Still loading
  // - User is premium
  // - Banner was dismissed
  if (isLoading || isDismissed) {
    return null;
  }

  if (subscription?.tier === 'premium') {
    return null;
  }

  // Only show for logged-in free users
  if (!isLoggedIn || !subscription) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-amber/20 to-gold/20 border-gold mb-6">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Crown className="h-6 w-6 text-gold flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gold mb-0.5">
                Upgrade to Premium
              </p>
              <p className="text-xs text-cream/80">
                Get unlimited batches, inventory, and recipes for just $3/month
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/account/subscription">
              <Button
                size="sm"
                className="bg-amber hover:bg-gold text-white whitespace-nowrap"
              >
                View Plans
              </Button>
            </Link>
            <button
              onClick={handleDismiss}
              className="text-cream/50 hover:text-cream transition-colors p-1"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
