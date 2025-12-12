'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Droplets, FlaskConical, Gauge } from 'lucide-react';

export function AdvancedCalculators() {
  return (
    <Tabs defaultValue="priming" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="priming">Priming</TabsTrigger>
        <TabsTrigger value="yeast">Yeast Starter</TabsTrigger>
        <TabsTrigger value="refractometer">Refractometer</TabsTrigger>
        <TabsTrigger value="keg">Keg Carbonation</TabsTrigger>
      </TabsList>

      <TabsContent value="priming">
        <PrimingCalculator />
      </TabsContent>

      <TabsContent value="yeast">
        <YeastStarterCalculator />
      </TabsContent>

      <TabsContent value="refractometer">
        <RefractometerCalculator />
      </TabsContent>

      <TabsContent value="keg">
        <KegCarbonationCalculator />
      </TabsContent>
    </Tabs>
  );
}

function PrimingCalculator() {
  const [beerVolume, setBeerVolume] = useState(5.0);
  const [beerTemp, setBeerTemp] = useState(68);
  const [targetCO2, setTargetCO2] = useState(2.4);
  const [sugarType, setSugarType] = useState('corn');

  const SUGAR_TYPES: Record<string, { name: string; factor: number }> = {
    corn: { name: 'Corn Sugar (Dextrose)', factor: 1.0 },
    table: { name: 'Table Sugar (Sucrose)', factor: 0.91 },
    dme: { name: 'Dry Malt Extract', factor: 1.33 },
    honey: { name: 'Honey', factor: 1.25 },
    maple: { name: 'Maple Syrup', factor: 1.33 },
  };

  function calculateCO2InBeer(temp: number): number {
    return 3.0378 - 0.050062 * temp + 0.00026555 * temp * temp;
  }

  const currentCO2 = calculateCO2InBeer(beerTemp);
  const co2Needed = Math.max(0, targetCO2 - currentCO2);
  const sugarFactor = SUGAR_TYPES[sugarType].factor;
  const sugarNeededOz = (co2Needed * beerVolume * 0.5) * sugarFactor;
  const sugarNeededGrams = sugarNeededOz * 28.35;
  const sugarPerBottle = (sugarNeededGrams / (beerVolume * 8)).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Priming Sugar Calculator
        </CardTitle>
        <CardDescription>
          Calculate the amount of priming sugar needed for bottle carbonation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Beer Volume (gallons)</Label>
            <Input
              type="number"
              value={beerVolume}
              onChange={(e) => setBeerVolume(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label>Beer Temperature (°F)</Label>
            <Input
              type="number"
              value={beerTemp}
              onChange={(e) => setBeerTemp(parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Current temperature of beer to be bottled
            </p>
          </div>

          <div className="space-y-2">
            <Label>Target CO₂ (volumes)</Label>
            <Input
              type="number"
              value={targetCO2}
              onChange={(e) => setTargetCO2(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
            <p className="text-xs text-muted-foreground">
              Ales: 2.2-2.6, Lagers: 2.5-2.8, Wheat: 3.0-4.5
            </p>
          </div>

          <div className="space-y-2">
            <Label>Sugar Type</Label>
            <Select value={sugarType} onValueChange={setSugarType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUGAR_TYPES).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
          <h3 className="font-semibold">Results</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Current CO₂ in Beer</Label>
              <p className="text-2xl font-bold">{currentCO2.toFixed(2)} vol</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">CO₂ Needed</Label>
              <p className="text-2xl font-bold">{co2Needed.toFixed(2)} vol</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total {SUGAR_TYPES[sugarType].name}</Label>
              <p className="text-2xl font-bold">{sugarNeededOz.toFixed(2)} oz</p>
              <p className="text-sm text-muted-foreground">({sugarNeededGrams.toFixed(1)} g)</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Per 12 oz Bottle</Label>
              <p className="text-2xl font-bold">{sugarPerBottle} g</p>
              <p className="text-sm text-muted-foreground">or {(parseFloat(sugarPerBottle) / 4.5).toFixed(2)} tsp</p>
            </div>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <p className="font-semibold">Typical CO₂ Volumes by Style:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• British Ales: 1.5-2.1</li>
            <li>• American Ales: 2.2-2.7</li>
            <li>• Belgian Ales: 2.0-4.5</li>
            <li>• German Lagers: 2.5-2.8</li>
            <li>• Wheat Beers: 3.0-4.5</li>
            <li>• Stouts/Porters: 1.7-2.3</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function YeastStarterCalculator() {
  const [og, setOg] = useState(1.050);
  const [batchSize, setBatchSize] = useState(5.0);
  const [yeastAge, setYeastAge] = useState(0);
  const [starterSize, setStarterSize] = useState(1.0);
  const [starterOG, setStarterOG] = useState(1.040);

  const batchSizeML = batchSize * 3785.41;
  const pitchRate = og < 1.060 ? 0.75 : 1.5;
  const cellsNeeded = (batchSizeML * pitchRate * og) / 1000;

  const viability = Math.max(0, 100 - (yeastAge / 30) * 21);
  const cellsInPackage = 100;
  const viableCells = (cellsInPackage * viability) / 100;

  const starterSizeML = starterSize * 1000;
  const starterGravityPoints = (starterOG - 1) * 1000;
  const growthRate = 1 + (starterGravityPoints / 100) * 1.4;
  const cellsAfterStarter = viableCells * growthRate * (starterSizeML / 1000);

  const needsStarter = cellsNeeded > viableCells;
  const starterIsEnough = cellsAfterStarter >= cellsNeeded;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          Yeast Starter Calculator
        </CardTitle>
        <CardDescription>
          Calculate if you need a yeast starter and what size
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Original Gravity</Label>
            <Input
              type="number"
              value={og}
              onChange={(e) => setOg(parseFloat(e.target.value) || 1.000)}
              step="0.001"
            />
          </div>

          <div className="space-y-2">
            <Label>Batch Size (gallons)</Label>
            <Input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label>Yeast Age (months)</Label>
            <Input
              type="number"
              value={yeastAge}
              onChange={(e) => setYeastAge(parseFloat(e.target.value) || 0)}
              step="1"
            />
            <p className="text-xs text-muted-foreground">
              Months since manufacture date
            </p>
          </div>

          <div className="space-y-2">
            <Label>Pitch Rate (M cells/mL/°P)</Label>
            <Input
              type="number"
              value={pitchRate}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              {og < 1.060 ? 'Standard ale' : 'Lager/high gravity'}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
          <h3 className="font-semibold">Yeast Requirements</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Cells Needed</Label>
              <p className="text-2xl font-bold">{cellsNeeded.toFixed(0)}B</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Viable Cells in Package</Label>
              <p className="text-2xl font-bold">{viableCells.toFixed(0)}B</p>
              <p className="text-sm text-muted-foreground">({viability.toFixed(0)}% viability)</p>
            </div>
          </div>
        </div>

        {needsStarter ? (
          <>
            <div className="space-y-4">
              <h3 className="font-semibold">Starter Parameters</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Starter Size (liters)</Label>
                  <Input
                    type="number"
                    value={starterSize}
                    onChange={(e) => setStarterSize(parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Starter OG</Label>
                  <Input
                    type="number"
                    value={starterOG}
                    onChange={(e) => setStarterOG(parseFloat(e.target.value) || 1.000)}
                    step="0.001"
                  />
                  <p className="text-xs text-muted-foreground">
                    Typically 1.036-1.040
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
              <h3 className="font-semibold">Starter Results</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Cells After Starter</Label>
                  <p className="text-2xl font-bold">{cellsAfterStarter.toFixed(0)}B</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <p className={`text-2xl font-bold ${starterIsEnough ? 'text-green-600' : 'text-orange-600'}`}>
                    {starterIsEnough ? '✓ Sufficient' : '⚠ Too Small'}
                  </p>
                </div>
              </div>
              {!starterIsEnough && (
                <p className="text-sm text-orange-600">
                  Consider increasing starter size or using multiple packs
                </p>
              )}
            </div>

            <div className="text-sm space-y-2">
              <p className="font-semibold">Starter Instructions:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>1. Boil {(starterSize * 100).toFixed(0)}g DME in {starterSize.toFixed(1)}L water for 15 min</li>
                <li>2. Cool to 70°F and transfer to sanitized flask</li>
                <li>3. Pitch yeast and stir on stir plate for 24-48 hours</li>
                <li>4. Cold crash, decant liquid, pitch yeast slurry</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
            <p className="text-green-700 dark:text-green-300 font-semibold">
              ✓ No starter needed! You have sufficient yeast cells.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RefractometerCalculator() {
  const [originalBrix, setOriginalBrix] = useState(12.5);
  const [currentBrix, setCurrentBrix] = useState(5.2);
  const [wortCorrectionFactor, setWortCorrectionFactor] = useState(1.04);

  const og = 1 + (originalBrix * wortCorrectionFactor / 258.6);
  const rg = 1 + (currentBrix * wortCorrectionFactor / 258.6);

  const fg = 1.001843 - 0.002318474 * originalBrix - 0.000007775 * originalBrix * originalBrix
    - 0.000000034 * originalBrix * originalBrix * originalBrix
    + 0.00574 * currentBrix + 0.00003344 * currentBrix * currentBrix
    + 0.000000086 * currentBrix * currentBrix * currentBrix;

  const abv = ((1.05 * (og - fg)) / fg) / 0.79 * 100;
  const apparentAttenuation = ((og - fg) / (og - 1)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Refractometer Calculator
        </CardTitle>
        <CardDescription>
          Convert refractometer readings to actual gravity and ABV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Refractometers measure sugar concentration but are affected by alcohol. Use this calculator
            to correct readings taken during and after fermentation.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Original Brix</Label>
            <Input
              type="number"
              value={originalBrix}
              onChange={(e) => setOriginalBrix(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
            <p className="text-xs text-muted-foreground">
              Before fermentation
            </p>
          </div>

          <div className="space-y-2">
            <Label>Current Brix</Label>
            <Input
              type="number"
              value={currentBrix}
              onChange={(e) => setCurrentBrix(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
            <p className="text-xs text-muted-foreground">
              Current reading
            </p>
          </div>

          <div className="space-y-2">
            <Label>Wort Correction Factor</Label>
            <Input
              type="number"
              value={wortCorrectionFactor}
              onChange={(e) => setWortCorrectionFactor(parseFloat(e.target.value) || 1.0)}
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">
              Usually 1.04
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
          <h3 className="font-semibold">Corrected Values</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs text-muted-foreground">Original Gravity</Label>
              <p className="text-2xl font-bold">{og.toFixed(3)}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Final Gravity</Label>
              <p className="text-2xl font-bold">{fg.toFixed(3)}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">ABV</Label>
              <p className="text-2xl font-bold">{abv.toFixed(1)}%</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Apparent Attenuation</Label>
              <p className="text-2xl font-bold">{apparentAttenuation.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <p className="font-semibold">Refractometer Tips:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Always calibrate with distilled water at 68°F (20°C)</li>
            <li>• Temperature affects readings - many have automatic compensation</li>
            <li>• Use correction factor specific to your refractometer if known</li>
            <li>• Readings during fermentation must account for alcohol interference</li>
            <li>• Most accurate for wort readings before fermentation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function KegCarbonationCalculator() {
  const [beerTemp, setBeerTemp] = useState(38);
  const [targetCO2, setTargetCO2] = useState(2.4);
  const [method, setMethod] = useState<'fast' | 'slow'>('slow');
  const [lineLength, setLineLength] = useState(5);
  const [lineID, setLineID] = useState(0.25);

  function calculatePSI(temp: number, co2: number): number {
    const tempC = (temp - 32) * 5 / 9;
    const psi = -16.6999 - 0.0101059 * tempC + 0.00116512 * tempC * tempC
      + 0.173354 * tempC * co2 + 4.24267 * co2 - 0.0684226 * co2 * co2;
    return Math.max(0, psi);
  }

  const servingPSI = calculatePSI(beerTemp, targetCO2);
  const fastPSI = servingPSI + 20;

  const resistancePerFoot = lineID === 0.25 ? 3.0 : lineID === 0.1875 ? 5.2 : 2.2;
  const totalResistance = lineLength * resistancePerFoot;
  const idealLineLengthForPSI = servingPSI / resistancePerFoot;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Keg Carbonation Calculator
        </CardTitle>
        <CardDescription>
          Calculate CO₂ pressure for kegging and serving
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Beer Temperature (°F)</Label>
            <Input
              type="number"
              value={beerTemp}
              onChange={(e) => setBeerTemp(parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Temperature in kegerator
            </p>
          </div>

          <div className="space-y-2">
            <Label>Target CO₂ (volumes)</Label>
            <Input
              type="number"
              value={targetCO2}
              onChange={(e) => setTargetCO2(parseFloat(e.target.value) || 0)}
              step="0.1"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Carbonation Method</Label>
            <Select value={method} onValueChange={(value: any) => setMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Set and Forget (Slow)</SelectItem>
                <SelectItem value="fast">Burst Carbonation (Fast)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
          <h3 className="font-semibold">Carbonation Settings</h3>

          {method === 'slow' ? (
            <>
              <div>
                <Label className="text-xs text-muted-foreground">Set Regulator To</Label>
                <p className="text-3xl font-bold">{servingPSI.toFixed(1)} PSI</p>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-semibold">Instructions:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. Set regulator to {servingPSI.toFixed(1)} PSI</li>
                  <li>2. Connect gas and leave for 7-10 days</li>
                  <li>3. Beer will reach target carbonation naturally</li>
                  <li>4. This is the recommended method for best results</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-xs text-muted-foreground">Initial Burst Pressure</Label>
                <p className="text-3xl font-bold">{fastPSI.toFixed(1)} PSI</p>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-semibold">Instructions:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. Chill beer to serving temperature</li>
                  <li>2. Set regulator to {fastPSI.toFixed(1)} PSI</li>
                  <li>3. Rock keg back and forth for 15-20 minutes</li>
                  <li>4. Let rest for 30 minutes, then reduce to {servingPSI.toFixed(1)} PSI</li>
                  <li>5. Beer should be carbonated in 24-48 hours</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Beer Line Balancing</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Line Length (feet)</Label>
              <Input
                type="number"
                value={lineLength}
                onChange={(e) => setLineLength(parseFloat(e.target.value) || 0)}
                step="0.5"
              />
            </div>

            <div className="space-y-2">
              <Label>Line Inner Diameter</Label>
              <Select value={lineID.toString()} onValueChange={(value) => setLineID(parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1875">3/16"</SelectItem>
                  <SelectItem value="0.25">1/4"</SelectItem>
                  <SelectItem value="0.3125">5/16"</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-muted-foreground">Line Resistance</Label>
                <p className="text-xl font-bold">{totalResistance.toFixed(1)} PSI</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Ideal Line Length for {servingPSI.toFixed(1)} PSI</Label>
                <p className="text-xl font-bold">{idealLineLengthForPSI.toFixed(1)} feet</p>
              </div>
              {Math.abs(totalResistance - servingPSI) > 2 && (
                <p className="text-sm text-orange-600">
                  ⚠ Line resistance doesn't match serving pressure. Adjust line length for optimal pour.
                </p>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-semibold">Line Balancing Tips:</p>
            <p>• Ideal: Line resistance should equal serving pressure</p>
            <p>• Too short: Fast, foamy pours</p>
            <p>• Too long: Slow pours, flat beer</p>
            <p>• 3/16" ID line provides most resistance (recommended)</p>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <p className="font-semibold">Temperature/Pressure Chart:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="font-semibold">Temp</div>
            <div className="font-semibold">2.4 vol</div>
            <div className="font-semibold">2.6 vol</div>
            <div>38°F</div>
            <div>{calculatePSI(38, 2.4).toFixed(1)} PSI</div>
            <div>{calculatePSI(38, 2.6).toFixed(1)} PSI</div>
            <div>40°F</div>
            <div>{calculatePSI(40, 2.4).toFixed(1)} PSI</div>
            <div>{calculatePSI(40, 2.6).toFixed(1)} PSI</div>
            <div>42°F</div>
            <div>{calculatePSI(42, 2.4).toFixed(1)} PSI</div>
            <div>{calculatePSI(42, 2.6).toFixed(1)} PSI</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}