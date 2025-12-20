'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, X, Trophy, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Subscription {
  tier: 'free' | 'premium';
  expiresAt: string | null;
}

interface Usage {
  batches: number;
  inventory: number;
  recipes: number;
}

interface Limits {
  batches: number;
  inventory: number;
  recipes: number;
}

const POINTS_PER_MONTH = 500;

export default function SubscriptionPage() {
  return (
    <ProtectedRoute>
      <SubscriptionContent />
    </ProtectedRoute>
  );
}

function SubscriptionContent() {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [limits, setLimits] = useState<Limits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadSubscription();
    }
  }, [currentUser]);

  const loadSubscription = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/subscription');
      const data = await response.json();

      if (data.success) {
        setSubscription(data.subscription);
        setUsage(data.usage);
        setLimits(data.limits);
      } else {
        throw new Error(data.error || 'Failed to load subscription');
      }
    } catch (error: any) {
      console.error('Failed to load subscription:', error);
      setError('Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemPoints = async (months: number = 1) => {
    if (!currentUser) return;

    const pointsRequired = POINTS_PER_MONTH * months;

    if (currentUser.loyaltyPoints < pointsRequired) {
      toast.error(`You need ${pointsRequired} points for ${months} month(s). You have ${currentUser.loyaltyPoints} points.`);
      return;
    }

    setIsRedeeming(true);
    setError('');

    try {
      const response = await fetch('/api/user/subscription/redeem-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ months }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        await loadSubscription();
        // Refresh user data to update points
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to redeem points');
      }
    } catch (error: any) {
      console.error('Redeem points error:', error);
      setError(error.message || 'Failed to redeem points');
      toast.error(error.message || 'Failed to redeem points');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleUpgradeClick = () => {
    toast.info('Payment integration coming soon! Please use points redemption for now.');
  };

  if (!currentUser) return null;

  const isPremium = subscription?.tier === 'premium';
  const daysRemaining = subscription?.expiresAt
    ? Math.ceil((new Date(subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cream mb-2">Subscription & Upgrades</h1>
          <p className="text-cream/70">Choose the plan that's right for you</p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/10 border-red-500/50">
            <CardContent className="flex items-center gap-2 py-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Current Status */}
        {isLoading ? (
          <Card className="bg-card border-amber/20">
            <CardContent className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-gold" />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-amber/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Current Plan: {isPremium ? 'Premium' : 'Free'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cream/70">Status</p>
                  <Badge className={isPremium ? 'bg-gold text-white' : 'bg-amber/20 text-gold border-amber/40'}>
                    {isPremium ? 'Premium Member' : 'Free Tier'}
                  </Badge>
                </div>

                {isPremium && subscription?.expiresAt && (
                  <div>
                    <p className="text-sm text-cream/70">Expires</p>
                    <p className="text-cream font-medium">
                      {new Date(subscription.expiresAt).toLocaleDateString()}
                      {daysRemaining > 0 && (
                        <span className="text-sm text-cream/60 ml-2">
                          ({daysRemaining} days remaining)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Usage Stats */}
              {usage && limits && (
                <div className="pt-4 border-t border-amber/20">
                  <p className="text-sm font-medium text-cream/70 mb-3">Current Usage</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card/50 border border-amber/10 rounded-lg p-3">
                      <p className="text-xs text-cream/60 mb-1">Batches</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gold">{usage.batches}</span>
                        <span className="text-sm text-cream/60">/ {isPremium ? '∞' : limits.batches}</span>
                      </div>
                    </div>

                    <div className="bg-card/50 border border-amber/10 rounded-lg p-3">
                      <p className="text-xs text-cream/60 mb-1">Inventory Items</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gold">{usage.inventory}</span>
                        <span className="text-sm text-cream/60">/ {isPremium ? '∞' : limits.inventory}</span>
                      </div>
                    </div>

                    <div className="bg-card/50 border border-amber/10 rounded-lg p-3">
                      <p className="text-xs text-cream/60 mb-1">Recipes</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gold">{usage.recipes}</span>
                        <span className="text-sm text-cream/60">/ {isPremium ? '∞' : limits.recipes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pricing Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <Card className="bg-card border-amber/20">
            <CardHeader>
              <CardTitle className="text-cream flex items-center justify-between">
                Free Tier
                {!isPremium && <Badge className="bg-amber/20 text-gold border-amber/40">Current</Badge>}
              </CardTitle>
              <p className="text-2xl font-bold text-gold">$0<span className="text-sm font-normal text-cream/60">/month</span></p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-cream">Up to 5 batches</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-cream">Up to 20 inventory items</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-cream">Up to 3 recipes</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-cream">Basic brewing tools</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-cream/60">Advanced features</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="bg-gradient-to-br from-amber/10 to-gold/10 border-gold relative overflow-hidden">
            {isPremium && (
              <div className="absolute top-0 right-0 bg-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                ACTIVE
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Premium
              </CardTitle>
              <p className="text-2xl font-bold text-gold">$3<span className="text-sm font-normal text-cream/60">/month</span></p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-cream">Unlimited batches</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-cream">Unlimited inventory items</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-cream">Unlimited recipes</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-cream">Advanced tools (coming soon)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-cream">No promotional banners</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-cream">Priority support</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-cream">Early access to new features</span>
                </div>
              </div>

              {!isPremium && (
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleUpgradeClick}
                    className="w-full bg-amber hover:bg-gold text-white"
                    size="lg"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Upgrade to Premium - $3/month
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-amber/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-cream/60">or redeem points</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleRedeemPoints(1)}
                      disabled={isRedeeming || currentUser.loyaltyPoints < POINTS_PER_MONTH}
                      variant="outline"
                      className="w-full border-amber/30 text-cream hover:bg-amber/10"
                    >
                      {isRedeeming ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Redeeming...</>
                      ) : (
                        <><Trophy className="h-4 w-4 mr-2" />Redeem {POINTS_PER_MONTH} Points for 1 Month</>
                      )}
                    </Button>

                    <p className="text-xs text-center text-cream/60">
                      You have {currentUser.loyaltyPoints} points
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
