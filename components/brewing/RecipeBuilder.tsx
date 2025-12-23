'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseStub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Download, Save, ShoppingCart, Loader2, AlertCircle, CheckCircle2, LogIn, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '@/lib/cartClient';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  calculateOG,
  calculateFG,
  calculateABV,
  calculateIBU,
  calculateSRM,
  exportBeerXML,
  GRAIN_DATABASE,
  HOP_DATABASE,
  YEAST_DATABASE,
  type Fermentable,
  type Hop,
  type Yeast
} from '@/lib/brewing-calcs';
import { findMatchingStyle } from '@/lib/bjcp-styles';
import { findMatchingProduct, type ProductMatch, type ShoppingListItem } from '@/lib/productMatcher';
import ShoppingListModal from './ShoppingListModal';

type BrewMethod = 'all-grain' | 'extract-lme' | 'extract-dme' | 'partial-mash';

interface SavedRecipe {
  id: string;
  name: string;
  style: string | null;
  batchSize: number | null;
  recipeData: any;
  notes: string | null;
  isPublic: boolean;
  createdAt: string;
}

export default function RecipeBuilder() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [recipeName, setRecipeName] = useState('');
  const [style, setStyle] = useState('');
  const [batchSize, setBatchSize] = useState(5.0);
  const [boilTime, setBoilTime] = useState(60);
  const [efficiency, setEfficiency] = useState(75);
  const [brewMethod, setBrewMethod] = useState<BrewMethod>('all-grain');
  const [fermentables, setFermentables] = useState<Fermentable[]>([]);
  const [hops, setHops] = useState<Hop[]>([]);
  const [yeast, setYeast] = useState<Yeast | null>(null);
  const [notes, setNotes] = useState('');

  // Pricing state
  const [fermentableCosts, setFermentableCosts] = useState<{ [key: string]: number }>({});
  const [fermentableMatches, setFermentableMatches] = useState<{ [key: string]: ProductMatch }>({});
  const [fermentableLoadingPrices, setFermentableLoadingPrices] = useState<{ [key: string]: boolean }>({});
  const [hopCosts, setHopCosts] = useState<{ [key: string]: number }>({});
  const [hopMatches, setHopMatches] = useState<{ [key: string]: ProductMatch }>({});
  const [hopLoadingPrices, setHopLoadingPrices] = useState<{ [key: string]: boolean }>({});
  const [yeastCost, setYeastCost] = useState<number>(0);
  const [yeastMatch, setYeastMatch] = useState<ProductMatch | null>(null);
  const [yeastLoadingPrice, setYeastLoadingPrice] = useState<boolean>(false);

  const [og, setOg] = useState(1.050);
  const [fg, setFg] = useState(1.010);
  const [abv, setAbv] = useState(0);
  const [ibu, setIbu] = useState(0);
  const [srm, setSrm] = useState(0);

  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentRecipeId, setCurrentRecipeId] = useState<string | null>(null);
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [matchingStyles, setMatchingStyles] = useState<any[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Load saved recipes when logged in
  useEffect(() => {
    if (authLoading) return;
    if (isLoggedIn) {
      loadSavedRecipes();
    }
  }, [isLoggedIn, authLoading]);

  useEffect(() => {
    if (fermentables.length > 0) {
      const calculatedOG = calculateOG(fermentables, batchSize, efficiency);
      setOg(calculatedOG);

      const attenuation = yeast?.attenuation || 75;
      const calculatedFG = calculateFG(calculatedOG, attenuation);
      setFg(calculatedFG);

      const calculatedABV = calculateABV(calculatedOG, calculatedFG);
      setAbv(calculatedABV);

      const calculatedIBU = calculateIBU(hops, batchSize, calculatedOG);
      setIbu(calculatedIBU);

      const calculatedSRM = calculateSRM(fermentables, batchSize);
      setSrm(calculatedSRM);
    }
  }, [fermentables, hops, yeast, batchSize, efficiency]);

  // Fetch fermentable prices when fermentables change
  useEffect(() => {
    fermentables.forEach(f => {
      if (!fermentableMatches[f.name] && !fermentableLoadingPrices[f.name]) {
        fetchFermentablePrice(f.name);
      }
    });
  }, [fermentables.map(f => f.name).join(',')]);

  // Fetch hop prices when hops change
  useEffect(() => {
    hops.forEach(hop => {
      if (!hopMatches[hop.name] && !hopLoadingPrices[hop.name]) {
        fetchHopPrice(hop.name);
      }
    });
  }, [hops.map(h => h.name).join(',')]);

  // Fetch yeast price when yeast changes
  useEffect(() => {
    if (yeast && !yeastMatch && !yeastLoadingPrice) {
      fetchYeastPrice(yeast.name);
    }
  }, [yeast?.name]);

  const loadSavedRecipes = async () => {
    if (!isLoggedIn) return;

    setIsLoadingRecipes(true);
    setError('');

    try {
      const response = await fetch('/api/user/recipes');
      const data = await response.json();

      if (data.success && data.recipes) {
        setSavedRecipes(data.recipes);
      } else {
        throw new Error(data.error || 'Failed to load recipes');
      }
    } catch (error: any) {
      console.error('Failed to load recipes:', error);
      setError('Failed to load saved recipes');
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const loadRecipeIntoBuilder = (recipe: SavedRecipe) => {
    const data = recipe.recipeData;

    setRecipeName(recipe.name);
    setStyle(recipe.style || '');
    setBatchSize(recipe.batchSize || 5.0);
    setBoilTime(data.boilTime || 60);
    setEfficiency(data.efficiency || 75);
    setBrewMethod(data.brewMethod || 'all-grain');
    setFermentables(data.fermentables || []);
    setHops(data.hops || []);
    setYeast(data.yeast || null);
    setNotes(recipe.notes || '');
    setCurrentRecipeId(recipe.id);

    toast.success(`Loaded "${recipe.name}"`);
    setShowSavedRecipes(false);
  };

  const clearRecipe = () => {
    setRecipeName('');
    setStyle('');
    setBatchSize(5.0);
    setBoilTime(60);
    setEfficiency(75);
    setBrewMethod('all-grain');
    setFermentables([]);
    setHops([]);
    setYeast(null);
    setNotes('');
    setCurrentRecipeId(null);
    toast.info('Recipe cleared');
  };

  const addFermentable = () => {
    const defaultGrain = GRAIN_DATABASE[0];
    setFermentables([
      ...fermentables,
      {
        name: defaultGrain.name,
        weight: 1,
        lovibond: defaultGrain.lovibond,
        ppg: defaultGrain.ppg,
        type: defaultGrain.type
      }
    ]);
  };

  const updateFermentable = (index: number, field: string, value: any) => {
    const updated = [...fermentables];
    if (field === 'name') {
      const grain = GRAIN_DATABASE.find(g => g.name === value);
      if (grain) {
        updated[index] = {
          ...updated[index],
          name: value,
          lovibond: grain.lovibond,
          ppg: grain.ppg,
          type: grain.type
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
    }
    setFermentables(updated);
  };

  const removeFermentable = (index: number) => {
    setFermentables(fermentables.filter((_, i) => i !== index));
  };

  // Fetch price for a fermentable
  const fetchFermentablePrice = async (name: string) => {
    setFermentableLoadingPrices(prev => ({ ...prev, [name]: true }));

    try {
      const match = await findMatchingProduct(name, 'Grains');
      setFermentableMatches(prev => ({ ...prev, [name]: match }));

      // Auto-set cost if we found a match and user hasn't manually set it
      if (match.price) {
        setFermentableCosts(prev => {
          if (!prev[name]) {
            return { ...prev, [name]: match.price };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error fetching fermentable price:', error);
    } finally {
      setFermentableLoadingPrices(prev => ({ ...prev, [name]: false }));
    }
  };

  const addHop = () => {
    const defaultHop = HOP_DATABASE[0];
    setHops([
      ...hops,
      {
        name: defaultHop.name,
        weight: 1,
        alpha: defaultHop.alpha,
        time: 60,
        use: 'Boil'
      }
    ]);
  };

  const updateHop = (index: number, field: string, value: any) => {
    const updated = [...hops];
    if (field === 'name') {
      const hop = HOP_DATABASE.find(h => h.name === value);
      if (hop) {
        updated[index] = {
          ...updated[index],
          name: value,
          alpha: hop.alpha
        };
      }
    } else if (field === 'use') {
      updated[index] = { ...updated[index], [field]: value };
    } else {
      updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
    }
    setHops(updated);
  };

  const removeHop = (index: number) => {
    setHops(hops.filter((_, i) => i !== index));
  };

  // Fetch price for a hop
  const fetchHopPrice = async (name: string) => {
    setHopLoadingPrices(prev => ({ ...prev, [name]: true }));

    try {
      const match = await findMatchingProduct(name, 'Hops');
      setHopMatches(prev => ({ ...prev, [name]: match }));

      // Auto-set cost if we found a match and user hasn't manually set it
      if (match.price) {
        setHopCosts(prev => {
          if (!prev[name]) {
            return { ...prev, [name]: match.price };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error fetching hop price:', error);
    } finally {
      setHopLoadingPrices(prev => ({ ...prev, [name]: false }));
    }
  };

  // Fetch price for yeast
  const fetchYeastPrice = async (name: string) => {
    setYeastLoadingPrice(true);

    try {
      const match = await findMatchingProduct(name, 'Yeast');
      setYeastMatch(match);

      // Auto-set cost if we found a match and user hasn't manually set it
      if (match.price && yeastCost === 0) {
        setYeastCost(match.price);
      }
    } catch (error) {
      console.error('Error fetching yeast price:', error);
    } finally {
      setYeastLoadingPrice(false);
    }
  };

  const saveRecipe = async () => {
    if (!recipeName) {
      toast.error('Please enter a recipe name');
      return;
    }

    if (!isLoggedIn) {
      toast.error('Please sign in to save recipes');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const recipeData = {
        boilTime,
        efficiency,
        brewMethod,
        fermentables,
        hops,
        yeast,
        og,
        fg,
        abv,
        ibu,
        srm
      };

      const url = currentRecipeId
        ? `/api/user/recipes/${currentRecipeId}`
        : '/api/user/recipes';
      const method = currentRecipeId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recipeName,
          style: style || null,
          batchSize,
          recipeData,
          notes: notes || null,
          isPublic: false,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save recipe');
      }

      setCurrentRecipeId(data.recipe.id);
      await loadSavedRecipes();
      toast.success(currentRecipeId ? 'Recipe updated!' : 'Recipe saved!');
    } catch (error: any) {
      console.error('Save recipe error:', error);
      setError(error.message || 'Failed to save recipe');
      toast.error(error.message || 'Failed to save recipe');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadBeerXML = () => {
    const recipe = {
      name: recipeName,
      style,
      batchSize,
      boilTime,
      efficiency,
      fermentables,
      hops,
      yeast,
      og,
      fg,
      abv,
      ibu,
      srm,
      notes
    };

    const xml = exportBeerXML(recipe);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipeName || 'recipe'}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('BeerXML exported!');
  };

  const generateShoppingListItems = (): ShoppingListItem[] => {
    const items: ShoppingListItem[] = [];

    // Add fermentables
    fermentables.forEach(f => {
      items.push({
        name: f.name,
        quantity: f.weight,
        unit: 'lb',
        category: 'Grains',
        price: fermentableCosts[f.name] ? fermentableCosts[f.name] * f.weight : undefined,
        productId: fermentableMatches[f.name]?.product?.id
      });
    });

    // Add hops
    hops.forEach(h => {
      items.push({
        name: h.name,
        quantity: h.weight,
        unit: 'oz',
        category: 'Hops',
        price: hopCosts[h.name] ? hopCosts[h.name] * h.weight : undefined,
        productId: hopMatches[h.name]?.product?.id
      });
    });

    // Add yeast
    if (yeast) {
      items.push({
        name: yeast.name,
        quantity: 1,
        unit: 'pkg',
        category: 'Yeast',
        price: yeastCost || undefined,
        productId: yeastMatch?.product?.id
      });
    }

    return items;
  };

  const getTotalCost = (): number => {
    const fermentableCost = fermentables.reduce((sum, f) => sum + (f.weight * (fermentableCosts[f.name] || 0)), 0);
    const hopCost = hops.reduce((sum, h) => sum + (h.weight * (hopCosts[h.name] || 0)), 0);
    return fermentableCost + hopCost + yeastCost;
  };

  const addIngredientsToCart = async () => {
    if (fermentables.length === 0 && hops.length === 0 && !yeast) {
      toast.error('No ingredients to add to cart');
      return;
    }

    let addedCount = 0;
    let notFoundCount = 0;

    for (const fermentable of fermentables) {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .ilike('name', `%${fermentable.name}%`)
        .maybeSingle();

      if (products) {
        await addToCart(products.id, Math.ceil(fermentable.weight));
        addedCount++;
      } else {
        notFoundCount++;
      }
    }

    for (const hop of hops) {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .ilike('name', `%${hop.name}%`)
        .maybeSingle();

      if (products) {
        await addToCart(products.id, Math.ceil(hop.weight));
        addedCount++;
      } else {
        notFoundCount++;
      }
    }

    if (yeast) {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .ilike('name', `%${yeast.name}%`)
        .maybeSingle();

      if (products) {
        await addToCart(products.id, 1);
        addedCount++;
      } else {
        notFoundCount++;
      }
    }

    if (addedCount > 0) {
      toast.success(`Added ${addedCount} item(s) to cart`);
    }
    if (notFoundCount > 0) {
      toast.warning(`${notFoundCount} ingredient(s) not found in shop`);
    }
  };

  const convertToExtract = (): { fermentables: Fermentable[], notes: string } => {
    const extractFermentables: Fermentable[] = [];
    const steepGrains: Fermentable[] = [];
    let convertedNotes = `Converted to ${brewMethod === 'extract-lme' ? 'LME' : 'DME'} recipe:\n\n`;

    fermentables.forEach(grain => {
      const isBaseMalt = grain.type === 'Base Malt';

      if (isBaseMalt) {
        const extractName = brewMethod === 'extract-lme'
          ? 'Light Liquid Malt Extract'
          : 'Light Dry Malt Extract';
        const conversionFactor = brewMethod === 'extract-lme' ? 0.6 : 0.75;
        const extractWeight = grain.weight * conversionFactor;
        const extractPPG = brewMethod === 'extract-lme' ? 36 : 44;

        extractFermentables.push({
          name: extractName,
          weight: Math.round(extractWeight * 100) / 100,
          lovibond: 2,
          ppg: extractPPG,
          type: 'Extract'
        });

        convertedNotes += `- ${grain.name} (${grain.weight} lbs) → ${extractName} (${extractWeight.toFixed(2)} lbs)\n`;
      } else {
        steepGrains.push(grain);
        convertedNotes += `- ${grain.name} (${grain.weight} lbs) - steep at 150-160°F for 20-30 min\n`;
      }
    });

    return {
      fermentables: [...extractFermentables, ...steepGrains],
      notes: convertedNotes + '\n' + notes
    };
  };

  const buildKit = async () => {
    if (!recipeName) {
      toast.error('Please enter a recipe name first');
      return;
    }

    let kitFermentables = fermentables;
    let kitNotes = notes;

    if (brewMethod !== 'all-grain') {
      const converted = convertToExtract();
      kitFermentables = converted.fermentables;
      kitNotes = converted.notes;
    }

    let addedCount = 0;
    let notFoundCount = 0;

    for (const fermentable of kitFermentables) {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .ilike('name', `%${fermentable.name}%`)
        .maybeSingle();

      if (products) {
        await addToCart(products.id, Math.ceil(fermentable.weight));
        addedCount++;
      } else {
        notFoundCount++;
      }
    }

    for (const hop of hops) {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .ilike('name', `%${hop.name}%`)
        .maybeSingle();

      if (products) {
        await addToCart(products.id, Math.ceil(hop.weight));
        addedCount++;
      } else {
        notFoundCount++;
      }
    }

    if (yeast) {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .ilike('name', `%${yeast.name}%`)
        .maybeSingle();

      if (products) {
        await addToCart(products.id, 1);
        addedCount++;
      } else {
        notFoundCount++;
      }
    }

    if (addedCount > 0) {
      toast.success(`${brewMethod === 'all-grain' ? 'All-Grain' : 'Extract'} kit added to cart (${addedCount} items)`);
    }
    if (notFoundCount > 0) {
      toast.warning(`${notFoundCount} ingredient(s) not found in shop`);
    }
  };

  const matchingStyles = findMatchingStyle(og, fg, abv, ibu, srm);

  return (
    <div className="space-y-6">
      {/* Guest Sign-in Banner */}
      {!isLoggedIn && !authLoading && (
        <Card className="bg-gradient-to-r from-amber/20 to-gold/20 border-amber/40">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <LogIn className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm font-medium text-cream">Sign in to save your recipes</p>
                <p className="text-xs text-cream/70">Currently building as guest - can't save recipes</p>
              </div>
            </div>
            <Link href="/login">
              <Button className="bg-amber hover:bg-gold text-white">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/50">
          <CardContent className="flex items-center gap-2 py-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Saved Recipes Section */}
      {isLoggedIn && (
        <Card className="bg-card border-amber/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gold" />
                <CardTitle className="text-gold">My Saved Recipes ({savedRecipes.length})</CardTitle>
              </div>
              <div className="flex gap-2">
                {currentRecipeId && (
                  <Button onClick={clearRecipe} variant="outline" size="sm">
                    New Recipe
                  </Button>
                )}
                <Button
                  onClick={() => setShowSavedRecipes(!showSavedRecipes)}
                  variant="outline"
                  size="sm"
                >
                  {showSavedRecipes ? 'Hide' : 'Show'} Recipes
                </Button>
              </div>
            </div>
          </CardHeader>
          {showSavedRecipes && (
            <CardContent>
              {isLoadingRecipes ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
              ) : savedRecipes.length === 0 ? (
                <p className="text-cream/60 text-center py-4">No saved recipes yet. Create and save your first recipe!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {savedRecipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className={`bg-card/50 border-amber/20 hover:border-gold transition-colors cursor-pointer ${
                        currentRecipeId === recipe.id ? 'ring-2 ring-gold' : ''
                      }`}
                      onClick={() => loadRecipeIntoBuilder(recipe)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-cream mb-1">{recipe.name}</h4>
                        {recipe.style && (
                          <p className="text-xs text-cream/60 mb-2">{recipe.style}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-cream/50">
                          <span>{recipe.batchSize ? `${recipe.batchSize} gal` : 'No size'}</span>
                          <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recipe Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipeName">Recipe Name</Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Enter recipe name"
              />
            </div>
            <div>
              <Label htmlFor="style">Style</Label>
              <Input
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g., American IPA"
              />
            </div>
            <div>
              <Label htmlFor="brewMethod">Brew Method</Label>
              <Select
                value={brewMethod}
                onValueChange={(value) => setBrewMethod(value as BrewMethod)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-grain">All Grain</SelectItem>
                  <SelectItem value="extract-lme">Extract (LME)</SelectItem>
                  <SelectItem value="extract-dme">Extract (DME)</SelectItem>
                  <SelectItem value="partial-mash">Partial Mash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="batchSize">Batch Size (gal)</Label>
              <Input
                id="batchSize"
                type="number"
                step="0.1"
                value={batchSize}
                onChange={(e) => setBatchSize(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="boilTime">Boil Time (min)</Label>
              <Input
                id="boilTime"
                type="number"
                value={boilTime}
                onChange={(e) => setBoilTime(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="efficiency">Efficiency (%)</Label>
              <Input
                id="efficiency"
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fermentables</CardTitle>
          <Button onClick={addFermentable} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Grain
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {fermentables.length > 0 && (
            <div className="grid grid-cols-12 gap-2 items-center text-xs text-muted-foreground font-semibold mb-2">
              <div className="col-span-3">Fermentable</div>
              <div className="col-span-2">lbs</div>
              <div className="col-span-1">°L</div>
              <div className="col-span-2">$/lb</div>
              <div className="col-span-2 text-right">Cost</div>
              <div className="col-span-2"></div>
            </div>
          )}
          {fermentables.map((fermentable, index) => {
            const match = fermentableMatches[fermentable.name];
            const isLoading = fermentableLoadingPrices[fermentable.name];
            const pricePerLb = fermentableCosts[fermentable.name] || 0;
            const lineCost = fermentable.weight * pricePerLb;

            return (
              <div key={index} className="grid grid-cols-12 gap-2 items-center border-b border-border pb-2">
                <div className="col-span-3">
                  <Select
                    value={fermentable.name}
                    onValueChange={(value) => updateFermentable(index, 'name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GRAIN_DATABASE.map((grain) => (
                        <SelectItem key={grain.name} value={grain.name}>
                          {grain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={fermentable.weight}
                    onChange={(e) => updateFermentable(index, 'weight', e.target.value)}
                    placeholder="lbs"
                  />
                </div>
                <div className="col-span-1 text-sm text-muted-foreground text-center">
                  {fermentable.lovibond}L
                </div>
                <div className="col-span-2 relative">
                  <Input
                    type="number"
                    step="0.01"
                    value={fermentableCosts[fermentable.name] || ''}
                    placeholder={match?.price ? `$${match.price.toFixed(2)}` : '$/lb'}
                    onChange={(e) => setFermentableCosts({ ...fermentableCosts, [fermentable.name]: parseFloat(e.target.value) || 0 })}
                    className={`pr-8 ${match?.confidence === 'exact' || match?.confidence === 'high' ? 'border-green-500/30' : ''}`}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
                    ) : match?.confidence === 'exact' || match?.confidence === 'high' ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" title="Auto-matched from shop" />
                    ) : match?.confidence === 'medium' ? (
                      <AlertCircle className="h-3 w-3 text-yellow-500" title="Possible match" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-muted-foreground/50" title="Not found in shop" />
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-right text-sm font-semibold">
                  {pricePerLb > 0 ? `$${lineCost.toFixed(2)}` : '—'}
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFermentable(index)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {fermentables.length > 0 && (
            <div className="grid grid-cols-12 gap-2 items-center border-t-2 border-gold/30 pt-3 mt-2">
              <div className="col-span-3 text-sm font-bold text-gold">
                Fermentables Total
              </div>
              <div className="col-span-2 text-sm font-bold">
                {fermentables.reduce((sum, f) => sum + f.weight, 0).toFixed(1)} lbs
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-2"></div>
              <div className="col-span-2 text-right text-lg font-bold text-gold">
                ${fermentables.reduce((sum, f) => sum + (f.weight * (fermentableCosts[f.name] || 0)), 0).toFixed(2)}
              </div>
              <div className="col-span-2"></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hops Schedule</CardTitle>
          <Button onClick={addHop} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Hop
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {hops.length > 0 && (
            <div className="grid grid-cols-12 gap-2 items-center text-xs text-muted-foreground font-semibold mb-2">
              <div className="col-span-3">Hop Variety</div>
              <div className="col-span-1">oz</div>
              <div className="col-span-1">min</div>
              <div className="col-span-2">Use</div>
              <div className="col-span-2">$/oz</div>
              <div className="col-span-2 text-right">Cost</div>
              <div className="col-span-1"></div>
            </div>
          )}
          {hops.map((hop, index) => {
            const match = hopMatches[hop.name];
            const isLoading = hopLoadingPrices[hop.name];
            const pricePerOz = hopCosts[hop.name] || 0;
            const lineCost = hop.weight * pricePerOz;

            return (
              <div key={index} className="grid grid-cols-12 gap-2 items-center border-b border-border pb-2">
                <div className="col-span-3">
                  <Select
                    value={hop.name}
                    onValueChange={(value) => updateHop(index, 'name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOP_DATABASE.map((h) => (
                        <SelectItem key={h.name} value={h.name}>
                          {h.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    step="0.1"
                    value={hop.weight}
                    onChange={(e) => updateHop(index, 'weight', e.target.value)}
                    placeholder="oz"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={hop.time}
                    onChange={(e) => updateHop(index, 'time', e.target.value)}
                    placeholder="min"
                  />
                </div>
                <div className="col-span-2">
                  <Select
                    value={hop.use}
                    onValueChange={(value) => updateHop(index, 'use', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boil">Boil</SelectItem>
                      <SelectItem value="Dry Hop">Dry Hop</SelectItem>
                      <SelectItem value="Whirlpool">Whirlpool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 relative">
                  <Input
                    type="number"
                    step="0.01"
                    value={hopCosts[hop.name] || ''}
                    placeholder={match?.price ? `$${match.price.toFixed(2)}` : '$/oz'}
                    onChange={(e) => setHopCosts({ ...hopCosts, [hop.name]: parseFloat(e.target.value) || 0 })}
                    className={`pr-8 ${match?.confidence === 'exact' || match?.confidence === 'high' ? 'border-green-500/30' : ''}`}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
                    ) : match?.confidence === 'exact' || match?.confidence === 'high' ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" title="Auto-matched from shop" />
                    ) : match?.confidence === 'medium' ? (
                      <AlertCircle className="h-3 w-3 text-yellow-500" title="Possible match" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-muted-foreground/50" title="Not found in shop" />
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-right text-sm font-semibold">
                  {pricePerOz > 0 ? `$${lineCost.toFixed(2)}` : '—'}
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHop(index)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {hops.length > 0 && (
            <div className="grid grid-cols-12 gap-2 items-center border-t-2 border-gold/30 pt-3 mt-2">
              <div className="col-span-3 text-sm font-bold text-gold">
                Hops Total
              </div>
              <div className="col-span-1 text-sm font-bold">
                {hops.reduce((sum, h) => sum + h.weight, 0).toFixed(1)} oz
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-2"></div>
              <div className="col-span-2 text-right text-lg font-bold text-gold">
                ${hops.reduce((sum, h) => sum + (h.weight * (hopCosts[h.name] || 0)), 0).toFixed(2)}
              </div>
              <div className="col-span-1"></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yeast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="yeast-select">Yeast Strain</Label>
            <Select
              value={yeast?.name || ''}
              onValueChange={(value) => {
                const selectedYeast = YEAST_DATABASE.find(y => y.name === value);
                if (selectedYeast) setYeast(selectedYeast as Yeast);
              }}
            >
              <SelectTrigger id="yeast-select">
                <SelectValue placeholder="Select yeast" />
              </SelectTrigger>
              <SelectContent>
                {YEAST_DATABASE.map((y) => (
                  <SelectItem key={y.name} value={y.name}>
                    {y.lab} {y.name} ({y.attenuation}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {yeast && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-md border border-border">
              <div>
                <Label htmlFor="yeast-price" className="text-xs text-muted-foreground">Price per packet</Label>
                <div className="relative mt-1">
                  <Input
                    id="yeast-price"
                    type="number"
                    step="0.01"
                    value={yeastCost || ''}
                    placeholder={yeastMatch?.price ? `$${yeastMatch.price.toFixed(2)}` : '$/pkg'}
                    onChange={(e) => setYeastCost(parseFloat(e.target.value) || 0)}
                    className={`pr-8 ${yeastMatch?.confidence === 'exact' || yeastMatch?.confidence === 'high' ? 'border-green-500/30' : ''}`}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {yeastLoadingPrice ? (
                      <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
                    ) : yeastMatch?.confidence === 'exact' || yeastMatch?.confidence === 'high' ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" title="Auto-matched from shop" />
                    ) : yeastMatch?.confidence === 'medium' ? (
                      <AlertCircle className="h-3 w-3 text-yellow-500" title="Possible match" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-muted-foreground/50" title="Not found in shop" />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Yeast Cost</div>
                <div className="text-2xl font-bold text-gold mt-1">
                  {yeastCost > 0 ? `$${yeastCost.toFixed(2)}` : '—'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calculated Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">OG</div>
              <div className="text-2xl font-bold">{og.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">FG</div>
              <div className="text-2xl font-bold">{fg.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">ABV</div>
              <div className="text-2xl font-bold">{abv.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">IBU</div>
              <div className="text-2xl font-bold">{ibu.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">SRM</div>
              <div className="text-2xl font-bold">{srm.toFixed(1)}</div>
            </div>
          </div>

          {matchingStyles.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="font-semibold mb-2">Matching BJCP Styles:</div>
              <div className="space-y-1">
                {matchingStyles.map((s) => (
                  <div key={s.name} className="text-sm">
                    {s.category}{s.subcategory}. {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-amber/5">
        <CardHeader>
          <CardTitle className="text-gold">Recipe Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Fermentables</span>
                <span className="font-semibold">
                  ${fermentables.reduce((sum, f) => sum + (f.weight * (fermentableCosts[f.name] || 0)), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Hops</span>
                <span className="font-semibold">
                  ${hops.reduce((sum, h) => sum + (h.weight * (hopCosts[h.name] || 0)), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Yeast</span>
                <span className="font-semibold">${yeastCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-gold/30 mt-2">
                <span className="font-bold text-gold">Total Ingredients</span>
                <span className="text-2xl font-bold text-gold">
                  ${(
                    fermentables.reduce((sum, f) => sum + (f.weight * (fermentableCosts[f.name] || 0)), 0) +
                    hops.reduce((sum, h) => sum + (h.weight * (hopCosts[h.name] || 0)), 0) +
                    yeastCost
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Cost per 12oz Bottle</div>
                <div className="text-3xl font-bold text-gold">
                  ${batchSize > 0 ? (
                    (fermentables.reduce((sum, f) => sum + (f.weight * (fermentableCosts[f.name] || 0)), 0) +
                     hops.reduce((sum, h) => sum + (h.weight * (hopCosts[h.name] || 0)), 0) +
                     yeastCost) / (batchSize * 128 / 12)
                  ).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  (~{batchSize > 0 ? Math.floor(batchSize * 128 / 12) : 0} bottles per batch)
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Cost per Pint (16oz)</div>
                <div className="text-3xl font-bold text-gold">
                  ${batchSize > 0 ? (
                    (fermentables.reduce((sum, f) => sum + (f.weight * (fermentableCosts[f.name] || 0)), 0) +
                     hops.reduce((sum, h) => sum + (h.weight * (hopCosts[h.name] || 0)), 0) +
                     yeastCost) / (batchSize * 8)
                  ).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ({batchSize * 8} pints per batch)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add brewing notes, fermentation schedule, etc."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {brewMethod !== 'all-grain' && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-1">Extract Recipe Mode</p>
            <p className="text-muted-foreground">
              When building kit, base malts will be converted to {brewMethod === 'extract-lme' ? 'LME' : 'DME'}.
              Specialty grains will be included for steeping.
            </p>
          </div>
        )}

        <Button onClick={buildKit} size="lg" variant="default">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Build {brewMethod === 'all-grain' ? 'All-Grain' : 'Extract'} Kit & Add to Cart
        </Button>

        <div className="text-center text-sm text-muted-foreground">or</div>

        <Button onClick={addIngredientsToCart} size="lg" variant="outline">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add Ingredients As-Is to Cart
        </Button>

        <div className="flex gap-3">
          <Button onClick={saveRecipe} disabled={isSaving || !isLoggedIn} className="flex-1">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {currentRecipeId ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {currentRecipeId ? 'Update Recipe' : 'Save Recipe'}
              </>
            )}
          </Button>
          <Button onClick={downloadBeerXML} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export BeerXML
          </Button>
        </div>

        <Button
          onClick={() => setShowShoppingList(true)}
          variant="outline"
          size="lg"
          disabled={fermentables.length === 0 && hops.length === 0 && !yeast}
          className="w-full border-gold/30 hover:bg-gold/10"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Generate Shopping List
        </Button>
      </div>

      <ShoppingListModal
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
        recipeName={recipeName || 'Untitled Recipe'}
        items={generateShoppingListItems()}
        totalCost={getTotalCost()}
      />
    </div>
  );
}
