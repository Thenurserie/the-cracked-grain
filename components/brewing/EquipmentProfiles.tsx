'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  Droplets,
  RotateCcw,
  Zap,
  Award
} from 'lucide-react';
import { EquipmentProfile, EquipmentPreset } from '@/lib/equipment-types';
import { EQUIPMENT_PRESETS, PRESET_CATEGORIES } from '@/data/equipment-presets';

const TOOLTIPS = {
  boilOffRate: "How much water evaporates per hour. Electric systems are lower (~0.5-1.0 gal/hr), propane higher (~1.5 gal/hr)",
  grainAbsorption: "Water absorbed by grain. ~0.12 gal/lb typical, ~0.10 for BIAB (squeeze the bag)",
  trubLoss: "Wort left behind in kettle (hops, proteins). Varies with chiller type (0.4-0.75 gal typical)",
  deadSpace: "Volume below mash tun's false bottom or valve that cannot be drained",
  breweryEfficiency: "Overall efficiency from grain to fermenter. 70-75% is good for homebrewers",
  mashEfficiency: "Conversion efficiency during mashing. Usually 2-5% higher than brewery efficiency",
  waterGrainRatio: "Quarts of water per pound of grain in mash. 1.25-1.5 qt/lb is typical",
  boilVolume: "For partial boil extract: volume actually boiled. Add top-up water to reach batch size",
  topUpWater: "Cold water added to fermenter after boil to reach final batch volume (extract brewing)",
  hopUtilization: "Adjustment factor for hop bitterness. Partial boils extract less bitterness (~85%)"
};

