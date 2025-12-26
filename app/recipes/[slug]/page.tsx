import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Beaker, Clock, TrendingUp, Droplet, Flame, AlertCircle, CheckCircle, Wine } from 'lucide-react';
import { getRecipeBySlug, getRecipes } from '@/lib/directus';

export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

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

  const hasFullDetails = (recipe.methods?.length ?? 0) > 0;

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
                  {recipe.bjcp_style && (
                    <>
                      <span className="text-cream/60">•</span>
                      <span className="text-cream/60 text-sm">{recipe.bjcp_style}</span>
                    </>
                  )}
                  <span className="text-cream/60">•</span>
                  <div className="flex items-center gap-2 text-cream/60">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.brew_time}</span>
                  </div>
                  <span className="text-cream/60">•</span>
                  <span className="text-cream/60">{recipe.batch_size}</span>
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
        <div className="max-w-6xl mx-auto space-y-8">

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
                  <div className="text-2xl font-bold text-cream">{recipe.og}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-cream/60 mb-1">
                    <Droplet className="h-4 w-4" />
                    <span>FG</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{recipe.fg}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-cream/60 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>ABV</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{recipe.abv}</div>
                </div>
                <div>
                  <div className="text-sm text-cream/60 mb-1">IBU</div>
                  <div className="text-2xl font-bold text-cream">{recipe.ibu}</div>
                </div>
                <div>
                  <div className="text-sm text-cream/60 mb-1">SRM</div>
                  <div className="text-2xl font-bold text-cream">{recipe.srm}</div>
                  {recipe.color && (
                    <div className="text-xs text-cream/60 mt-1">{recipe.color}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New to Brewing? Callout */}
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
            <h4 className="text-amber-500 font-medium mb-2">New to Brewing?</h4>
            <p className="text-gray-300 text-sm mb-3">
              Check out our comprehensive guides for step-by-step brewing fundamentals.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/brew-guides/getting-started" className="text-amber-400 hover:text-amber-300 text-sm underline">
                Getting Started Guide
              </Link>
              <span className="text-gray-500">•</span>
              <Link href="/brew-guides/all-grain" className="text-amber-400 hover:text-amber-300 text-sm underline">
                All-Grain Brewing 101
              </Link>
              <span className="text-gray-500">•</span>
              <Link href="/brew-guides/extract" className="text-amber-400 hover:text-amber-300 text-sm underline">
                Extract Brewing Basics
              </Link>
              <span className="text-gray-500">•</span>
              <Link href="/brew-guides/equipment" className="text-amber-400 hover:text-amber-300 text-sm underline">
                Essential Equipment
              </Link>
            </div>
          </div>

          {!hasFullDetails && (
            <Card className="bg-card border-amber/20">
              <CardContent className="py-12 text-center">
                <Beaker className="h-16 w-16 text-gold/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-cream mb-2">
                  Detailed Instructions Coming Soon
                </h3>
                <p className="text-cream/70 max-w-md mx-auto">
                  We're adding comprehensive brewing instructions for this recipe. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}

          {hasFullDetails && (
            <>
              {/* Brewing Methods */}
              {recipe.methods && recipe.methods.length > 0 && (
                <Card className="bg-card border-amber/20">
                  <CardHeader>
                    <CardTitle className="text-gold">Brewing Instructions</CardTitle>
                    <p className="text-sm text-cream/60">Choose your brewing method below</p>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all-grain" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                        {recipe.methods.map((method) => (
                          <TabsTrigger key={method.type} value={method.type} className="uppercase">
                            {method.type.toLowerCase() === 'lme' ? 'LME' :
                             method.type.toLowerCase() === 'dme' ? 'DME' :
                             method.type.toLowerCase() === 'extract' ? 'Extract' :
                             'All-Grain'}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {recipe.methods.map((method) => (
                        <TabsContent key={method.type} value={method.type} className="space-y-6 mt-6">
                          {/* Fermentables */}
                          <div>
                            <h3 className="text-lg font-semibold text-gold mb-3">Fermentables</h3>
                            <div className="space-y-2">
                              {method.fermentables.map((fermentable, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-muted/30 p-3 rounded border border-amber/10">
                                  <div>
                                    <div className="font-medium text-cream">{fermentable.name}</div>
                                    {fermentable.notes && (
                                      <div className="text-sm text-cream/60">{fermentable.notes}</div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-gold">{fermentable.amount} {fermentable.unit}</div>
                                    {fermentable.percentage && (
                                      <div className="text-sm text-cream/60">{fermentable.percentage}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Water Volumes */}
                          {method.water_volumes && (
                            <div>
                              <h3 className="text-lg font-semibold text-gold mb-3">Water Volumes</h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {method.water_volumes.strike && (
                                  <div className="bg-muted/30 p-3 rounded border border-amber/10">
                                    <div className="text-sm text-cream/60 mb-1">Strike Water</div>
                                    <div className="font-semibold text-cream">{method.water_volumes.strike}</div>
                                  </div>
                                )}
                                {method.water_volumes.sparge && (
                                  <div className="bg-muted/30 p-3 rounded border border-amber/10">
                                    <div className="text-sm text-cream/60 mb-1">Sparge Water</div>
                                    <div className="font-semibold text-cream">{method.water_volumes.sparge}</div>
                                  </div>
                                )}
                                {method.water_volumes.preboil && (
                                  <div className="bg-muted/30 p-3 rounded border border-amber/10">
                                    <div className="text-sm text-cream/60 mb-1">Pre-Boil Volume</div>
                                    <div className="font-semibold text-cream">{method.water_volumes.preboil}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Instructions */}
                          <div>
                            <h3 className="text-lg font-semibold text-gold mb-3">Step-by-Step Instructions</h3>
                            <ol className="space-y-3">
                              {method.instructions.map((instruction, idx) => (
                                <li key={idx} className="flex gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-semibold">
                                    {idx + 1}
                                  </span>
                                  <span className="text-cream/90">{instruction}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Method Notes */}
                          {method.notes && method.notes.length > 0 && (
                            <div className="bg-amber/10 border border-amber/30 rounded-lg p-4">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-amber flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-amber mb-2">Important Notes</div>
                                  <ul className="space-y-1">
                                    {method.notes.map((note, idx) => (
                                      <li key={idx} className="text-sm text-cream/80">{note}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Hops Schedule */}
              {recipe.hops && recipe.hops.length > 0 && (
                <Card className="bg-card border-amber/20">
                  <CardHeader>
                    <CardTitle className="text-gold">Hops Schedule</CardTitle>
                    <p className="text-sm text-cream/60">
                      {recipe.total_hops} | {recipe.boil_time} boil
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recipe.hops.map((hop, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-muted/30 p-3 rounded border border-amber/10">
                          <div className="flex items-center gap-4">
                            <Flame className="h-5 w-5 text-amber" />
                            <div>
                              <div className="font-medium text-cream">{hop.name}</div>
                              <div className="text-sm text-cream/60 capitalize">{hop.purpose}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gold">{hop.amount}</div>
                            <div className="text-sm text-cream/60">{hop.time}</div>
                            {hop.ibu !== undefined && hop.ibu > 0 && (
                              <div className="text-xs text-cream/60">{hop.ibu} IBU</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Yeast & Fermentation */}
              <div className="grid md:grid-cols-2 gap-6">
                {recipe.yeast && recipe.yeast.length > 0 && (
                  <Card className="bg-card border-amber/20">
                    <CardHeader>
                      <CardTitle className="text-gold">Yeast Options</CardTitle>
                      <p className="text-sm text-cream/60">Ferment at {recipe.fermentation_temp}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recipe.yeast.map((y, idx) => (
                          <div key={idx} className="bg-muted/30 p-3 rounded border border-amber/10">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium text-cream">{y.name}</div>
                              <Badge variant="outline" className="text-xs">{y.type}</Badge>
                            </div>
                            <div className="text-sm text-cream/60">{y.lab}</div>
                            {y.notes && (
                              <div className="text-sm text-cream/70 mt-2">{y.notes}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {recipe.fermentation && recipe.fermentation.length > 0 && (
                  <Card className="bg-card border-amber/20">
                    <CardHeader>
                      <CardTitle className="text-gold">Fermentation Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recipe.fermentation.map((step, idx) => (
                          <div key={idx} className="bg-muted/30 p-3 rounded border border-amber/10">
                            <div className="font-semibold text-amber mb-1">{step.step || step.day}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              {step.temp && (
                                <div>
                                  <span className="text-cream/60">Temperature: </span>
                                  <span className="text-cream">{step.temp}</span>
                                </div>
                              )}
                              {step.duration && (
                                <div>
                                  <span className="text-cream/60">Duration: </span>
                                  <span className="text-cream">{step.duration}</span>
                                </div>
                              )}
                            </div>
                            {(step.notes || step.instruction) && (
                              <div className="text-cream/70 text-sm mt-2 pt-2 border-t border-amber/10">
                                {step.notes || step.instruction}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Packaging */}
              {recipe.packaging && (
                <Card className="bg-card border-amber/20">
                  <CardHeader>
                    <CardTitle className="text-gold">Packaging</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-amber mb-3 flex items-center gap-2">
                          <Wine className="h-4 w-4" />
                          Bottling
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cream/60">Priming Sugar:</span>
                            <span className="text-cream">{recipe.packaging.bottling?.priming_sugar}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream/60">CO₂ Volumes:</span>
                            <span className="text-cream">{recipe.packaging.bottling?.co2_volumes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream/60">Bottles:</span>
                            <span className="text-cream">{recipe.packaging.bottling?.bottle_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream/60">Conditioning:</span>
                            <span className="text-cream">{recipe.packaging.bottling?.condition_time} at {recipe.packaging.bottling?.condition_temp}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber mb-3 flex items-center gap-2">
                          <Beaker className="h-4 w-4" />
                          Kegging
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cream/60">PSI:</span>
                            <span className="text-cream">{recipe.packaging.kegging?.psi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream/60">Temperature:</span>
                            <span className="text-cream">{recipe.packaging.kegging?.temp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream/60">Ready In:</span>
                            <span className="text-cream">{recipe.packaging.kegging?.ready_time}</span>
                          </div>
                          {recipe.packaging.kegging?.notes && (
                            <div className="text-cream/70 text-xs mt-2 pt-2 border-t border-amber/10">
                              {recipe.packaging.kegging.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              {recipe.tips && ((recipe.tips.dos?.length ?? 0) > 0 || (recipe.tips.donts?.length ?? 0) > 0) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {(recipe.tips.dos?.length ?? 0) > 0 && (
                    <Card className="bg-card border-amber/20">
                      <CardHeader>
                        <CardTitle className="text-gold flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Do's
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {recipe.tips.dos?.map((tip, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-cream/80">
                              <span className="text-green-500 flex-shrink-0">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                        {recipe.tips.water_chemistry && (
                          <div className="mt-4 pt-4 border-t border-amber/10 text-sm">
                            <div className="font-semibold text-amber mb-1">Water Chemistry:</div>
                            <div className="text-cream/80">{recipe.tips.water_chemistry}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {(recipe.tips.donts?.length ?? 0) > 0 && (
                    <Card className="bg-card border-amber/20">
                      <CardHeader>
                        <CardTitle className="text-gold flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Don'ts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {recipe.tips.donts?.map((tip, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-cream/80">
                              <span className="text-red-500 flex-shrink-0">✗</span>
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
                <Card className="bg-card border-amber/20">
                  <CardHeader>
                    <CardTitle className="text-gold">Food Pairing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recipe.food_pairing.map((food: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-cream border-amber/30">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Brewer's Notes */}
              {recipe.notes && (
                <Card className="bg-card border-amber/20">
                  <CardHeader>
                    <CardTitle className="text-gold flex items-center gap-2">
                      <Beaker className="h-5 w-5" />
                      Brewer's Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream/80 leading-relaxed">{recipe.notes}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link href={`/brewing?import=${slug}#recipe-builder`} className="flex-1">
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
