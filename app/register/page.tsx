'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate terms acceptance
    if (!formData.acceptTerms) {
      setError('You must accept the terms of service');
      return;
    }

    setIsLoading(true);

    const result = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.phone || undefined
    );

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 8) return 'weak';
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
    return 'medium';
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 bg-background">
      <Card className="w-full max-w-2xl bg-card border-amber/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-cream">Create Account</CardTitle>
          <p className="text-sm text-cream/70 mt-2">
            Join The Cracked Grain community today
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-cream/70 mb-1 block">First Name *</label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  required
                  className="bg-[#2a2a2a] border-amber/20 text-cream"
                />
              </div>

              <div>
                <label className="text-sm text-cream/70 mb-1 block">Last Name *</label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                  required
                  className="bg-[#2a2a2a] border-amber/20 text-cream"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-cream/70 mb-1 block">Email Address *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="bg-[#2a2a2a] border-amber/20 text-cream"
              />
            </div>

            <div>
              <label className="text-sm text-cream/70 mb-1 block">Phone Number (Optional)</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 555-5555"
                className="bg-[#2a2a2a] border-amber/20 text-cream"
              />
            </div>

            <div>
              <label className="text-sm text-cream/70 mb-1 block">Password *</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="bg-[#2a2a2a] border-amber/20 text-cream"
              />
              {strength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded ${strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <div className={`h-1 flex-1 rounded ${strength === 'medium' || strength === 'strong' ? strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-600'}`} />
                    <div className={`h-1 flex-1 rounded ${strength === 'strong' ? 'bg-green-500' : 'bg-gray-600'}`} />
                  </div>
                  <p className="text-xs mt-1 text-cream/60">
                    {strength === 'weak' && 'Weak password - use at least 8 characters'}
                    {strength === 'medium' && 'Medium password - add numbers and uppercase letters'}
                    {strength === 'strong' && 'Strong password'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-cream/70 mb-1 block">Confirm Password *</label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="bg-[#2a2a2a] border-amber/20 text-cream"
              />
              {formData.confirmPassword && (
                <div className="mt-1 flex items-center gap-1">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-500">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="w-4 h-4 mt-1 rounded border-amber/20 bg-[#2a2a2a] text-amber focus:ring-gold"
                required
              />
              <label htmlFor="terms" className="text-sm text-cream/70">
                I agree to the{' '}
                <Link href="/terms" className="text-gold hover:text-amber transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-gold hover:text-amber transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber hover:bg-gold text-white"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center pt-4 border-t border-amber/20">
              <p className="text-sm text-cream/70">
                Already have an account?{' '}
                <Link href="/login" className="text-gold hover:text-amber transition-colors font-semibold">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