export default function EquipmentProfiles() {
  const [profiles, setProfiles] = useState<EquipmentProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedPresetSlug, setSelectedPresetSlug] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<Omit<EquipmentProfile, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    slug: '',
    type: 'cooler',
    isPreset: false,
    batchVolume: 5,
    mashTunVolume: 10,
    kettleVolume: 10,
    fermenterVolume: 6.5,
    boilOffRate: 1.25,
    trubLoss: 0.5,
    mashTunDeadSpace: 0.5,
    grainAbsorption: 0.12,
    breweryEfficiency: 72,
    mashEfficiency: 75,
    waterGrainRatio: 1.5,
    boilTime: 60
  });

  // Load profiles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('equipmentProfilesV2');
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
    localStorage.setItem('equipmentProfilesV2', JSON.stringify(newProfiles));
  };

  // Create new profile
  const createProfile = () => {
    const newProfile: EquipmentProfile = {
      ...formData,
      id: Date.now().toString(),
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProfiles([...profiles, newProfile]);
    setIsCreating(false);
    resetForm();
  };

  // Update existing profile
  const updateProfile = (id: string) => {
    const updatedProfiles = profiles.map(p =>
      p.id === id
        ? {
            ...formData,
            id: p.id,
            slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
            createdAt: p.createdAt,
            updatedAt: new Date().toISOString()
          }
        : p
    );

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
      slug: `${profile.slug}-copy`,
      userId: undefined,
      isPreset: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProfiles([...profiles, duplicated]);
  };

  // Load preset
  const loadPreset = (category: string, slug: string) => {
    const preset = EQUIPMENT_PRESETS[category]?.find(p => p.slug === slug);
    if (preset) {
      setFormData(preset);
      setSelectedPresetSlug(slug);
      setIsCreating(true);
    }
  };

  // Reset to preset defaults (when editing a profile based on preset)
  const resetToPresetDefaults = () => {
    if (selectedPresetSlug) {
      const allPresets = Object.values(EQUIPMENT_PRESETS).flat();
      const preset = allPresets.find(p => p.slug === selectedPresetSlug);
      if (preset) {
        setFormData({ ...preset, name: formData.name });
      }
    }
  };

  // Edit profile
  const startEditing = (profile: EquipmentProfile) => {
    const { id, createdAt, updatedAt, ...rest } = profile;
    setFormData(rest);
    setEditingId(profile.id);
    setIsCreating(false);
    setSelectedPresetSlug(profile.slug);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      type: 'cooler',
      isPreset: false,
      batchVolume: 5,
      mashTunVolume: 10,
      kettleVolume: 10,
      fermenterVolume: 6.5,
      boilOffRate: 1.25,
      trubLoss: 0.5,
      mashTunDeadSpace: 0.5,
      grainAbsorption: 0.12,
      breweryEfficiency: 72,
      mashEfficiency: 75,
      waterGrainRatio: 1.5,
      boilTime: 60
    });
    setSelectedPresetSlug('');
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
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-background border border-amber/30 rounded px-3 py-2 text-xs text-cream w-64 z-10 shadow-lg">
        {text}
      </div>
    </div>
  );

  const defaultProfile = profiles.find(p => p.userId === 'default');

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
          <CardContent className="space-y-4 text-cream/80 text-sm">
            <p>
              Equipment profiles store your brewing system's specifications for accurate water, gravity, and efficiency calculations.
              Start with a preset that matches your equipment, then customize as needed.
            </p>
            <div>
              <h4 className="font-semibold text-cream mb-2">Measuring Your System:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Boil-Off Rate:</strong> Boil 5 gal water for 60 min, measure loss</li>
                <li><strong>Dead Space:</strong> Fill vessel, drain, measure what remains</li>
                <li><strong>Efficiency:</strong> Track 3-5 batches, compare actual vs predicted OG</li>
              </ul>
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
                  Create your first equipment profile to unlock accurate calculations. Start with a preset for your system!
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <Card
                  key={profile.id}
                  className="bg-card/50 border-amber/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-cream flex items-center gap-2 text-base">
                          {profile.name}
                          {profile.isPreset && (
                            <Award className="h-4 w-4 text-gold" title="Preset" />
                          )}
                        </CardTitle>
                        {profile.manufacturer && (
                          <p className="text-xs text-cream/50 mt-1">
                            {profile.manufacturer} {profile.model}
                          </p>
                        )}
                        <p className="text-xs text-cream/60 mt-1">
                          {profile.batchVolume} gal • {profile.breweryEfficiency}% efficiency
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-background/30 rounded p-2">
                        <div className="text-cream/60 mb-1">Type</div>
                        <div className="text-cream font-semibold capitalize">
                          {profile.type === 'all-in-one' ? 'All-in-One' : profile.type}
                        </div>
                      </div>

                      <div className="bg-background/30 rounded p-2">
                        <div className="text-cream/60 mb-1">Boil-Off</div>
                        <div className="text-cream font-semibold">
                          {profile.boilOffRate} gal/hr
                        </div>
                      </div>

                      {profile.voltage && (
                        <div className="bg-background/30 rounded p-2">
                          <div className="text-cream/60 mb-1">Power</div>
                          <div className="text-cream font-semibold flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {profile.voltage}
                          </div>
                        </div>
                      )}

                      <div className="bg-background/30 rounded p-2">
                        <div className="text-cream/60 mb-1">Grain Abs</div>
                        <div className="text-cream font-semibold">
                          {profile.grainAbsorption} gal/lb
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(profile)}
                        className="flex-1 border-amber/30 hover:bg-amber/10 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateProfile(profile)}
                        className="flex-1 border-amber/30 hover:bg-amber/10 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
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
              <div className="flex gap-2">
                {selectedPresetSlug && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToPresetDefaults}
                    className="border-amber/30 hover:bg-amber/10"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to Preset
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancel}
                  className="hover:bg-amber/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset Selector */}
            {isCreating && !editingId && (
              <div className="space-y-4 pb-6 border-b border-amber/20">
                <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold" />
                  Start with a Preset
                </h3>
                <div>
                  <Label className="text-cream">Choose Your Equipment</Label>
                  <Select onValueChange={(value) => {
                    const [category, slug] = value.split(':');
                    loadPreset(category, slug);
                  }}>
                    <SelectTrigger className="bg-background border-amber/30">
                      <SelectValue placeholder="Select a brewing system..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_CATEGORIES.map(category => (
                        <SelectGroup key={category.value}>
                          <SelectLabel>{category.label}</SelectLabel>
                          {EQUIPMENT_PRESETS[category.value]?.map(preset => (
                            <SelectItem key={preset.slug} value={`${category.value}:${preset.slug}`}>
                              {preset.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                      <SelectGroup>
                        <SelectLabel>Other</SelectLabel>
                        <SelectItem value="custom:custom">Custom (start from scratch)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cream">Profile Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-cream">Profile Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Brewing System"
                    className="bg-background border-amber/30"
                  />
                </div>
              </div>
            </div>

            {/* Volumes */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <Beaker className="h-5 w-5 text-gold" />
                Volumes & Capacity
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-cream">Batch Size (gal)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.batchVolume}
                    onChange={(e) => setFormData({ ...formData, batchVolume: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>

                <div>
                  <Label className="text-cream">Mash Tun (gal)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.mashTunVolume}
                    onChange={(e) => setFormData({ ...formData, mashTunVolume: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>

                <div>
                  <Label className="text-cream">Kettle (gal)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.kettleVolume}
                    onChange={(e) => setFormData({ ...formData, kettleVolume: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>

                <div>
                  <Label className="text-cream">Fermenter (gal)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.fermenterVolume}
                    onChange={(e) => setFormData({ ...formData, fermenterVolume: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>
              </div>
            </div>

            {/* Losses */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <Droplets className="h-5 w-5 text-gold" />
                Losses & Absorption
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-cream flex items-center">
                    Boil-Off (gal/hr)
                    <Tooltip text={TOOLTIPS.boilOffRate} />
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.boilOffRate}
                    onChange={(e) => setFormData({ ...formData, boilOffRate: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>

                <div>
                  <Label className="text-cream flex items-center">
                    Trub Loss (gal)
                    <Tooltip text={TOOLTIPS.trubLoss} />
                  </Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={formData.trubLoss}
                    onChange={(e) => setFormData({ ...formData, trubLoss: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>

                <div>
                  <Label className="text-cream flex items-center">
                    Dead Space (gal)
                    <Tooltip text={TOOLTIPS.deadSpace} />
                  </Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={formData.mashTunDeadSpace}
                    onChange={(e) => setFormData({ ...formData, mashTunDeadSpace: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>

                <div>
                  <Label className="text-cream flex items-center">
                    Grain Abs (gal/lb)
                    <Tooltip text={TOOLTIPS.grainAbsorption} />
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.grainAbsorption}
                    onChange={(e) => setFormData({ ...formData, grainAbsorption: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>
              </div>
            </div>

            {/* Efficiency */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-gold" />
                Efficiency
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-cream flex items-center">
                    Brewery Efficiency (%)
                    <Tooltip text={TOOLTIPS.breweryEfficiency} />
                  </Label>
                  <Input
                    type="number"
                    value={formData.breweryEfficiency}
                    onChange={(e) => setFormData({ ...formData, breweryEfficiency: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    min="50"
                    max="95"
                  />
                  <input
                    type="range"
                    value={formData.breweryEfficiency}
                    onChange={(e) => setFormData({ ...formData, breweryEfficiency: Number(e.target.value) })}
                    min="50"
                    max="90"
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label className="text-cream flex items-center">
                    Mash Efficiency (%)
                    <Tooltip text={TOOLTIPS.mashEfficiency} />
                  </Label>
                  <Input
                    type="number"
                    value={formData.mashEfficiency}
                    onChange={(e) => setFormData({ ...formData, mashEfficiency: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                    min="50"
                    max="95"
                  />
                  <input
                    type="range"
                    value={formData.mashEfficiency}
                    onChange={(e) => setFormData({ ...formData, mashEfficiency: Number(e.target.value) })}
                    min="50"
                    max="95"
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Mash Parameters */}
            <div className="space-y-4 pt-4 border-t border-amber/20">
              <h3 className="text-lg font-semibold text-cream flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-gold" />
                Mash Parameters
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-cream flex items-center">
                    Water/Grain (qt/lb)
                    <Tooltip text={TOOLTIPS.waterGrainRatio} />
                  </Label>
                  <Input
                    type="number"
                    step="0.25"
                    value={formData.waterGrainRatio}
                    onChange={(e) => setFormData({ ...formData, waterGrainRatio: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>

                <div>
                  <Label className="text-cream">Boil Time (min)</Label>
                  <Input
                    type="number"
                    value={formData.boilTime}
                    onChange={(e) => setFormData({ ...formData, boilTime: Number(e.target.value) })}
                    className="bg-background border-amber/30"
                  />
                </div>

                {formData.voltage && (
                  <div>
                    <Label className="text-cream">Voltage</Label>
                    <Select
                      value={formData.voltage}
                      onValueChange={(value: any) => setFormData({ ...formData, voltage: value })}
                    >
                      <SelectTrigger className="bg-background border-amber/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="110V">110V</SelectItem>
                        <SelectItem value="120V">120V</SelectItem>
                        <SelectItem value="240V">240V</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
    </div>
  );
}
