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
  calculateKegPSI,
  calculateDilution,
  calculateCalciumAddition
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Brewing Calculators</h2>

      <Tabs defaultValue="abv" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto bg-muted/50 p-2">
          <TabsTrigger value="abv">ABV</TabsTrigger>
          <TabsTrigger value="strike">Strike Temp</TabsTrigger>
          <TabsTrigger value="mash">Mash Water</TabsTrigger>
          <TabsTrigger value="sparge">Sparge Water</TabsTrigger>
          <TabsTrigger value="priming">Priming Sugar</TabsTrigger>
          <TabsTrigger value="yeast">Yeast Pitch</TabsTrigger>
          <TabsTrigger value="hydrometer">Hydrometer</TabsTrigger>
          <TabsTrigger value="refractometer">Refractometer</TabsTrigger>
          <TabsTrigger value="keg">Keg PSI</TabsTrigger>
          <TabsTrigger value="dilution">Dilution</TabsTrigger>
          <TabsTrigger value="calcium">Water Chem</TabsTrigger>
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
              <CardTitle>Refractometer Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Brix Reading</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={brix}
                  onChange={(e) => setBrix(parseFloat(e.target.value))}
                />
              </div>
              <Button onClick={() => setBrixResult(brixToSG(brix))}>
                Calculate
              </Button>
              {brixResult !== null && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Specific Gravity</div>
                  <div className="text-3xl font-bold">{brixResult.toFixed(3)}</div>
                </div>
              )}
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
