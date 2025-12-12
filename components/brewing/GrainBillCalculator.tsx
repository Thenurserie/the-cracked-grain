'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseStub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import {
  calculateOG,
  calculateFG,
  calculateABV,
  calculateSRM,
  GRAIN_DATABASE,
  type Fermentable
} from '@/lib/brewing-calcs';
import { addToCart } from '@/lib/cart';

export default function GrainBillCalculator() {
  const [batchSize, setBatchSize] = useState(5.0);
  const [efficiency, setEfficiency] = useState(75);
  const [attenuation, setAttenuation] = useState(75);
  const [fermentables, setFermentables] = useState<Fermentable[]>([]);
  const [costs, setCosts] = useState<{ [key: string]: number }>({});

  const [og, setOg] = useState(1.000);
  const [fg, setFg] = useState(1.000);
  const [abv, setAbv] = useState(0);
  const [srm, setSrm] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    if (fermentables.length > 0) {
      const calculatedOG = calculateOG(fermentables, batchSize, efficiency);
      setOg(calculatedOG);

      const calculatedFG = calculateFG(calculatedOG, attenuation);
      setFg(calculatedFG);

      const calculatedABV = calculateABV(calculatedOG, calculatedFG);
      setAbv(calculatedABV);

      const calculatedSRM = calculateSRM(fermentables, batchSize);
      setSrm(calculatedSRM);

      const weight = fermentables.reduce((sum, f) => sum + f.weight, 0);
      setTotalWeight(weight);

      const cost = fermentables.reduce((sum, f) => {
        const pricePerLb = costs[f.name] || 0;
        return sum + (f.weight * pricePerLb);
      }, 0);
      setTotalCost(cost);
    } else {
      setOg(1.000);
      setFg(1.000);
      setAbv(0);
      setSrm(0);
      setTotalWeight(0);
      setTotalCost(0);
    }
  }, [fermentables, batchSize, efficiency, attenuation, costs]);

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

  const updateCost = (name: string, cost: number) => {
    setCosts({ ...costs, [name]: cost });
  };

  const getPercentage = (weight: number) => {
    if (totalWeight === 0) return 0;
    return ((weight / totalWeight) * 100).toFixed(1);
  };

  const addAllToCart = async () => {
    if (fermentables.length === 0) {
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

    if (addedCount > 0) {
      toast.success(`Added ${addedCount} item(s) to cart`);
    }
    if (notFoundCount > 0) {
      toast.warning(`${notFoundCount} ingredient(s) not found in shop`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grain Bill Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="efficiency">Efficiency (%)</Label>
              <Input
                id="efficiency"
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="attenuation">Yeast Attenuation (%)</Label>
              <Select
                value={attenuation.toString()}
                onValueChange={(value) => setAttenuation(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="65">Low (65%)</SelectItem>
                  <SelectItem value="75">Medium (75%)</SelectItem>
                  <SelectItem value="85">High (85%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Grain Bill</CardTitle>
          <Button onClick={addFermentable} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Grain
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {fermentables.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Add grains to start building your grain bill
            </div>
          ) : (
            <>
              {fermentables.map((fermentable, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
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
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {getPercentage(fermentable.weight)}%
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="$/lb"
                      onChange={(e) => updateCost(fermentable.name, parseFloat(e.target.value) || 0)}
                    />
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
            </>
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
              <div className="text-sm text-muted-foreground">SRM</div>
              <div className="text-2xl font-bold">{srm.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Cost</div>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Total Grain Weight: {totalWeight.toFixed(2)} lbs
          </div>
        </CardContent>
      </Card>

      {fermentables.length > 0 && (
        <Button onClick={addAllToCart} className="w-full" size="lg">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add All Ingredients to Cart
        </Button>
      )}
    </div>
  );
}
