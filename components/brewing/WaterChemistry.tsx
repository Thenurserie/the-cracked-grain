'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseStub';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, Plus, Calculator } from 'lucide-react';

interface WaterProfile {
  id: string;
  name: string;
  calcium: number;
  magnesium: number;
  sodium: number;
  sulfate: number;
  chloride: number;
  bicarbonate: number;
  ph: number;
  alkalinity: number;
}

interface WaterAdjustments {
  gypsum: number;
  calciumChloride: number;
  epsomSalt: number;
  bakingSoda: number;
  chalk: number;
  lacticAcid: number;
  phosphoricAcid: number;
}

export function WaterChemistry() {
  const [waterProfiles, setWaterProfiles] = useState<WaterProfile[]>([]);
  const [sourceProfile, setSourceProfile] = useState<WaterProfile | null>(null);
  const [targetProfile, setTargetProfile] = useState<WaterProfile | null>(null);
  const [batchSize, setBatchSize] = useState(5.0);
  const [adjustments, setAdjustments] = useState<WaterAdjustments>({
    gypsum: 0,
    calciumChloride: 0,
    epsomSalt: 0,
    bakingSoda: 0,
    chalk: 0,
    lacticAcid: 0,
    phosphoricAcid: 0,
  });
  const [resultingProfile, setResultingProfile] = useState<WaterProfile | null>(null);

  useEffect(() => {
    loadWaterProfiles();
  }, []);

  useEffect(() => {
    if (sourceProfile) {
      calculateResultingProfile();
    }
  }, [sourceProfile, adjustments, batchSize]);

  async function loadWaterProfiles() {
    const { data, error } = await supabase
      .from('water_profiles')
      .select('*')
      .order('name');

    if (data) {
      setWaterProfiles(data);
      if (data.length > 0 && !sourceProfile) {
        setSourceProfile(data[0]);
      }
    }
  }

  function calculateResultingProfile() {
    if (!sourceProfile) return;

    const volumeGallons = batchSize;
    const volumeLiters = volumeGallons * 3.78541;

    const calciumFromGypsum = (adjustments.gypsum / volumeGallons) * 61.5;
    const sulfateFromGypsum = (adjustments.gypsum / volumeGallons) * 147.4;

    const calciumFromCaCl2 = (adjustments.calciumChloride / volumeGallons) * 72;
    const chlorideFromCaCl2 = (adjustments.calciumChloride / volumeGallons) * 127;

    const magnesiumFromEpsom = (adjustments.epsomSalt / volumeGallons) * 26;
    const sulfateFromEpsom = (adjustments.epsomSalt / volumeGallons) * 103;

    const sodiumFromBakingSoda = (adjustments.bakingSoda / volumeGallons) * 75;
    const bicarbonateFromBakingSoda = (adjustments.bakingSoda / volumeGallons) * 191;

    const calciumFromChalk = (adjustments.chalk / volumeGallons) * 105;
    const bicarbonateFromChalk = (adjustments.chalk / volumeGallons) * 158;

    const resulting: WaterProfile = {
      ...sourceProfile,
      calcium: sourceProfile.calcium + calciumFromGypsum + calciumFromCaCl2 + calciumFromChalk,
      magnesium: sourceProfile.magnesium + magnesiumFromEpsom,
      sodium: sourceProfile.sodium + sodiumFromBakingSoda,
      sulfate: sourceProfile.sulfate + sulfateFromGypsum + sulfateFromEpsom,
      chloride: sourceProfile.chloride + chlorideFromCaCl2,
      bicarbonate: sourceProfile.bicarbonate + bicarbonateFromBakingSoda + bicarbonateFromChalk,
    };

    const alkalinityChange =
      (adjustments.bakingSoda / volumeGallons) * 71.4 +
      (adjustments.chalk / volumeGallons) * 59 -
      (adjustments.lacticAcid * 0.88 / volumeLiters) * 36.5 -
      (adjustments.phosphoricAcid * 0.75 / volumeLiters) * 49;

    resulting.alkalinity = sourceProfile.alkalinity + alkalinityChange;

    const phChange = -alkalinityChange * 0.02;
    resulting.ph = Math.max(4, Math.min(9, sourceProfile.ph + phChange));

    setResultingProfile(resulting);
  }

  function autoCalculateAdjustments() {
    if (!sourceProfile || !targetProfile) return;

    const volumeGallons = batchSize;

    const calciumNeeded = Math.max(0, targetProfile.calcium - sourceProfile.calcium);
    const sulfateNeeded = Math.max(0, targetProfile.sulfate - sourceProfile.sulfate);
    const chlorideNeeded = Math.max(0, targetProfile.chloride - sourceProfile.chloride);
    const magnesiumNeeded = Math.max(0, targetProfile.magnesium - sourceProfile.magnesium);
    const bicarbonateNeeded = Math.max(0, targetProfile.bicarbonate - sourceProfile.bicarbonate);

    let gypsumAmount = 0;
    let cacl2Amount = 0;
    let epsomAmount = 0;
    let bakingSodaAmount = 0;

    if (sulfateNeeded > 0) {
      gypsumAmount = (sulfateNeeded * volumeGallons) / 147.4;
    }

    const calciumFromGypsum = gypsumAmount * 61.5 / volumeGallons;
    const remainingCalcium = Math.max(0, calciumNeeded - calciumFromGypsum);

    if (chlorideNeeded > 0 && remainingCalcium > 0) {
      cacl2Amount = Math.min(
        (chlorideNeeded * volumeGallons) / 127,
        (remainingCalcium * volumeGallons) / 72
      );
    }

    if (magnesiumNeeded > 0) {
      epsomAmount = (magnesiumNeeded * volumeGallons) / 26;
    }

    if (bicarbonateNeeded > 0) {
      bakingSodaAmount = (bicarbonateNeeded * volumeGallons) / 191;
    }

    setAdjustments({
      ...adjustments,
      gypsum: parseFloat(gypsumAmount.toFixed(2)),
      calciumChloride: parseFloat(cacl2Amount.toFixed(2)),
      epsomSalt: parseFloat(epsomAmount.toFixed(2)),
      bakingSoda: parseFloat(bakingSodaAmount.toFixed(2)),
    });
  }

  const sulfateToChlorideRatio = resultingProfile
    ? (resultingProfile.sulfate / Math.max(1, resultingProfile.chloride)).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Water Calculator</TabsTrigger>
          <TabsTrigger value="profiles">Water Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5" />
                Water Chemistry Calculator
              </CardTitle>
              <CardDescription>
                Calculate mineral additions to match your target water profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Source Water Profile</Label>
                  <Select
                    value={sourceProfile?.id}
                    onValueChange={(value) => {
                      const profile = waterProfiles.find(p => p.id === value);
                      if (profile) setSourceProfile(profile);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {waterProfiles.map(profile => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Profile (Optional)</Label>
                  <Select
                    value={targetProfile?.id || 'none'}
                    onValueChange={(value) => {
                      if (value === 'none') {
                        setTargetProfile(null);
                      } else {
                        const profile = waterProfiles.find(p => p.id === value);
                        if (profile) setTargetProfile(profile);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {waterProfiles.map(profile => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Batch Size (gal)</Label>
                  <Input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </div>
              </div>

              {targetProfile && (
                <Button onClick={autoCalculateAdjustments} className="w-full" variant="outline">
                  <Calculator className="mr-2 h-4 w-4" />
                  Auto-Calculate Additions
                </Button>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold">Mineral Additions (grams)</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Gypsum (CaSO₄)</Label>
                    <Input
                      type="number"
                      value={adjustments.gypsum}
                      onChange={(e) => setAdjustments({...adjustments, gypsum: parseFloat(e.target.value) || 0})}
                      step="0.1"
                    />
                    <p className="text-xs text-muted-foreground">Adds Ca, SO₄</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Calcium Chloride</Label>
                    <Input
                      type="number"
                      value={adjustments.calciumChloride}
                      onChange={(e) => setAdjustments({...adjustments, calciumChloride: parseFloat(e.target.value) || 0})}
                      step="0.1"
                    />
                    <p className="text-xs text-muted-foreground">Adds Ca, Cl</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Epsom Salt (MgSO₄)</Label>
                    <Input
                      type="number"
                      value={adjustments.epsomSalt}
                      onChange={(e) => setAdjustments({...adjustments, epsomSalt: parseFloat(e.target.value) || 0})}
                      step="0.1"
                    />
                    <p className="text-xs text-muted-foreground">Adds Mg, SO₄</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Baking Soda (NaHCO₃)</Label>
                    <Input
                      type="number"
                      value={adjustments.bakingSoda}
                      onChange={(e) => setAdjustments({...adjustments, bakingSoda: parseFloat(e.target.value) || 0})}
                      step="0.1"
                    />
                    <p className="text-xs text-muted-foreground">Adds Na, HCO₃</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Chalk (CaCO₃)</Label>
                    <Input
                      type="number"
                      value={adjustments.chalk}
                      onChange={(e) => setAdjustments({...adjustments, chalk: parseFloat(e.target.value) || 0})}
                      step="0.1"
                    />
                    <p className="text-xs text-muted-foreground">Adds Ca, HCO₃</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Lactic Acid (ml)</Label>
                    <Input
                      type="number"
                      value={adjustments.lacticAcid}
                      onChange={(e) => setAdjustments({...adjustments, lacticAcid: parseFloat(e.target.value) || 0})}
                      step="0.1"
                    />
                    <p className="text-xs text-muted-foreground">Lowers pH</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Phosphoric Acid (ml)</Label>
                    <Input
                      type="number"
                      value={adjustments.phosphoricAcid}
                      onChange={(e) => setAdjustments({...adjustments, phosphoricAcid: parseFloat(e.target.value) || 0})}
                      step="0.1"
                    />
                    <p className="text-xs text-muted-foreground">Lowers pH</p>
                  </div>
                </div>
              </div>

              {resultingProfile && (
                <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-semibold">Resulting Water Profile</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Calcium</Label>
                      <p className="text-lg font-semibold">{resultingProfile.calcium.toFixed(1)} ppm</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Magnesium</Label>
                      <p className="text-lg font-semibold">{resultingProfile.magnesium.toFixed(1)} ppm</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Sodium</Label>
                      <p className="text-lg font-semibold">{resultingProfile.sodium.toFixed(1)} ppm</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Sulfate</Label>
                      <p className="text-lg font-semibold">{resultingProfile.sulfate.toFixed(1)} ppm</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Chloride</Label>
                      <p className="text-lg font-semibold">{resultingProfile.chloride.toFixed(1)} ppm</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Bicarbonate</Label>
                      <p className="text-lg font-semibold">{resultingProfile.bicarbonate.toFixed(1)} ppm</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">pH</Label>
                      <p className="text-lg font-semibold">{resultingProfile.ph.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">SO₄:Cl Ratio</Label>
                      <p className="text-lg font-semibold">{sulfateToChlorideRatio}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Sulfate/Chloride Ratio Guidelines:</p>
                    <p>• 0.5-0.8: Balanced, malty beers</p>
                    <p>• 0.8-1.5: Balanced beers</p>
                    <p>• 1.5-3.0: Hoppy, bitter beers</p>
                    <p>• 3.0+: Very hoppy, aggressive bitterness</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles">
          <WaterProfileManager profiles={waterProfiles} onUpdate={loadWaterProfiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WaterProfileManager({ profiles, onUpdate }: { profiles: WaterProfile[]; onUpdate: () => void }) {
  const [newProfile, setNewProfile] = useState<Partial<WaterProfile>>({
    name: '',
    calcium: 0,
    magnesium: 0,
    sodium: 0,
    sulfate: 0,
    chloride: 0,
    bicarbonate: 0,
    ph: 7.0,
    alkalinity: 0,
  });

  async function handleAddProfile() {
    if (!newProfile.name) return;

    const { error } = await supabase
      .from('water_profiles')
      .insert([newProfile]);

    if (!error) {
      setNewProfile({
        name: '',
        calcium: 0,
        magnesium: 0,
        sodium: 0,
        sulfate: 0,
        chloride: 0,
        bicarbonate: 0,
        ph: 7.0,
        alkalinity: 0,
      });
      onUpdate();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Profiles</CardTitle>
        <CardDescription>Manage your water chemistry profiles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Add New Profile</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Profile Name</Label>
              <Input
                value={newProfile.name}
                onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                placeholder="e.g., Munich, Burton-on-Trent"
              />
            </div>
            <div className="space-y-2">
              <Label>Calcium (ppm)</Label>
              <Input
                type="number"
                value={newProfile.calcium}
                onChange={(e) => setNewProfile({...newProfile, calcium: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label>Magnesium (ppm)</Label>
              <Input
                type="number"
                value={newProfile.magnesium}
                onChange={(e) => setNewProfile({...newProfile, magnesium: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label>Sodium (ppm)</Label>
              <Input
                type="number"
                value={newProfile.sodium}
                onChange={(e) => setNewProfile({...newProfile, sodium: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label>Sulfate (ppm)</Label>
              <Input
                type="number"
                value={newProfile.sulfate}
                onChange={(e) => setNewProfile({...newProfile, sulfate: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label>Chloride (ppm)</Label>
              <Input
                type="number"
                value={newProfile.chloride}
                onChange={(e) => setNewProfile({...newProfile, chloride: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label>Bicarbonate (ppm)</Label>
              <Input
                type="number"
                value={newProfile.bicarbonate}
                onChange={(e) => setNewProfile({...newProfile, bicarbonate: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label>pH</Label>
              <Input
                type="number"
                value={newProfile.ph}
                onChange={(e) => setNewProfile({...newProfile, ph: parseFloat(e.target.value) || 7.0})}
                step="0.1"
              />
            </div>
          </div>
          <Button onClick={handleAddProfile} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Profile
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Existing Profiles</h3>
          <div className="space-y-2">
            {profiles.map(profile => (
              <div key={profile.id} className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">{profile.name}</h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ca:</span> {profile.calcium}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mg:</span> {profile.magnesium}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Na:</span> {profile.sodium}
                  </div>
                  <div>
                    <span className="text-muted-foreground">SO₄:</span> {profile.sulfate}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cl:</span> {profile.chloride}
                  </div>
                  <div>
                    <span className="text-muted-foreground">HCO₃:</span> {profile.bicarbonate}
                  </div>
                  <div>
                    <span className="text-muted-foreground">pH:</span> {profile.ph}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}