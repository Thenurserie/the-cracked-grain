'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  calculateABV,
  calculateStrikeTemp,
  calculateMashWater,
  calculateSpargeWater,
  calculatePrimingSugar,
  calculateYeastCells,
  correctHydrometer,
  brixToSG,
  sgToBrix,
  calculateKegPSI,
  calculateDilution,
  calculateCalciumAddition,
  convertLMEtoDME,
  convertDMEtoLME,
  convertExtractToGrain,
  calculateBrewhouseEfficiency,
  calculateBottles
} from '@/lib/brewing-calcs';

export default function Calculators() {
  const [abvOG, setAbvOG] = useState(1.050);
  const [abvFG, setAbvFG] = useState(1.010);
  const [abvResult, setAbvResult] = useState<number | null>(null);

  const [strikeGrainTemp, setStrikeGrainTemp] = useState(68);
  const [strikeTargetTemp, setStrikeTargetTemp] = useState(152);
  const [strikeRatio, setStrikeRatio] = useState(1.25);
  const [strikeResult, setStrikeResult] = useState<number | null>(null);

  const [mashGrainWeight, setMashGrainWeight] = useState(10);
  const [mashRatio, setMashRatio] = useState(1.25);
  const [mashResult, setMashResult] = useState<number | null>(null);

  const [spargeBatchSize, setSpargeBatchSize] = useState(5);
  const [spargeBoilTime, setSpargeBoilTime] = useState(60);
  const [spargeEvapRate, setSpargeEvapRate] = useState(1.5);
  const [spargeMashWater, setSpargeMashWater] = useState(3.125);
  const [spargeAbsorption, setSpargeAbsorption] = useState(1.0);
  const [spargeResult, setSpargeResult] = useState<number | null>(null);

  const [primingBatchSize, setPrimingBatchSize] = useState(5);
  const [primingCO2, setPrimingCO2] = useState(2.5);
  const [primingSugarType, setPrimingSugarType] = useState('Corn Sugar');
  const [primingResult, setPrimingResult] = useState<number | null>(null);

  const [yeastBatchSize, setYeastBatchSize] = useState(5);
  const [yeastOG, setYeastOG] = useState(1.050);
  const [yeastType, setYeastType] = useState<'Ale' | 'Lager'>('Ale');
  const [yeastResult, setYeastResult] = useState<number | null>(null);

  const [hydroReading, setHydroReading] = useState(1.050);
  const [hydroTemp, setHydroTemp] = useState(75);
  const [hydroCalTemp, setHydroCalTemp] = useState(60);
  const [hydroResult, setHydroResult] = useState<number | null>(null);

  const [brix, setBrix] = useState(12);
  const [brixResult, setBrixResult] = useState<number | null>(null);

  const [kegTemp, setKegTemp] = useState(38);
  const [kegCO2, setKegCO2] = useState(2.5);
  const [kegResult, setKegResult] = useState<number | null>(null);

  const [dilutionVolume, setDilutionVolume] = useState(5);
  const [dilutionCurrentGravity, setDilutionCurrentGravity] = useState(1.060);
  const [dilutionTargetGravity, setDilutionTargetGravity] = useState(1.050);
  const [dilutionResult, setDilutionResult] = useState<{ waterToAdd: number; finalVolume: number } | null>(null);

  const [calciumVolume, setCalciumVolume] = useState(5);
  const [calciumCurrent, setCalciumCurrent] = useState(50);
  const [calciumTarget, setCalciumTarget] = useState(100);
  const [calciumType, setCalciumType] = useState<'Gypsum' | 'Calcium Chloride'>('Gypsum');
  const [calciumResult, setCalciumResult] = useState<number | null>(null);

  // Brix Converter state
  const [brixInput, setBrixInput] = useState('');
  const [sgInput, setSgInput] = useState('');
  const [brixConverterMode, setBrixConverterMode] = useState<'brix'| 'sg'>('brix');

  // LME/DME Conversion state
  const [lmeAmount, setLmeAmount] = useState(6);
  const [dmeAmount, setDmeAmount] = useState(4.8);
  const [extractConversionMode, setExtractConversionMode] = useState<'lme' | 'dme'>('lme');

  // Extract to Grain Conversion state
  const [extractAmount, setExtractAmount] = useState(6);
  const [extractType, setExtractType] = useState<'LME' | 'DME'>('LME');
  const [extractEfficiency, setExtractEfficiency] = useState(75);
  const [extractToGrainResult, setExtractToGrainResult] = useState<number | null>(null);

  // Brewhouse Efficiency state
  const [efficiencyGrainWeight, setEfficiencyGrainWeight] = useState(10);
  const [efficiencyActualOG, setEfficiencyActualOG] = useState(1.050);
  const [efficiencyBatchSize, setEfficiencyBatchSize] = useState(5);
  const [efficiencyResult, setEfficiencyResult] = useState<{ efficiency: number; actualPPG: number } | null>(null);

  // Bottling Calculator state
  const [bottlingBatchSize, setBottlingBatchSize] = useState(5);
  const [bottlingResult, setBottlingResult] = useState<any | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Brewing Calculators</h2>

      <Tabs defaultValue="abv" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto bg-muted/50 p-2">
          <TabsTrigger value="abv" className="text-xs md:text-sm">ABV</TabsTrigger>
          <TabsTrigger value="hydrometer" className="text-xs md:text-sm">Hydrometer</TabsTrigger>
          <TabsTrigger value="refractometer" className="text-xs md:text-sm">Brix</TabsTrigger>
          <TabsTrigger value="strike" className="text-xs md:text-sm">Strike Temp</TabsTrigger>
          <TabsTrigger value="mash" className="text-xs md:text-sm">Mash Water</TabsTrigger>
          <TabsTrigger value="sparge" className="text-xs md:text-sm">Sparge Water</TabsTrigger>
          <TabsTrigger value="lme-dme" className="text-xs md:text-sm">LME/DME</TabsTrigger>
          <TabsTrigger value="extract-grain" className="text-xs md:text-sm">Extract→Grain</TabsTrigger>
          <TabsTrigger value="efficiency" className="text-xs md:text-sm">Efficiency</TabsTrigger>
          <TabsTrigger value="priming" className="text-xs md:text-sm">Priming</TabsTrigger>
          <TabsTrigger value="bottling" className="text-xs md:text-sm">Bottling</TabsTrigger>
          <TabsTrigger value="keg" className="text-xs md:text-sm">Keg PSI</TabsTrigger>
          <TabsTrigger value="yeast" className="text-xs md:text-sm">Yeast Pitch</TabsTrigger>
          <TabsTrigger value="dilution" className="text-xs md:text-sm">Dilution</TabsTrigger>
          <TabsTrigger value="calcium" className="text-xs md:text-sm">Water</TabsTrigger>
        </TabsList>

        <TabsContent value="abv" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ABV Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Original Gravity</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={abvOG}
                    onChange={(e) => setAbvOG(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Final Gravity</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={abvFG}
                    onChange={(e) => setAbvFG(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => setAbvResult(calculateABV(abvOG, abvFG))}>
                Calculate
              </Button>
              {abvResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">ABV</div>
                  <div className="text-3xl font-bold">{abvResult.toFixed(1)}%</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Attenuation: {(((abvOG - abvFG) / (abvOG - 1)) * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strike" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Strike Temperature Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Grain Temp (°F)</Label>
                  <Input
                    type="number"
                    value={strikeGrainTemp}
                    onChange={(e) => setStrikeGrainTemp(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Target Mash Temp (°F)</Label>
                  <Input
                    type="number"
                    value={strikeTargetTemp}
                    onChange={(e) => setStrikeTargetTemp(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Water/Grist Ratio (qt/lb)</Label>
                  <Input
                    type="number"
                    step="0.25"
                    value={strikeRatio}
                    onChange={(e) => setStrikeRatio(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => setStrikeResult(calculateStrikeTemp(strikeGrainTemp, strikeTargetTemp, strikeRatio))}>
                Calculate
              </Button>
              {strikeResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Strike Temperature</div>
                  <div className="text-3xl font-bold">{strikeResult.toFixed(1)}°F</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mash" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mash Water Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Grain Weight (lbs)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={mashGrainWeight}
                    onChange={(e) => setMashGrainWeight(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Water/Grist Ratio (qt/lb)</Label>
                  <Input
                    type="number"
                    step="0.25"
                    value={mashRatio}
                    onChange={(e) => setMashRatio(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => setMashResult(calculateMashWater(mashGrainWeight, mashRatio))}>
                Calculate
              </Button>
              {mashResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Mash Water Needed</div>
                  <div className="text-3xl font-bold">{mashResult.toFixed(1)} qt</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {(mashResult / 4).toFixed(2)} gal
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sparge" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sparge Water Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Batch Size (gal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={spargeBatchSize}
                    onChange={(e) => setSpargeBatchSize(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Boil Time (min)</Label>
                  <Input
                    type="number"
                    value={spargeBoilTime}
                    onChange={(e) => setSpargeBoilTime(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Evaporation Rate (gal/hr)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={spargeEvapRate}
                    onChange={(e) => setSpargeEvapRate(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Mash Water (gal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={spargeMashWater}
                    onChange={(e) => setSpargeMashWater(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Grain Absorption (gal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={spargeAbsorption}
                    onChange={(e) => setSpargeAbsorption(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => setSpargeResult(calculateSpargeWater(
                spargeBatchSize,
                spargeBoilTime,
                spargeEvapRate,
                spargeMashWater,
                spargeAbsorption
              ))}>
                Calculate
              </Button>
              {spargeResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Sparge Water Needed</div>
                  <div className="text-3xl font-bold">{spargeResult.toFixed(2)} gal</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lme-dme" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>LME/DME Conversion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Conversion Mode</Label>
                  <Select value={extractConversionMode} onValueChange={(v) => setExtractConversionMode(v as 'lme' | 'dme')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lme">LME → DME</SelectItem>
                      <SelectItem value="dme">DME → LME</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {extractConversionMode === 'lme' ? (
                  <div>
                    <Label>Liquid Malt Extract (lbs)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={lmeAmount}
                      onChange={(e) => setLmeAmount(parseFloat(e.target.value))}
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Dry Malt Extract (lbs)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={dmeAmount}
                      onChange={(e) => setDmeAmount(parseFloat(e.target.value))}
                    />
                  </div>
                )}
              </div>

              <Button onClick={() => {
                if (extractConversionMode === 'lme') {
                  setDmeAmount(convertLMEtoDME(lmeAmount));
                } else {
                  setLmeAmount(convertDMEtoLME(dmeAmount));
                }
              }}>
                Calculate
              </Button>

              <div className="p-4 bg-muted rounded-lg">
                {extractConversionMode === 'lme' ? (
                  <>
                    <div className="text-sm text-muted-foreground">DME Equivalent</div>
                    <div className="text-3xl font-bold">{dmeAmount.toFixed(2)} lbs</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">LME Equivalent</div>
                    <div className="text-3xl font-bold">{lmeAmount.toFixed(2)} lbs</div>
                  </>
                )}
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-semibold mb-1">How to use:</p>
                <p>Convert between liquid (LME) and dry (DME) malt extract. DME is ~20% lighter than LME for the same gravity contribution.</p>
                <p className="mt-2"><strong>Ratio:</strong> 1 lb LME = 0.8 lb DME</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extract-grain" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Extract to Grain Conversion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Extract Amount (lbs)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={extractAmount}
                    onChange={(e) => setExtractAmount(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Extract Type</Label>
                  <Select value={extractType} onValueChange={(v) => setExtractType(v as 'LME' | 'DME')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LME">Liquid (LME)</SelectItem>
                      <SelectItem value="DME">Dry (DME)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Brewhouse Efficiency (%)</Label>
                  <Input
                    type="number"
                    value={extractEfficiency}
                    onChange={(e) => setExtractEfficiency(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={() => {
                const result = convertExtractToGrain(extractAmount, extractType, extractEfficiency);
                setExtractToGrainResult(result);
              }}>
                Calculate
              </Button>

              {extractToGrainResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Base Grain Needed</div>
                  <div className="text-3xl font-bold">{extractToGrainResult.toFixed(2)} lbs</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    At {extractEfficiency}% efficiency
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-semibold mb-1">How to use:</p>
                <p>Convert extract recipes to all-grain. Enter the extract amount and your expected brewhouse efficiency (typically 70-80% for homebrewers).</p>
                <p className="mt-2"><strong>Tip:</strong> Start with 75% efficiency if unsure.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Brewhouse Efficiency Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Total Grain (lbs)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={efficiencyGrainWeight}
                    onChange={(e) => setEfficiencyGrainWeight(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Actual OG</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={efficiencyActualOG}
                    onChange={(e) => setEfficiencyActualOG(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Batch Size (gal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={efficiencyBatchSize}
                    onChange={(e) => setEfficiencyBatchSize(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={() => {
                const result = calculateBrewhouseEfficiency(
                  efficiencyGrainWeight,
                  efficiencyActualOG,
                  efficiencyBatchSize
                );
                setEfficiencyResult(result);
              }}>
                Calculate
              </Button>

              {efficiencyResult !== null && (
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Brewhouse Efficiency</div>
                    <div className="text-3xl font-bold">{efficiencyResult.efficiency.toFixed(1)}%</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Actual PPG</div>
                    <div className="text-2xl font-bold">{efficiencyResult.actualPPG.toFixed(1)}</div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-semibold mb-1">How to use:</p>
                <p>Track your actual brewhouse efficiency by entering grain weight, measured OG, and batch size. Use this to improve your system and predict future batches.</p>
                <p className="mt-2"><strong>Typical ranges:</strong> Beginners 60-70%, Intermediate 70-80%, Advanced 80-85%</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Priming Sugar Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Batch Size (gal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={primingBatchSize}
                    onChange={(e) => setPrimingBatchSize(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>CO2 Volumes</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={primingCO2}
                    onChange={(e) => setPrimingCO2(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Sugar Type</Label>
                  <Select value={primingSugarType} onValueChange={setPrimingSugarType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corn Sugar">Corn Sugar</SelectItem>
                      <SelectItem value="Table Sugar">Table Sugar</SelectItem>
                      <SelectItem value="DME">DME</SelectItem>
                      <SelectItem value="Honey">Honey</SelectItem>
                      <SelectItem value="Belgian Candy">Belgian Candy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => setPrimingResult(calculatePrimingSugar(primingBatchSize, primingCO2, primingSugarType))}>
                Calculate
              </Button>
              {primingResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Priming Sugar Needed</div>
                  <div className="text-3xl font-bold">{primingResult.toFixed(2)} oz</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bottling" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bottling Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Batch Size (gallons)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bottlingBatchSize}
                  onChange={(e) => setBottlingBatchSize(parseFloat(e.target.value))}
                />
              </div>

              <Button onClick={() => {
                const result = calculateBottles(bottlingBatchSize);
                setBottlingResult(result);
              }}>
                Calculate
              </Button>

              {bottlingResult !== null && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">12 oz bottles</div>
                      <div className="text-2xl font-bold">{bottlingResult.bottles12oz}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">16 oz bottles</div>
                      <div className="text-2xl font-bold">{bottlingResult.bottles16oz}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">22 oz bombers</div>
                      <div className="text-2xl font-bold">{bottlingResult.bottles22oz}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">750 mL bottles</div>
                      <div className="text-2xl font-bold">{bottlingResult.bottles750ml}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">500 mL bottles</div>
                      <div className="text-2xl font-bold">{bottlingResult.bottles500ml}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-semibold mb-1">How to use:</p>
                <p>Calculate how many bottles you need for your batch. Account for ~5% loss to trub and sediment.</p>
                <p className="mt-2"><strong>Tip:</strong> Most homebrewers use 12 oz bottles (standard beer bottle size).</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yeast" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Yeast Pitch Rate Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Batch Size (gal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={yeastBatchSize}
                    onChange={(e) => setYeastBatchSize(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Original Gravity</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={yeastOG}
                    onChange={(e) => setYeastOG(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Yeast Type</Label>
                  <Select value={yeastType} onValueChange={(v) => setYeastType(v as 'Ale' | 'Lager')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ale">Ale</SelectItem>
                      <SelectItem value="Lager">Lager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => setYeastResult(calculateYeastCells(yeastBatchSize, yeastOG, yeastType))}>
                Calculate
              </Button>
              {yeastResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Cells Needed</div>
                  <div className="text-3xl font-bold">{yeastResult} billion</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Estimated packs: {Math.ceil(yeastResult / 100)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hydrometer" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hydrometer Temperature Correction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Hydrometer Reading</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={hydroReading}
                    onChange={(e) => setHydroReading(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Sample Temp (°F)</Label>
                  <Input
                    type="number"
                    value={hydroTemp}
                    onChange={(e) => setHydroTemp(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Calibration Temp (°F)</Label>
                  <Input
                    type="number"
                    value={hydroCalTemp}
                    onChange={(e) => setHydroCalTemp(parseInt(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => setHydroResult(correctHydrometer(hydroReading, hydroTemp, hydroCalTemp))}>
                Calculate
              </Button>
              {hydroResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Corrected Gravity</div>
                  <div className="text-3xl font-bold">{hydroResult.toFixed(3)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refractometer" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Brix Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Conversion Mode</Label>
                  <Select value={brixConverterMode} onValueChange={(v) => setBrixConverterMode(v as 'brix' | 'sg')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brix">Brix → Specific Gravity</SelectItem>
                      <SelectItem value="sg">Specific Gravity → Brix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {brixConverterMode === 'brix' ? (
                  <div>
                    <Label>Brix Reading</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={brixInput}
                      onChange={(e) => setBrixInput(e.target.value)}
                      placeholder="e.g., 12.5"
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Specific Gravity</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={sgInput}
                      onChange={(e) => setSgInput(e.target.value)}
                      placeholder="e.g., 1.050"
                    />
                  </div>
                )}
              </div>

              <Button onClick={() => {
                if (brixConverterMode === 'brix' && brixInput) {
                  setBrixResult(brixToSG(parseFloat(brixInput)));
                } else if (brixConverterMode === 'sg' && sgInput) {
                  const result = sgToBrix(parseFloat(sgInput));
                  setBrixResult(result);
                }
              }}>
                Calculate
              </Button>

              {brixResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    {brixConverterMode === 'brix' ? 'Specific Gravity' : 'Brix'}
                  </div>
                  <div className="text-3xl font-bold">
                    {brixConverterMode === 'brix' ? brixResult.toFixed(3) : brixResult.toFixed(1)}
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-semibold mb-1">How to use:</p>
                <p>Convert between Brix (sugar content %) and Specific Gravity. Useful for refractometer readings or wine making.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keg" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Keg PSI Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Temperature (°F)</Label>
                  <Input
                    type="number"
                    value={kegTemp}
                    onChange={(e) => setKegTemp(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>CO2 Volumes</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={kegCO2}
                    onChange={(e) => setKegCO2(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => setKegResult(calculateKegPSI(kegTemp, kegCO2))}>
                Calculate
              </Button>
              {kegResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Serving Pressure</div>
                  <div className="text-3xl font-bold">{kegResult.toFixed(1)} PSI</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dilution" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dilution Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Current Volume (gal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={dilutionVolume}
                    onChange={(e) => setDilutionVolume(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Current Gravity</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={dilutionCurrentGravity}
                    onChange={(e) => setDilutionCurrentGravity(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Target Gravity</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={dilutionTargetGravity}
                    onChange={(e) => setDilutionTargetGravity(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => setDilutionResult(calculateDilution(dilutionVolume, dilutionCurrentGravity, dilutionTargetGravity))}>
                Calculate
              </Button>
              {dilutionResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Water to Add</div>
                  <div className="text-3xl font-bold">{dilutionResult.waterToAdd.toFixed(2)} gal</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Final Volume: {dilutionResult.finalVolume.toFixed(2)} gal
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calcium" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Chemistry Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Water Volume (gal)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={calciumVolume}
                    onChange={(e) => setCalciumVolume(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Addition Type</Label>
                  <Select value={calciumType} onValueChange={(v) => setCalciumType(v as 'Gypsum' | 'Calcium Chloride')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gypsum">Gypsum (CaSO4)</SelectItem>
                      <SelectItem value="Calcium Chloride">Calcium Chloride (CaCl2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Current Calcium (ppm)</Label>
                  <Input
                    type="number"
                    value={calciumCurrent}
                    onChange={(e) => setCalciumCurrent(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Target Calcium (ppm)</Label>
                  <Input
                    type="number"
                    value={calciumTarget}
                    onChange={(e) => setCalciumTarget(parseInt(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => setCalciumResult(calculateCalciumAddition(calciumVolume, calciumCurrent, calciumTarget, calciumType))}>
                Calculate
              </Button>
              {calciumResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">{calciumType} Needed</div>
                  <div className="text-3xl font-bold">{calciumResult.toFixed(2)} g</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
