'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
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
    setIsLoading(true);

    const result = await login(formData.email, formData.password, formData.rememberMe);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 bg-background">
      <Card className="w-full max-w-md bg-card border-amber/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-cream">Welcome Back</CardTitle>
          <p className="text-sm text-cream/70 mt-2">
            Sign in to your account to continue
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

            <div>
              <label className="text-sm text-cream/70 mb-1 block">Email Address</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="bg-[#2a2a2a] border-amber/20 text-cream"
              />
            </div>

            <div>
              <label className="text-sm text-cream/70 mb-1 block">Password</label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="bg-[#2a2a2a] border-amber/20 text-cream"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-amber/20 bg-[#2a2a2a] text-amber focus:ring-gold"
                />
                <span className="text-sm text-cream/70">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-gold hover:text-amber transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber hover:bg-gold text-white"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center pt-4 border-t border-amber/20">
              <p className="text-sm text-cream/70">
                Don't have an account?{' '}
                <Link href="/register" className="text-gold hover:text-amber transition-colors font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
