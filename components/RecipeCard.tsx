'use client';

import Link from 'next/link';
import { Clock, Gauge, Beaker } from 'lucide-react';
import { Recipe } from '@/lib/directus';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  // Map difficulty to color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-600';
      case 'Intermediate':
        return 'bg-yellow-600';
      case 'Advanced':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <div className="group bg-card border border-amber/20 rounded-lg overflow-hidden hover:border-gold transition-all duration-300 hover:shadow-lg hover:shadow-amber/10 h-full flex flex-col">
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-amber/20 to-amber/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <Beaker className="h-24 w-24 text-gold/30 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            {recipe.featured && (
              <div className="bg-amber px-2 py-1 rounded text-xs font-bold text-white shadow-lg">
                Featured
              </div>
            )}
            <div className={`${getDifficultyColor(recipe.difficulty)} px-2 py-1 rounded text-xs font-bold text-white shadow-lg`}>
              {recipe.difficulty}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="font-semibold text-cream group-hover:text-gold transition-colors line-clamp-2 text-lg mb-1">
              {recipe.name}
            </h3>

            <p className="text-xs text-gold/80 mb-2">
              {recipe.style}
            </p>

            <p className="text-sm text-cream/70 line-clamp-3">
              {recipe.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber/20">
            <div className="flex items-center gap-1.5 text-xs text-cream/70">
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>{recipe.brew_time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cream/70">
              <Gauge className="h-3.5 w-3.5 text-gold" />
              <span>{recipe.abv || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-semibold text-gold">
              {recipe.type}
            </span>
            <span className="text-xs text-cream/60">
              {recipe.batch_size}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
