import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Beaker, Clock, TrendingUp, Droplet } from 'lucide-react';
import { getRecipeBySlug, recipes } from '@/lib/data/recipes-data';

export function generateStaticParams() {
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export default function RecipeDetailPage({ params }: { params: { slug: string } }) {
  const recipe = getRecipeBySlug(params.slug);

  if (!recipe) {
    notFound();
  }

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
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Link href="/recipes">
              <Button variant="ghost" className="text-cream hover:text-gold hover:bg-amber/10 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recipes
              </Button>
            </Link>

            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
                  {recipe.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                  <span className="text-gold">{recipe.style}</span>
                  <span className="text-cream/60">•</span>
                  <div className="flex items-center gap-2 text-cream/60">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.brewTime}</span>
                  </div>
                </div>
              </div>
              <Beaker className="h-12 w-12 text-gold flex-shrink-0" />
            </div>

            <p className="text-lg text-cream/80 leading-relaxed">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Vital Statistics */}
          <Card className="bg-card border-amber/20">
            <CardHeader>
              <CardTitle className="text-gold">Vital Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-sm text-cream/60 mb-1">
                    <Droplet className="h-4 w-4" />
                    <span>OG</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{recipe.stats.og}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-cream/60 mb-1">
                    <Droplet className="h-4 w-4" />
                    <span>FG</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{recipe.stats.fg}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-cream/60 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>ABV</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{recipe.stats.abv}</div>
                </div>
                <div>
                  <div className="text-sm text-cream/60 mb-1">IBU</div>
                  <div className="text-2xl font-bold text-cream">{recipe.stats.ibu}</div>
                </div>
                <div>
                  <div className="text-sm text-cream/60 mb-1">SRM</div>
                  <div className="text-2xl font-bold text-cream">{recipe.stats.srm}</div>
                  {recipe.stats.color && (
                    <div className="text-xs text-cream/60 mt-1">{recipe.stats.color}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Instructions Coming Soon */}
          <Card className="bg-card border-amber/20">
            <CardHeader>
              <CardTitle className="text-gold">Full Recipe Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Beaker className="h-16 w-16 text-gold/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-cream mb-2">
                  Detailed Instructions Coming Soon
                </h3>
                <p className="text-cream/70 max-w-md mx-auto">
                  We're adding comprehensive brewing instructions, ingredient lists, and step-by-step guides for all our recipes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/brewing" className="flex-1">
              <Button className="w-full bg-amber hover:bg-gold">
                <Beaker className="h-5 w-5 mr-2" />
                Use Brewing Tools
              </Button>
            </Link>
            <Link href="/shop?category=Grains" className="flex-1">
              <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
                Shop Ingredients
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
