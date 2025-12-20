'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Beaker, Package, BookOpen, Plus, Loader2, Edit2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserBatch {
  id: string;
  name: string;
  style: string;
  brewDate: string;
  status: string;
  originalGravity: string;
  finalGravity: string;
  abv: number;
  notes: string | null;
  createdAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string | null;
  expirationDate: string | null;
  notes: string | null;
  createdAt: string;
}

interface UserRecipe {
  id: string;
  name: string;
  style: string | null;
  batchSize: number | null;
  recipeData: any;
  notes: string | null;
  isPublic: boolean;
  createdAt: string;
}

export default function BrewingToolsPage() {
  return (
    <ProtectedRoute>
      <BrewingToolsContent />
    </ProtectedRoute>
  );
}

function BrewingToolsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'batches';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [batches, setBatches] = useState<UserBatch[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [batchesRes, inventoryRes, recipesRes] = await Promise.all([
        fetch('/api/user/batches'),
        fetch('/api/user/inventory'),
        fetch('/api/user/recipes'),
      ]);

      const [batchesData, inventoryData, recipesData] = await Promise.all([
        batchesRes.json(),
        inventoryRes.json(),
        recipesRes.json(),
      ]);

      if (batchesData.success) setBatches(batchesData.batches || []);
      if (inventoryData.success) setInventory(inventoryData.items || []);
      if (recipesData.success) setRecipes(recipesData.recipes || []);
    } catch (error: any) {
      console.error('Failed to load brewing data:', error);
      setError('Failed to load your brewing data');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    router.push(`/account/brewing?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cream mb-2">My Brewing Tools</h1>
            <p className="text-cream/70">Manage your batches, inventory, and recipes</p>
          </div>
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={navigateToTab}>
          <TabsList className="grid w-full grid-cols-3 bg-card border border-amber/20">
            <TabsTrigger value="batches" className="data-[state=active]:bg-amber data-[state=active]:text-white">
              <Beaker className="h-4 w-4 mr-2" />
              Batches
              {batches.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-gold text-white">
                  {batches.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-amber data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Inventory
              {inventory.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-gold text-white">
                  {inventory.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recipes" className="data-[state=active]:bg-amber data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Recipes
              {recipes.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-gold text-white">
                  {recipes.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Batches Tab */}
          <TabsContent value="batches" className="mt-6">
            <Card className="bg-card border-amber/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gold">My Batches ({batches.length})</CardTitle>
                <Link href="/brewing?tab=batches">
                  <Button className="bg-amber hover:bg-gold text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Batch
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-gold" />
                  </div>
                ) : batches.length === 0 ? (
                  <div className="text-center py-12">
                    <Beaker className="h-16 w-16 mx-auto mb-4 text-cream/30" />
                    <p className="text-cream/70 mb-4">No batches yet. Start tracking your brews!</p>
                    <Link href="/brewing?tab=batches">
                      <Button className="bg-amber hover:bg-gold text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Batch
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {batches.map((batch) => (
                      <Link key={batch.id} href="/brewing?tab=batches">
                        <Card className="bg-card/50 border-amber/20 hover:border-gold transition-colors cursor-pointer">
                          <CardHeader>
                            <CardTitle className="text-lg text-cream flex items-center justify-between">
                              {batch.name}
                              <Edit2 className="h-4 w-4 text-cream/50" />
                            </CardTitle>
                            <p className="text-sm text-cream/60">{batch.style}</p>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-cream/60">Status:</span>
                              <Badge className="bg-amber/20 text-gold border-amber/40">
                                {batch.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-cream/60">ABV:</span>
                              <span className="text-cream font-medium">{batch.abv}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-cream/60">Brew Date:</span>
                              <span className="text-cream/80">{new Date(batch.brewDate).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="mt-6">
            <Card className="bg-card border-amber/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gold">My Inventory ({inventory.length})</CardTitle>
                <Link href="/brewing?tab=inventory">
                  <Button className="bg-amber hover:bg-gold text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-gold" />
                  </div>
                ) : inventory.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-cream/30" />
                    <p className="text-cream/70 mb-4">No inventory items yet. Start tracking your supplies!</p>
                    <Link href="/brewing?tab=inventory">
                      <Button className="bg-amber hover:bg-gold text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Item
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inventory.map((item) => (
                      <Link key={item.id} href="/brewing?tab=inventory">
                        <Card className="bg-card/50 border-amber/20 hover:border-gold transition-colors cursor-pointer">
                          <CardHeader>
                            <CardTitle className="text-lg text-cream flex items-center justify-between">
                              {item.name}
                              <Edit2 className="h-4 w-4 text-cream/50" />
                            </CardTitle>
                            <Badge className="w-fit bg-amber/20 text-gold border-amber/40">
                              {item.category}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-cream/60">Quantity:</span>
                              <span className="text-cream font-medium">{item.quantity} {item.unit}</span>
                            </div>
                            {item.expirationDate && (
                              <div className="flex items-center justify-between">
                                <span className="text-cream/60">Expires:</span>
                                <span className="text-cream/80">{new Date(item.expirationDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes" className="mt-6">
            <Card className="bg-card border-amber/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gold">My Recipes ({recipes.length})</CardTitle>
                <Link href="/brewing?tab=builder">
                  <Button className="bg-amber hover:bg-gold text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Recipe
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-gold" />
                  </div>
                ) : recipes.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-cream/30" />
                    <p className="text-cream/70 mb-4">No recipes yet. Build and save your first recipe!</p>
                    <Link href="/brewing?tab=builder">
                      <Button className="bg-amber hover:bg-gold text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Recipe
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                      <Link key={recipe.id} href="/brewing?tab=builder">
                        <Card className="bg-card/50 border-amber/20 hover:border-gold transition-colors cursor-pointer">
                          <CardHeader>
                            <CardTitle className="text-lg text-cream flex items-center justify-between">
                              {recipe.name}
                              <Edit2 className="h-4 w-4 text-cream/50" />
                            </CardTitle>
                            {recipe.style && (
                              <p className="text-sm text-cream/60">{recipe.style}</p>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-cream/60">Batch Size:</span>
                              <span className="text-cream font-medium">
                                {recipe.batchSize ? `${recipe.batchSize} gal` : 'Not specified'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-cream/60">Created:</span>
                              <span className="text-cream/80">{new Date(recipe.createdAt).toLocaleDateString()}</span>
                            </div>
                            {recipe.isPublic && (
                              <Badge className="w-fit bg-green-500/20 text-green-500 border-green-500/40">
                                Public
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
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
