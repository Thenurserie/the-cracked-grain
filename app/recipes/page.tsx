'use client';

import { useState, useEffect } from 'react';
import { RecipeCard } from '@/components/RecipeCard';
import { Recipe, getRecipes } from '@/lib/directus';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Beaker, Filter } from 'lucide-react';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch recipes on mount
  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        const data = await getRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // Filter recipes when filters change
  useEffect(() => {
    let filtered = [...recipes];

    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(r => r.difficulty === selectedDifficulty);
    }

    setFilteredRecipes(filtered);
  }, [recipes, selectedType, selectedDifficulty]);

  // Get unique types and difficulties
  const types = ['all', ...Array.from(new Set(recipes.map(r => r.type)))];
  const difficulties = ['all', ...Array.from(new Set(recipes.map(r => r.difficulty)))];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber/10 to-background border-b border-amber/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto text-center">
            <Beaker className="h-16 w-16 text-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              Brewing Recipes
            </h1>
            <p className="text-lg md:text-xl text-cream/80">
              Explore our collection of carefully crafted brewing recipes
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-cream">
                {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-amber/20 text-cream hover:bg-amber/10 md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className={`flex flex-wrap gap-4 ${showFilters ? 'block' : 'hidden md:flex'}`}>
              <div className="w-full sm:w-auto">
                <label className="text-sm text-cream/70 mb-1 block">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-[180px] border-amber/20 bg-card text-cream">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <label className="text-sm text-cream/70 mb-1 block">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full sm:w-[180px] border-amber/20 bg-card text-cream">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>
                        {diff === 'all' ? 'All Levels' : diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(selectedType !== 'all' || selectedDifficulty !== 'all') && (
                <div className="w-full sm:w-auto flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedType('all');
                      setSelectedDifficulty('all');
                    }}
                    className="text-gold hover:text-gold/80"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Recipe Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Beaker className="h-12 w-12 mx-auto mb-4 text-gold/40 animate-pulse" />
                <p className="text-cream text-lg">Loading recipes...</p>
              </div>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Beaker className="h-16 w-16 mx-auto mb-4 text-gold/40" />
                <h3 className="text-xl font-semibold text-cream mb-2">
                  No recipes found
                </h3>
                <p className="text-cream/70">
                  Try adjusting your filters or check back later for new recipes.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
