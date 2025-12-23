'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Beaker, Clock, ChevronRight } from 'lucide-react';
import { recipes, getRecipesByType, getRecipesByDifficulty } from '@/lib/data/recipes-data';

type RecipeType = 'All' | 'Beer' | 'Wine' | 'Mead' | 'Cider' | 'Kombucha';
type RecipeDifficulty = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

const TYPE_FILTERS: RecipeType[] = ['All', 'Beer', 'Wine', 'Mead', 'Cider', 'Kombucha'];
const DIFFICULTY_FILTERS: RecipeDifficulty[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function RecipesPage() {
  const [typeFilter, setTypeFilter] = useState<RecipeType>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<RecipeDifficulty>('All');

  const filteredRecipes = recipes.filter(recipe => {
    const matchesType = typeFilter === 'All' || recipe.type === typeFilter;
    const matchesDifficulty = difficultyFilter === 'All' || recipe.difficulty === difficultyFilter;
    return matchesType && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-500 border-green-500/40';
      case 'Intermediate':
        return 'bg-amber-500/20 text-amber-500 border-amber-500/40';
      case 'Advanced':
        return 'bg-red-500/20 text-red-500 border-red-500/40';
      default:
        return 'bg-cream/20 text-cream border-cream/40';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber/10 to-background border-b border-amber/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              Brewing Recipes
            </h1>
            <p className="text-lg md:text-xl text-cream/80">
              From beginner-friendly to award-winning
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Filters */}
          <Card className="bg-card border-amber/20">
            <CardHeader>
              <CardTitle className="text-gold">Filter Recipes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type Filter */}
              <div>
                <p className="text-sm font-medium text-cream/70 mb-2">Recipe Type</p>
                <div className="flex flex-wrap gap-2">
                  {TYPE_FILTERS.map((type) => (
                    <Button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      variant={typeFilter === type ? 'default' : 'outline'}
                      className={typeFilter === type ? 'bg-amber hover:bg-gold' : 'border-amber/30 text-cream hover:bg-amber/10'}
                      size="sm"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <p className="text-sm font-medium text-cream/70 mb-2">Difficulty Level</p>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTY_FILTERS.map((difficulty) => (
                    <Button
                      key={difficulty}
                      onClick={() => setDifficultyFilter(difficulty)}
                      variant={difficultyFilter === difficulty ? 'default' : 'outline'}
                      className={difficultyFilter === difficulty ? 'bg-amber hover:bg-gold' : 'border-amber/30 text-cream hover:bg-amber/10'}
                      size="sm"
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Count */}
          <div className="flex items-center justify-between">
            <p className="text-cream/70">
              Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
            <Button variant="outline" className="border-amber/30 text-cream hover:bg-amber/10">
              Submit Your Recipe
            </Button>
          </div>

          {/* Recipe Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.slug}`}>
                <Card className="bg-card border-amber/20 hover:border-gold transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Beaker className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                        {recipe.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-cream group-hover:text-gold transition-colors">
                      {recipe.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-cream/60">
                      <span className="text-gold">{recipe.type}</span>
                      <span>•</span>
                      <span>{recipe.style}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-cream/80 line-clamp-3">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-cream/60">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.brewTime}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-gold hover:text-amber hover:bg-amber/10 group-hover:bg-amber/10"
                    >
                      View Recipe
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredRecipes.length === 0 && (
            <Card className="bg-card border-amber/20">
              <CardContent className="py-12 text-center">
                <Beaker className="h-12 w-12 text-cream/40 mx-auto mb-4" />
                <p className="text-cream/70 mb-4">
                  No recipes found matching your filters
                </p>
                <Button
                  onClick={() => {
                    setTypeFilter('All');
                    setDifficultyFilter('All');
                  }}
                  variant="outline"
                  className="border-amber/30 text-cream hover:bg-amber/10"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
