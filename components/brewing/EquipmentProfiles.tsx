'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Star,
  Plus,
  Edit,
  Trash2,
  Copy,
  Save,
  X,
  HelpCircle,
  Info,
  Beaker,
  FlaskConical,
  Thermometer,
  Droplets
} from 'lucide-react';

interface EquipmentProfile {
  id: string;
  name: string;
  isDefault: boolean;

  // Mash Tun
  mashTunType: 'cooler' | 'stainless' | 'aluminum' | 'biab';
  mashTunVolume: number;
  mashTunDeadSpace: number;
  mashTunHeatLoss: number;

  // Boil Kettle
  kettleVolume: number;
  kettleDeadSpace: number;
  boilOffRate: number;

  // Fermenter
  fermenterType: 'bucket' | 'carboy' | 'conical' | 'other';
  fermenterVolume: number;
  fermenterDeadSpace: number;

  // Efficiency
  mashEfficiency: number;
  breweryEfficiency: number;

  // Batch Size
  targetBatchSize: number;

  // Optional Equipment
  hasWortChiller: boolean;
  chillerType?: 'immersion' | 'counterflow' | 'plate';
  hasPump: boolean;
  hasSpargingSetup: boolean;

  createdAt: string;
  updatedAt: string;
}

const PRESET_PROFILES: Omit<EquipmentProfile, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: '5 Gallon Starter Kit',
    isDefault: false,
    mashTunType: 'cooler',
    mashTunVolume: 10,
    mashTunDeadSpace: 0.5,
    mashTunHeatLoss: 2,
    kettleVolume: 8,
    kettleDeadSpace: 0.5,
    boilOffRate: 1.0,
    fermenterType: 'bucket',
    fermenterVolume: 6.5,
    fermenterDeadSpace: 0.25,
    mashEfficiency: 70,
    breweryEfficiency: 68,
    targetBatchSize: 5,
    hasWortChiller: false,
    hasPump: false,
    hasSpargingSetup: true
  },
  {
    name: '5 Gallon All-Grain',
    isDefault: false,
    mashTunType: 'cooler',
    mashTunVolume: 10,
    mashTunDeadSpace: 0.5,
    mashTunHeatLoss: 2,
    kettleVolume: 10,
    kettleDeadSpace: 0.5,
    boilOffRate: 1.25,
    fermenterType: 'carboy',
    fermenterVolume: 6.5,
    fermenterDeadSpace: 0.5,
    mashEfficiency: 75,
    breweryEfficiency: 72,
    targetBatchSize: 5,
    hasWortChiller: true,
    chillerType: 'immersion',
    hasPump: false,
    hasSpargingSetup: true
  },
  {
    name: '10 Gallon System',
    isDefault: false,
    mashTunType: 'stainless',
    mashTunVolume: 20,
    mashTunDeadSpace: 0.75,
    mashTunHeatLoss: 3,
    kettleVolume: 15,
    kettleDeadSpace: 0.75,
    boilOffRate: 1.5,
    fermenterType: 'conical',
    fermenterVolume: 14,
    fermenterDeadSpace: 0.5,
    mashEfficiency: 78,
    breweryEfficiency: 75,
    targetBatchSize: 10,
    hasWortChiller: true,
    chillerType: 'counterflow',
    hasPump: true,
    hasSpargingSetup: true
  },
  {
    name: 'BIAB Setup',
    isDefault: false,
    mashTunType: 'biab',
    mashTunVolume: 10,
    mashTunDeadSpace: 0.25,
    mashTunHeatLoss: 4,
    kettleVolume: 10,
    kettleDeadSpace: 0.5,
    boilOffRate: 1.25,
    fermenterType: 'bucket',
    fermenterVolume: 6.5,
    fermenterDeadSpace: 0.25,
    mashEfficiency: 73,
    breweryEfficiency: 70,
    targetBatchSize: 5,
    hasWortChiller: true,
    chillerType: 'immersion',
    hasPump: false,
    hasSpargingSetup: false
  },
  {
    name: '3 Gallon Apartment Brewer',
    isDefault: false,
    mashTunType: 'cooler',
    mashTunVolume: 5,
    mashTunDeadSpace: 0.25,
    mashTunHeatLoss: 2,
    kettleVolume: 5,
    kettleDeadSpace: 0.25,
    boilOffRate: 0.75,
    fermenterType: 'carboy',
    fermenterVolume: 3,
    fermenterDeadSpace: 0.15,
    mashEfficiency: 72,
    breweryEfficiency: 69,
    targetBatchSize: 2.5,
    hasWortChiller: false,
    hasPump: false,
    hasSpargingSetup: true
  }
];

