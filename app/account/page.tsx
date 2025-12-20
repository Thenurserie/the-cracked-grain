'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Package, Beaker, Trophy, Mail, Phone, Calendar, Crown, Plus, Minus, Loader2 } from 'lucide-react';

interface LoyaltyTransaction {
  id: string;
  points: number;
  type: string;
  description: string | null;
  createdAt: string;
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadLoyaltyTransactions();
    }
  }, [currentUser]);

  const loadLoyaltyTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const response = await fetch('/api/user/loyalty');
      const data = await response.json();

      if (data.success && data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to load loyalty transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  if (!currentUser) return null;

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-amber/20 flex items-center justify-center">
              <User className="h-10 w-10 text-gold" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-cream mb-2">
            {currentUser.firstName} {currentUser.lastName}
          </h1>
          <p className="text-cream/70">{currentUser.email}</p>
        </div>

        {/* Account Details */}
        <Card className="bg-card border-amber/20">
          <CardHeader>
            <CardTitle className="text-gold">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-cream/80">
                <Mail className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xs text-cream/60">Email</p>
                  <p className="font-medium">{currentUser.email}</p>
                </div>
              </div>

              {currentUser.phone && (
                <div className="flex items-center gap-3 text-cream/80">
                  <Phone className="h-5 w-5 text-gold" />
                  <div>
                    <p className="text-xs text-cream/60">Phone</p>
                    <p className="font-medium">{currentUser.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-cream/80">
                <Calendar className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xs text-cream/60">Member Since</p>
                  <p className="font-medium">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-cream/80">
                <Crown className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xs text-cream/60">Membership</p>
                  <p className="font-medium capitalize">{currentUser.subscriptionTier}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-amber/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-gold" />
                  <div>
                    <p className="text-sm text-cream/60">Loyalty Points</p>
                    <p className="text-2xl font-bold text-gold">{currentUser.loyaltyPoints}</p>
                  </div>
                </div>
                <Button variant="outline" className="border-amber/30 text-cream hover:bg-amber/10">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/brewing?tab=batches">
            <Card className="bg-card border-amber/20 hover:border-gold transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Beaker className="h-12 w-12 text-gold mb-3" />
                <h3 className="font-semibold text-cream mb-1">My Batches</h3>
                <p className="text-sm text-cream/60">Track your brews</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/brewing?tab=inventory">
            <Card className="bg-card border-amber/20 hover:border-gold transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-12 w-12 text-gold mb-3" />
                <h3 className="font-semibold text-cream mb-1">My Inventory</h3>
                <p className="text-sm text-cream/60">Manage supplies</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/orders">
            <Card className="bg-card border-amber/20 hover:border-gold transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-12 w-12 text-gold mb-3" />
                <h3 className="font-semibold text-cream mb-1">Order History</h3>
                <p className="text-sm text-cream/60">View past orders</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Loyalty Points History */}
        <Card className="bg-card border-amber/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gold flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Loyalty Points History
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-cream/60 text-center py-8">
                No transactions yet. Earn points by making purchases!
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  {displayedTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between p-3 bg-card/50 border border-amber/10 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {txn.points > 0 ? (
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-green-500" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Minus className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-cream">
                            {txn.description || txn.type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-cream/50">
                            {new Date(txn.createdAt).toLocaleDateString()} at{' '}
                            {new Date(txn.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold ${txn.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {txn.points > 0 ? '+' : ''}{txn.points} pts
                      </div>
                    </div>
                  ))}
                </div>

                {transactions.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button
                      onClick={() => setShowAllTransactions(!showAllTransactions)}
                      variant="outline"
                      className="border-amber/30 text-cream hover:bg-amber/10"
                    >
                      {showAllTransactions ? 'Show Less' : `Show All (${transactions.length})`}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
