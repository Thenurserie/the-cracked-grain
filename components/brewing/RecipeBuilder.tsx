'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseStub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Download, Save, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart } from '@/lib/cart';
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

type BrewMethod = 'all-grain' | 'extract-lme' | 'extract-dme' | 'partial-mash';

export default function RecipeBuilder() {
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

  const [og, setOg] = useState(1.050);
  const [fg, setFg] = useState(1.010);
  const [abv, setAbv] = useState(0);
  const [ibu, setIbu] = useState(0);
  const [srm, setSrm] = useState(0);

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

  const saveRecipe = async () => {
    if (!recipeName) {
      toast.error('Please enter a recipe name');
      return;
    }

    // Recipe saving disabled - authentication system coming soon
    toast.info('Recipe saving will be available once the new authentication system is set up');
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
          {fermentables.map((fermentable, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
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
              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.1"
                  value={fermentable.weight}
                  onChange={(e) => updateFermentable(index, 'weight', e.target.value)}
                  placeholder="lbs"
                />
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {fermentable.lovibond}L
              </div>
              <div className="col-span-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFermentable(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
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
          {hops.map((hop, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
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
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.1"
                  value={hop.weight}
                  onChange={(e) => updateHop(index, 'weight', e.target.value)}
                  placeholder="oz"
                />
              </div>
              <div className="col-span-2">
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
              <div className="col-span-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeHop(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yeast</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={yeast?.name || ''}
            onValueChange={(value) => {
              const selectedYeast = YEAST_DATABASE.find(y => y.name === value);
              if (selectedYeast) setYeast(selectedYeast as Yeast);
            }}
          >
            <SelectTrigger>
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
          <Button onClick={saveRecipe} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Recipe
          </Button>
          <Button onClick={downloadBeerXML} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export BeerXML
          </Button>
        </div>
      </div>
    </div>
  );
}
