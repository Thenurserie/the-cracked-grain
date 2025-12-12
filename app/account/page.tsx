'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User, LogOut, Beer, Beaker, Package } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [brewSessions, setBrewSessions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    loadUserData(user.id);
    setLoading(false);
  };

  const loadUserData = async (userId: string) => {
    const { data: recipesData } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: sessionsData } = await supabase
      .from('brew_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('brew_date', { ascending: false })
      .limit(10);

    setRecipes(recipesData || []);
    setBrewSessions(sessionsData || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-gold" />
            <div>
              <h1 className="text-3xl font-bold text-cream">My Account</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="brews">Brew Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                  <Beer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recipes.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Brew Sessions</CardTitle>
                  <Beaker className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{brewSessions.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with your brewing journey</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-24"
                  onClick={() => router.push('/brewing?tab=recipe-builder')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Beer className="h-6 w-6" />
                    <span>Create New Recipe</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-24"
                  onClick={() => router.push('/brewing?tab=brew-sessions')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Beaker className="h-6 w-6" />
                    <span>Start Brew Session</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-24"
                  onClick={() => router.push('/brewing?tab=recipe-library')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-6 w-6" />
                    <span>Browse Recipes</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-24"
                  onClick={() => router.push('/shop')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-6 w-6" />
                    <span>Shop Ingredients</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes">
            <Card>
              <CardHeader>
                <CardTitle>My Recipes</CardTitle>
                <CardDescription>Your saved brewing recipes</CardDescription>
              </CardHeader>
              <CardContent>
                {recipes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No recipes yet. Create your first recipe in the Recipe Builder!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recipes.map((recipe) => (
                      <div key={recipe.id} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{recipe.name}</h3>
                        <p className="text-sm text-muted-foreground">{recipe.style}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>ABV: {recipe.abv?.toFixed(1)}%</span>
                          <span>IBU: {recipe.ibu?.toFixed(0)}</span>
                          <span>OG: {recipe.og?.toFixed(3)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brews">
            <Card>
              <CardHeader>
                <CardTitle>Brew Sessions</CardTitle>
                <CardDescription>Your brewing history</CardDescription>
              </CardHeader>
              <CardContent>
                {brewSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No brew sessions recorded yet. Start tracking your brews!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {brewSessions.map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{session.recipe_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.brew_date).toLocaleDateString()}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Batch: {session.batch_size} gal</span>
                          <span>OG: {session.og?.toFixed(3)}</span>
                          <span>FG: {session.fg?.toFixed(3)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
