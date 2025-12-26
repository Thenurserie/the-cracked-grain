'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Loader2, BookOpen, ChevronRight } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  slug: string;
  style: string;
  type: string;
  difficulty: string;
  abv: number;
  ibu: number | null;
  srm: number | null;
  batch_size: number;
  boil_time: number;
  methods?: any[];
  hops?: any[];
  yeast?: any[];
}

export default function RecipeLibrary() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    try {
      const response = await fetch('/api/recipes');
      if (!response.ok) throw new Error('Failed to fetch recipes');

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }

  function loadRecipe(slug: string) {
    // Navigate to recipe builder with import parameter
    router.push(`/brewing?import=${slug}#recipe-builder`);
  }

  function getDifficultyColor(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-amber/20 text-gold border-amber/30';
    }
  }

  function getTypeColor(type: string): string {
    switch (type?.toLowerCase()) {
      case 'beer':
        return 'bg-amber/20 text-gold border-amber/30';
      case 'wine':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'mead':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cider':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-cream/20 text-cream border-cream/30';
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => fetchRecipes()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" />
            Recipe Library
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Browse our collection of brewing recipes and load them directly into the recipe builder
          </p>
        </CardHeader>
        <CardContent>
          {/* The Cracked Grain Recipes Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-amber/20"></span>
              <span>The Cracked Grain Recipes</span>
              <span className="h-px flex-1 bg-amber/20"></span>
            </h3>

            {recipes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No recipes found. Check back soon!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="border-amber/20 hover:border-gold/40 transition-colors group"
                  >
                    <CardContent className="p-4">
                      {/* Recipe Header */}
                      <div className="mb-3">
                        <h4 className="font-bold text-cream mb-1 group-hover:text-gold transition-colors">
                          {recipe.name}
                        </h4>
                        <p className="text-sm text-cream/70">{recipe.style}</p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(recipe.type)} variant="outline">
                          {recipe.type}
                        </Badge>
                        <Badge className={getDifficultyColor(recipe.difficulty)} variant="outline">
                          ⭐ {recipe.difficulty}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-3 text-xs text-cream/60 mb-4">
                        <span>{recipe.abv}% ABV</span>
                        {recipe.ibu && <span>• {recipe.ibu} IBU</span>}
                        {recipe.srm && <span>• {recipe.srm} SRM</span>}
                      </div>

                      {/* Load Button */}
                      <Button
                        onClick={() => loadRecipe(recipe.slug)}
                        className="w-full bg-amber hover:bg-gold text-white"
                        size="sm"
                      >
                        Load Recipe
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Future: My Saved Recipes Section */}
          <div className="border-t border-amber/20 pt-6">
            <h3 className="text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-amber/20"></span>
              <span>My Saved Recipes</span>
              <span className="h-px flex-1 bg-amber/20"></span>
            </h3>
            <div className="text-center py-8 bg-muted/30 rounded-lg border border-amber/10">
              <p className="text-muted-foreground mb-2">
                Save custom recipes to your account
              </p>
              <p className="text-sm text-cream/50">
                Create a recipe in the Recipe Builder and click "Save" to store it here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
