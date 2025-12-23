import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Gauge, Thermometer, Beaker, BookmarkPlus, ShoppingCart } from 'lucide-react';
import { getRecipeBySlug, getRecipes } from '@/lib/directus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber/10 to-background border-b border-amber/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <Link href="/recipes">
              <Button variant="ghost" className="text-cream hover:text-gold hover:bg-amber/10 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recipes
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start gap-3 mb-4">
                  <Beaker className="h-10 w-10 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-cream mb-2">
                      {recipe.name}
                    </h1>
                    <p className="text-xl text-gold">{recipe.style}</p>
                    {recipe.bjcp_style && (
                      <p className="text-sm text-cream/60 mt-1">BJCP Style: {recipe.bjcp_style}</p>
                    )}
                  </div>
                </div>

                <p className="text-lg text-cream/80 leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Stats Card */}
              <div className="lg:col-span-1">
                <Card className="bg-card/50 border-amber/20 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-amber/20">
                        <span className="text-cream/70">Difficulty</span>
                        <span className="font-semibold text-gold">{recipe.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-amber/20">
                        <span className="text-cream/70">Batch Size</span>
                        <span className="font-semibold text-cream">{recipe.batch_size}</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-amber/20">
                        <span className="text-cream/70">Brew Time</span>
                        <span className="font-semibold text-cream">{recipe.brew_time}</span>
                      </div>
                      {recipe.abv && (
                        <div className="flex items-center justify-between pb-3 border-b border-amber/20">
                          <span className="text-cream/70">ABV</span>
                          <span className="font-semibold text-gold">{recipe.abv}</span>
                        </div>
                      )}
                      {recipe.ibu && (
                        <div className="flex items-center justify-between pb-3 border-b border-amber/20">
                          <span className="text-cream/70">IBU</span>
                          <span className="font-semibold text-cream">{recipe.ibu}</span>
                        </div>
                      )}
                      {recipe.og && recipe.fg && (
                        <>
                          <div className="flex items-center justify-between pb-3 border-b border-amber/20">
                            <span className="text-cream/70">OG</span>
                            <span className="font-semibold text-cream">{recipe.og}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-cream/70">FG</span>
                            <span className="font-semibold text-cream">{recipe.fg}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-6 space-y-2">
                      <Button className="w-full bg-amber hover:bg-gold text-white">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add Ingredients to Cart
                      </Button>
                      <Button variant="outline" className="w-full border-amber/20 text-cream hover:bg-amber/10">
                        <BookmarkPlus className="h-4 w-4 mr-2" />
                        Save Recipe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue={recipe.methods?.[0]?.type || 'all-grain'} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {recipe.methods?.map((method) => (
                <TabsTrigger key={method.type} value={method.type} className="data-[state=active]:bg-amber data-[state=active]:text-white">
                  {method.type === 'all-grain' && 'All Grain'}
                  {method.type === 'lme' && 'Extract (LME)'}
                  {method.type === 'dme' && 'Extract (DME)'}
                </TabsTrigger>
              ))}
            </TabsList>

            {recipe.methods?.map((method) => (
              <TabsContent key={method.type} value={method.type} className="space-y-8">
                {/* Fermentables */}
                <Card className="bg-card border-amber/20">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-cream mb-4">Fermentables</h3>
                    <div className="space-y-2">
                      {method.fermentables.map((ferm, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-amber/10 last:border-0">
                          <span className="text-cream">{ferm.name}</span>
                          <div className="flex items-center gap-4">
                            {ferm.percentage && (
                              <span className="text-gold text-sm">{ferm.percentage}</span>
                            )}
                            <span className="text-cream/80 font-semibold">{ferm.amount} {ferm.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card className="bg-card border-amber/20">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-cream mb-4">Instructions</h3>
                    <ol className="space-y-3">
                      {method.instructions.map((instruction, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber text-white flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-cream/90 pt-0.5">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Hops Schedule */}
          {recipe.hops && recipe.hops.length > 0 && (
            <Card className="bg-card border-amber/20 mt-8">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-cream mb-4">Hop Schedule</h3>
                <div className="space-y-2">
                  {recipe.hops.map((hop, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-amber/10 last:border-0">
                      <div className="flex-1">
                        <span className="text-cream font-semibold">{hop.name}</span>
                        <span className="text-cream/60 text-sm ml-2">({hop.purpose})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-cream/80">{hop.amount}</span>
                        <span className="text-gold text-sm min-w-[100px] text-right">{hop.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Yeast */}
          {recipe.yeast && recipe.yeast.length > 0 && (
            <Card className="bg-card border-amber/20 mt-8">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-cream mb-4">Yeast Options</h3>
                <div className="space-y-3">
                  {recipe.yeast.map((yeast, idx) => (
                    <div key={idx} className="p-3 bg-background/50 rounded border border-amber/10">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-cream font-semibold">{yeast.name}</span>
                          <span className="text-gold/80 text-sm ml-2">({yeast.lab})</span>
                          {yeast.type === 'primary' && (
                            <span className="ml-2 px-2 py-0.5 bg-amber rounded text-xs text-white font-semibold">Recommended</span>
                          )}
                        </div>
                      </div>
                      {yeast.notes && (
                        <p className="text-cream/70 text-sm mt-1">{yeast.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fermentation */}
          {recipe.fermentation && recipe.fermentation.length > 0 && (
            <Card className="bg-card border-amber/20 mt-8">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-cream mb-4">Fermentation Schedule</h3>
                <div className="space-y-3">
                  {recipe.fermentation.map((step, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-background/50 rounded border border-amber/10">
                      <div className="flex-shrink-0 w-20 text-gold font-semibold text-sm">
                        {step.day}
                      </div>
                      <div className="flex-1">
                        <p className="text-cream">{step.instruction}</p>
                        {step.notes && (
                          <p className="text-cream/60 text-sm mt-1">{step.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          {recipe.tips && (recipe.tips.dos || recipe.tips.donts) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {recipe.tips.dos && recipe.tips.dos.length > 0 && (
                <Card className="bg-card border-green-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-green-500 mb-4">Do's</h3>
                    <ul className="space-y-2">
                      {recipe.tips.dos.map((tip, idx) => (
                        <li key={idx} className="flex gap-2 text-cream/90">
                          <span className="text-green-500">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {recipe.tips.donts && recipe.tips.donts.length > 0 && (
                <Card className="bg-card border-red-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-red-500 mb-4">Don'ts</h3>
                    <ul className="space-y-2">
                      {recipe.tips.donts.map((tip, idx) => (
                        <li key={idx} className="flex gap-2 text-cream/90">
                          <span className="text-red-500">✗</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Food Pairing */}
          {recipe.food_pairing && recipe.food_pairing.length > 0 && (
            <Card className="bg-card border-amber/20 mt-8">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-cream mb-4">Food Pairing</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.food_pairing.map((food, idx) => (
                    <span key={idx} className="px-3 py-1 bg-amber/20 text-gold rounded-full text-sm">
                      {food}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
