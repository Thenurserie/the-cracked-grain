'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Package, Beaker, Trophy, Mail, Phone, Calendar, Crown } from 'lucide-react';

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

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
      </div>
    </div>
  );
}