const TOOLTIPS = {
  deadSpace: "Volume of liquid that remains in the vessel and cannot be transferred (typically 0.25-0.75 gallons)",
  boilOffRate: "How much water evaporates per hour during a vigorous boil (measure by boiling water for 1 hour and checking volume loss)",
  mashEfficiency: "Percentage of potential sugars extracted from grain during mashing (70-80% typical for homebrewers)",
  breweryEfficiency: "Overall efficiency from grain to fermenter, accounting for all losses (usually 2-5% lower than mash efficiency)",
  trubLoss: "Volume lost to sediment (trub) in the fermenter, typically 0.25-0.5 gallons",
  heatLoss: "How many degrees Fahrenheit your mash tun loses per hour (coolers: 2-3°F, kettles: 5-8°F)"
};

export default function EquipmentProfiles() {
  const [profiles, setProfiles] = useState<EquipmentProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Omit<EquipmentProfile, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    isDefault: false,
    mashTunType: 'cooler',
    mashTunVolume: 10,
    mashTunDeadSpace: 0.5,
    mashTunHeatLoss: 2,
    kettleVolume: 10,
    kettleDeadSpace: 0.5,
    boilOffRate: 1.25,
    fermenterType: 'bucket',
    fermenterVolume: 6.5,
    fermenterDeadSpace: 0.25,
    mashEfficiency: 72,
    breweryEfficiency: 68,
    targetBatchSize: 5,
    hasWortChiller: false,
    hasPump: false,
    hasSpargingSetup: true
  });

  // Load profiles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('equipmentProfiles');
    if (saved) {
      try {
        setProfiles(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load equipment profiles:', e);
      }
    }
  }, []);

  // Save profiles to localStorage
  const saveProfiles = (newProfiles: EquipmentProfile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('equipmentProfiles', JSON.stringify(newProfiles));
  };

  // Create new profile
  const createProfile = () => {
    const newProfile: EquipmentProfile = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If this is set as default, unset others
    let updatedProfiles = formData.isDefault
      ? profiles.map(p => ({ ...p, isDefault: false }))
      : profiles;

    saveProfiles([...updatedProfiles, newProfile]);
    setIsCreating(false);
    resetForm();
  };

  // Update existing profile
  const updateProfile = (id: string) => {
    const updatedProfiles = profiles.map(p => {
      if (p.id === id) {
        return {
          ...formData,
          id: p.id,
          createdAt: p.createdAt,
          updatedAt: new Date().toISOString()
        };
      }
      // If setting this as default, unset others
      return formData.isDefault ? { ...p, isDefault: false } : p;
    });

    saveProfiles(updatedProfiles);
    setEditingId(null);
    resetForm();
  };

  // Delete profile
  const deleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this equipment profile?')) {
      saveProfiles(profiles.filter(p => p.id !== id));
    }
  };

  // Duplicate profile
  const duplicateProfile = (profile: EquipmentProfile) => {
    const duplicated: EquipmentProfile = {
      ...profile,
      id: Date.now().toString(),
      name: `${profile.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProfiles([...profiles, duplicated]);
  };

  // Set default profile
  const setDefaultProfile = (id: string) => {
    const updatedProfiles = profiles.map(p => ({
      ...p,
      isDefault: p.id === id,
      updatedAt: p.id === id ? new Date().toISOString() : p.updatedAt
    }));

    saveProfiles(updatedProfiles);
  };

  // Load preset
  const loadPreset = (preset: typeof PRESET_PROFILES[0]) => {
    setFormData(preset);
    setIsCreating(true);
  };

  // Edit profile
  const startEditing = (profile: EquipmentProfile) => {
    setFormData({
      name: profile.name,
      isDefault: profile.isDefault,
      mashTunType: profile.mashTunType,
      mashTunVolume: profile.mashTunVolume,
      mashTunDeadSpace: profile.mashTunDeadSpace,
      mashTunHeatLoss: profile.mashTunHeatLoss,
      kettleVolume: profile.kettleVolume,
      kettleDeadSpace: profile.kettleDeadSpace,
      boilOffRate: profile.boilOffRate,
      fermenterType: profile.fermenterType,
      fermenterVolume: profile.fermenterVolume,
      fermenterDeadSpace: profile.fermenterDeadSpace,
      mashEfficiency: profile.mashEfficiency,
      breweryEfficiency: profile.breweryEfficiency,
      targetBatchSize: profile.targetBatchSize,
      hasWortChiller: profile.hasWortChiller,
      chillerType: profile.chillerType,
      hasPump: profile.hasPump,
      hasSpargingSetup: profile.hasSpargingSetup
    });
    setEditingId(profile.id);
    setIsCreating(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      isDefault: false,
      mashTunType: 'cooler',
      mashTunVolume: 10,
      mashTunDeadSpace: 0.5,
      mashTunHeatLoss: 2,
      kettleVolume: 10,
      kettleDeadSpace: 0.5,
      boilOffRate: 1.25,
      fermenterType: 'bucket',
      fermenterVolume: 6.5,
      fermenterDeadSpace: 0.25,
      mashEfficiency: 72,
      breweryEfficiency: 68,
      targetBatchSize: 5,
      hasWortChiller: false,
      hasPump: false,
      hasSpargingSetup: true
    });
  };

  // Cancel editing/creating
  const cancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  // Tooltip component
  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-1">
      <HelpCircle className="h-4 w-4 text-cream/40 cursor-help" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-background border border-amber/30 rounded px-3 py-2 text-xs text-cream w-64 z-10">
        {text}
      </div>
    </div>
  );

  const defaultProfile = profiles.find(p => p.isDefault);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream">Equipment Profiles</h1>
          <p className="text-cream/70 mt-1">
            Save your brewing equipment specs for accurate calculations across all tools
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowInstructions(!showInstructions)}
          className="border-amber/30"
        >
          <Info className="h-4 w-4 mr-2" />
          {showInstructions ? 'Hide' : 'Show'} Instructions
        </Button>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <Card className="bg-amber/5 border-amber/20">
          <CardHeader>
            <CardTitle className="text-gold">How to Use Equipment Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-cream/80">
            <div>
              <h4 className="font-semibold text-cream mb-2">Why Equipment Profiles Matter</h4>
              <p className="text-sm">
                Every brewing system is unique. Dead space, boil-off rates, and efficiency vary based on your
                equipment. By creating an accurate profile, all brewing calculators will use your specific values,
                resulting in more predictable and consistent batches.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-2">How to Determine Your Efficiency</h4>
              <p className="text-sm mb-2">
                Efficiency measures how well you extract sugars from grain. To calculate:
              </p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Brew a batch and record your actual Original Gravity (OG)</li>
                <li>Compare actual OG to predicted OG from brewing software</li>
                <li>Efficiency % = (Actual OG / Predicted OG) × 100</li>
                <li>Track 3-5 batches and use the average</li>
              </ol>
              <p className="text-sm mt-2">
                Typical ranges: Extract brewing: 100%, All-grain beginners: 65-70%, Experienced: 75-80%
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-2">Measuring Dead Space</h4>
              <p className="text-sm">
                Fill your vessel with water and mark the level. Drain completely, then measure what's left in the
                bottom (or measure what you transferred out and subtract from starting volume). This is your dead space.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-2">Measuring Boil-Off Rate</h4>
              <p className="text-sm">
                Bring 5 gallons of water to a vigorous boil. Maintain that boil for exactly 60 minutes. Measure
                remaining volume. The difference is your boil-off rate per hour.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-2">When to Update Your Profile</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>After upgrading equipment</li>
                <li>After tracking 5+ batches and calculating average efficiency</li>
                <li>When switching brewing methods (e.g., from cooler mash tun to BIAB)</li>
                <li>If you consistently over/undershoot your target volumes or gravity</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preset Profiles */}
      {(isCreating || editingId) && (
        <Card className="bg-card/50 border-amber/20">
          <CardHeader>
            <CardTitle className="text-gold flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              Quick Start: Load a Preset Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {PRESET_PROFILES.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => loadPreset(preset)}
                  className="border-amber/30 hover:bg-amber/10 hover:border-gold text-left justify-start h-auto py-3"
                >
                  <div>
                    <div className="font-semibold text-cream text-sm">{preset.name}</div>
                    <div className="text-xs text-cream/60">{preset.targetBatchSize} gal batch</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile List */}
      {!isCreating && !editingId && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-cream">Your Equipment Profiles</h2>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gold hover:bg-amber"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Profile
            </Button>
          </div>

          {profiles.length === 0 ? (
            <Card className="bg-card/50 border-amber/20">
              <CardContent className="text-center py-12">
                <Beaker className="h-16 w-16 text-cream/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-cream mb-2">
                  No Equipment Profiles Yet
                </h3>
                <p className="text-cream/60 mb-6 max-w-md mx-auto">
                  Create your first equipment profile to unlock accurate calculations across all brewing tools.
                  Start with a preset or build your own from scratch.
                </p>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-gold hover:bg-amber"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile) => (
                <Card
                  key={profile.id}
                  className={`bg-card/50 ${
                    profile.isDefault ? 'border-gold' : 'border-amber/20'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-cream flex items-center gap-2">
                          {profile.name}
                          {profile.isDefault && (
                            <Star className="h-4 w-4 fill-gold text-gold" />
                          )}
                        </CardTitle>
                        <p className="text-xs text-cream/60 mt-1">
                          {profile.targetBatchSize} gal batch • {profile.breweryEfficiency}% efficiency
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!profile.isDefault && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDefaultProfile(profile.id)}
                            className="h-8 w-8 p-0 hover:bg-amber/10"
                            title="Set as default"
                          >
                            <Star className="h-4 w-4 text-cream/40" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-background/30 rounded p-2">
                        <div className="text-cream/60 text-xs mb-1">Mash Tun</div>
                        <div className="text-cream font-semibold capitalize">
                          {profile.mashTunType}
                        </div>
                        <div className="text-cream/60 text-xs">
                          {profile.mashTunVolume} gal
                        </div>
                      </div>

                      <div className="bg-background/30 rounded p-2">
                        <div className="text-cream/60 text-xs mb-1">Kettle</div>
                        <div className="text-cream font-semibold">
                          {profile.kettleVolume} gal
                        </div>
                        <div className="text-cream/60 text-xs">
                          {profile.boilOffRate} gal/hr boil-off
                        </div>
                      </div>

                      <div className="bg-background/30 rounded p-2">
                        <div className="text-cream/60 text-xs mb-1">Fermenter</div>
                        <div className="text-cream font-semibold capitalize">
                          {profile.fermenterType}
                        </div>
                        <div className="text-cream/60 text-xs">
                          {profile.fermenterVolume} gal
                        </div>
                      </div>

                      <div className="bg-background/30 rounded p-2">
                        <div className="text-cream/60 text-xs mb-1">Extras</div>
                        <div className="text-cream text-xs">
                          {profile.hasWortChiller && '✓ Chiller'}
                          {profile.hasPump && ' ✓ Pump'}
                          {profile.hasSpargingSetup && ' ✓ Sparge'}
                          {!profile.hasWortChiller && !profile.hasPump && !profile.hasSpargingSetup && 'None'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(profile)}
                        className="flex-1 border-amber/30 hover:bg-amber/10"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateProfile(profile)}
                        className="flex-1 border-amber/30 hover:bg-amber/10"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteProfile(profile.id)}
                        className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Profile Form */}
      {(isCreating || editingId) && (
        <Card className="bg-card/50 border-amber/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gold">
                {editingId ? 'Edit Equipment Profile' : 'Create Equipment Profile'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancel}
                className="hover:bg-amber/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <Save className="h-5 w-5 text-gold" />
                Profile Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name" className="text-cream">Profile Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My 5 Gallon Setup"
                    className="bg-background border-amber/30"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded border-amber/30"
                  />
                  <Label htmlFor="isDefault" className="text-cream cursor-pointer">
                    Set as default profile
                  </Label>
                </div>
              </div>
            </div>

            {/* Mash Tun */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-gold" />
                Mash Tun
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mashTunType" className="text-cream">Mash Tun Type</Label>
                  <Select
                    value={formData.mashTunType}
                    onValueChange={(value: any) => setFormData({ ...formData, mashTunType: value })}
                  >
                    <SelectTrigger className="bg-background border-amber/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cooler">Cooler/Igloo (Best Insulation)</SelectItem>
                      <SelectItem value="stainless">Stainless Steel Kettle</SelectItem>
                      <SelectItem value="aluminum">Aluminum Kettle</SelectItem>
                      <SelectItem value="biab">BIAB (Brew in a Bag)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mashTunVolume" className="text-cream">
                    Volume (gallons)
                  </Label>
                  <Input
                    id="mashTunVolume"
                    type="number"
                    value={formData.mashTunVolume}
                    onChange={(e) => setFormData({ ...formData, mashTunVolume: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    step="0.5"
                  />
                </div>

                <div>
                  <Label htmlFor="mashTunDeadSpace" className="text-cream flex items-center">
                    Dead Space (gallons)
                    <Tooltip text={TOOLTIPS.deadSpace} />
                  </Label>
                  <Input
                    id="mashTunDeadSpace"
                    type="number"
                    value={formData.mashTunDeadSpace}
                    onChange={(e) => setFormData({ ...formData, mashTunDeadSpace: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="mashTunHeatLoss" className="text-cream flex items-center">
                    Heat Loss (°F/hour)
                    <Tooltip text={TOOLTIPS.heatLoss} />
                  </Label>
                  <Input
                    id="mashTunHeatLoss"
                    type="number"
                    value={formData.mashTunHeatLoss}
                    onChange={(e) => setFormData({ ...formData, mashTunHeatLoss: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            {/* Boil Kettle */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-gold" />
                Boil Kettle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="kettleVolume" className="text-cream">
                    Volume (gallons)
                  </Label>
                  <Input
                    id="kettleVolume"
                    type="number"
                    value={formData.kettleVolume}
                    onChange={(e) => setFormData({ ...formData, kettleVolume: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    step="0.5"
                  />
                </div>

                <div>
                  <Label htmlFor="kettleDeadSpace" className="text-cream flex items-center">
                    Dead Space (gallons)
                    <Tooltip text={TOOLTIPS.deadSpace} />
                  </Label>
                  <Input
                    id="kettleDeadSpace"
                    type="number"
                    value={formData.kettleDeadSpace}
                    onChange={(e) => setFormData({ ...formData, kettleDeadSpace: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="boilOffRate" className="text-cream flex items-center">
                    Boil-Off Rate (gal/hr)
                    <Tooltip text={TOOLTIPS.boilOffRate} />
                  </Label>
                  <Input
                    id="boilOffRate"
                    type="number"
                    value={formData.boilOffRate}
                    onChange={(e) => setFormData({ ...formData, boilOffRate: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Fermenter */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <Beaker className="h-5 w-5 text-gold" />
                Fermenter
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fermenterType" className="text-cream">Fermenter Type</Label>
                  <Select
                    value={formData.fermenterType}
                    onValueChange={(value: any) => setFormData({ ...formData, fermenterType: value })}
                  >
                    <SelectTrigger className="bg-background border-amber/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bucket">Bucket</SelectItem>
                      <SelectItem value="carboy">Carboy (Glass/Plastic)</SelectItem>
                      <SelectItem value="conical">Conical Fermenter</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fermenterVolume" className="text-cream">
                    Volume (gallons)
                  </Label>
                  <Input
                    id="fermenterVolume"
                    type="number"
                    value={formData.fermenterVolume}
                    onChange={(e) => setFormData({ ...formData, fermenterVolume: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    step="0.5"
                  />
                </div>

                <div>
                  <Label htmlFor="fermenterDeadSpace" className="text-cream flex items-center">
                    Trub Loss (gallons)
                    <Tooltip text={TOOLTIPS.trubLoss} />
                  </Label>
                  <Input
                    id="fermenterDeadSpace"
                    type="number"
                    value={formData.fermenterDeadSpace}
                    onChange={(e) => setFormData({ ...formData, fermenterDeadSpace: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    step="0.05"
                  />
                </div>
              </div>
            </div>

            {/* Efficiency */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <Droplets className="h-5 w-5 text-gold" />
                Efficiency
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mashEfficiency" className="text-cream flex items-center">
                    Mash Efficiency (%)
                    <Tooltip text={TOOLTIPS.mashEfficiency} />
                  </Label>
                  <Input
                    id="mashEfficiency"
                    type="number"
                    value={formData.mashEfficiency}
                    onChange={(e) => setFormData({ ...formData, mashEfficiency: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    min="50"
                    max="100"
                    step="1"
                  />
                  <div className="mt-2">
                    <input
                      type="range"
                      value={formData.mashEfficiency}
                      onChange={(e) => setFormData({ ...formData, mashEfficiency: Number(e.target.value) })}
                      min="50"
                      max="90"
                      step="1"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-cream/60 mt-1">
                      <span>50%</span>
                      <span>90%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="breweryEfficiency" className="text-cream flex items-center">
                    Brewery Efficiency (%)
                    <Tooltip text={TOOLTIPS.breweryEfficiency} />
                  </Label>
                  <Input
                    id="breweryEfficiency"
                    type="number"
                    value={formData.breweryEfficiency}
                    onChange={(e) => setFormData({ ...formData, breweryEfficiency: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    min="50"
                    max="100"
                    step="1"
                  />
                  <div className="mt-2">
                    <input
                      type="range"
                      value={formData.breweryEfficiency}
                      onChange={(e) => setFormData({ ...formData, breweryEfficiency: Number(e.target.value) })}
                      min="50"
                      max="90"
                      step="1"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-cream/60 mt-1">
                      <span>50%</span>
                      <span>90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Batch */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream">Target Batch Size</h3>
              <div>
                <Label htmlFor="targetBatchSize" className="text-cream">
                  Batch Size (gallons into fermenter)
                </Label>
                <Input
                  id="targetBatchSize"
                  type="number"
                  value={formData.targetBatchSize}
                  onChange={(e) => setFormData({ ...formData, targetBatchSize: Number(e.target.value) })}
                  className="bg-background border-amber/30"
                  step="0.5"
                />
              </div>
            </div>

            {/* Additional Equipment */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream">Additional Equipment</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasWortChiller"
                    checked={formData.hasWortChiller}
                    onChange={(e) => setFormData({ ...formData, hasWortChiller: e.target.checked })}
                    className="rounded border-amber/30"
                  />
                  <Label htmlFor="hasWortChiller" className="text-cream cursor-pointer flex-1">
                    Wort Chiller
                  </Label>
                  {formData.hasWortChiller && (
                    <Select
                      value={formData.chillerType}
                      onValueChange={(value: any) => setFormData({ ...formData, chillerType: value })}
                    >
                      <SelectTrigger className="w-[180px] bg-background border-amber/30">
                        <SelectValue placeholder="Chiller type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immersion">Immersion</SelectItem>
                        <SelectItem value="counterflow">Counterflow</SelectItem>
                        <SelectItem value="plate">Plate Chiller</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasPump"
                    checked={formData.hasPump}
                    onChange={(e) => setFormData({ ...formData, hasPump: e.target.checked })}
                    className="rounded border-amber/30"
                  />
                  <Label htmlFor="hasPump" className="text-cream cursor-pointer">
                    Pump (for wort transfer)
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasSpargingSetup"
                    checked={formData.hasSpargingSetup}
                    onChange={(e) => setFormData({ ...formData, hasSpargingSetup: e.target.checked })}
                    className="rounded border-amber/30"
                  />
                  <Label htmlFor="hasSpargingSetup" className="text-cream cursor-pointer">
                    Sparging Setup (fly or batch sparge)
                  </Label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => editingId ? updateProfile(editingId) : createProfile()}
                className="flex-1 bg-gold hover:bg-amber"
                disabled={!formData.name.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update Profile' : 'Create Profile'}
              </Button>
              <Button
                onClick={cancel}
                variant="outline"
                className="border-amber/30 hover:bg-amber/10"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Default Profile Notice */}
      {!isCreating && !editingId && defaultProfile && (
        <Card className="bg-gradient-to-br from-gold/10 to-amber/5 border-gold/30">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 fill-gold text-gold flex-shrink-0" />
              <div>
                <p className="text-cream font-semibold">
                  {defaultProfile.name} is your default profile
                </p>
                <p className="text-sm text-cream/70">
                  This profile will be automatically used in Recipe Builder, Mash Schedule Designer, and other brewing tools.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
