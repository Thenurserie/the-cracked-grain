'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Play,
  Pause,
  Plus,
  Trash2,
  GripVertical,
  Copy,
  Save,
  Clock,
  Thermometer,
  Beaker,
  Info
} from 'lucide-react';

interface MashStep {
  id: string;
  name: string;
  temperature: number;
  duration: number;
  infusionWater?: number;
  infusionTemp?: number;
}

interface SavedSchedule {
  name: string;
  grainWeight: number;
  grainTemp: number;
  waterRatio: number;
  targetTemp: number;
  mashTunMaterial: string;
  steps: MashStep[];
}

const PRESET_SCHEDULES = {
  'single-infusion': {
    name: 'Single Infusion (Standard)',
    steps: [
      { id: '1', name: 'Saccharification Rest', temperature: 152, duration: 60 }
    ]
  },
  'british-ale': {
    name: 'British Ale',
    steps: [
      { id: '1', name: 'Saccharification Rest', temperature: 154, duration: 60 }
    ]
  },
  'american-ipa': {
    name: 'American IPA (Dry Finish)',
    steps: [
      { id: '1', name: 'Saccharification Rest', temperature: 148, duration: 60 },
      { id: '2', name: 'Mash Out', temperature: 168, duration: 10 }
    ]
  },
  'german-step': {
    name: 'German Step Mash',
    steps: [
      { id: '1', name: 'Protein Rest', temperature: 122, duration: 20 },
      { id: '2', name: 'Saccharification Rest', temperature: 152, duration: 60 },
      { id: '3', name: 'Mash Out', temperature: 168, duration: 10 }
    ]
  },
  'belgian-step': {
    name: 'Belgian Step Mash',
    steps: [
      { id: '1', name: 'Beta Rest', temperature: 145, duration: 30 },
      { id: '2', name: 'Alpha Rest', temperature: 158, duration: 40 },
      { id: '3', name: 'Mash Out', temperature: 168, duration: 10 }
    ]
  },
  'hefeweizen': {
    name: 'Hefeweizen (Ferulic Acid)',
    steps: [
      { id: '1', name: 'Ferulic Acid Rest', temperature: 113, duration: 15 },
      { id: '2', name: 'Protein Rest', temperature: 122, duration: 15 },
      { id: '3', name: 'Saccharification Rest', temperature: 152, duration: 60 },
      { id: '4', name: 'Mash Out', temperature: 168, duration: 10 }
    ]
  }
};

const STEP_PRESETS = [
  { name: 'Acid Rest', temp: 104, duration: 20 },
  { name: 'Ferulic Acid Rest', temp: 113, duration: 15 },
  { name: 'Protein Rest', temp: 122, duration: 20 },
  { name: 'Beta Rest (Dry/Fermentable)', temp: 146, duration: 30 },
  { name: 'Saccharification Rest', temp: 152, duration: 60 },
  { name: 'Alpha Rest (Full Body)', temp: 158, duration: 40 },
  { name: 'Mash Out', temp: 168, duration: 10 }
];

export default function MashScheduleDesigner() {
  // Input states
  const [grainWeight, setGrainWeight] = useState<number>(10);
  const [grainTemp, setGrainTemp] = useState<number>(70);
  const [waterRatio, setWaterRatio] = useState<number>(1.5);
  const [targetTemp, setTargetTemp] = useState<number>(152);
  const [mashTunMaterial, setMashTunMaterial] = useState<string>('cooler');
  const [preheatTun, setPreheatTun] = useState<boolean>(true);
  const [targetPreBoilVolume, setTargetPreBoilVolume] = useState<number>(6.5);

  // Mash steps
  const [mashSteps, setMashSteps] = useState<MashStep[]>([
    { id: '1', name: 'Saccharification Rest', temperature: 152, duration: 60 }
  ]);

  // Timer states
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalElapsed, setTotalElapsed] = useState<number>(0);

  // UI states
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);

  // Load saved schedules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mashSchedules');
    if (saved) {
      try {
        setSavedSchedules(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved schedules:', e);
      }
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Step complete
            if (currentStepIndex < mashSteps.length - 1) {
              // Auto-advance to next step
              const nextStep = mashSteps[currentStepIndex + 1];
              setCurrentStepIndex(currentStepIndex + 1);
              return nextStep.duration * 60;
            } else {
              // All steps complete
              setIsRunning(false);
              setCurrentStepIndex(-1);
              playAlert();
              return 0;
            }
          }
          return prev - 1;
        });
        setTotalElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentStepIndex, mashSteps]);

  // Play audio alert
  const playAlert = useCallback(() => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  // Calculate strike water temperature
  const calculateStrikeTemp = (): number => {
    const adjustment = preheatTun ? 0 : 5; // Add 5°F if not preheating
    return (0.2 / waterRatio) * (targetTemp - grainTemp) + targetTemp + adjustment;
  };

  // Calculate strike water volume (in gallons)
  const calculateStrikeVolume = (): number => {
    return (grainWeight * waterRatio) / 4; // Convert quarts to gallons
  };

  // Calculate infusion water for temperature step
  const calculateInfusion = (currentTemp: number, targetTemp: number, currentVolume: number): { volume: number; temp: number } => {
    const Tw = 212; // Boiling water
    const volume = ((targetTemp - currentTemp) * (0.2 * grainWeight + currentVolume)) / (Tw - targetTemp);
    return {
      volume: Math.max(0, volume),
      temp: Tw
    };
  };

  // Calculate grain absorption
  const calculateGrainAbsorption = (): number => {
    return grainWeight * 0.125; // 0.125 gallons per pound
  };

  // Calculate sparge water
  const calculateSpargeWater = (): number => {
    const strikeVolume = calculateStrikeVolume();
    const absorption = calculateGrainAbsorption();

    // Calculate total infusion additions
    let totalInfusions = 0;
    let currentVolume = strikeVolume;
    let currentTemp = mashSteps[0]?.temperature || targetTemp;

    mashSteps.forEach((step, index) => {
      if (index > 0 && step.temperature > currentTemp) {
        const infusion = calculateInfusion(currentTemp, step.temperature, currentVolume);
        totalInfusions += infusion.volume;
        currentVolume += infusion.volume;
      }
      currentTemp = step.temperature;
    });

    return Math.max(0, targetPreBoilVolume - strikeVolume - totalInfusions + absorption);
  };

  // Calculate total mash time
  const calculateTotalTime = (): number => {
    return mashSteps.reduce((sum, step) => sum + step.duration, 0);
  };

  // Add a new mash step
  const addStep = (preset: typeof STEP_PRESETS[0]) => {
    const newStep: MashStep = {
      id: Date.now().toString(),
      name: preset.name,
      temperature: preset.temp,
      duration: preset.duration
    };
    setMashSteps([...mashSteps, newStep]);
  };

  // Remove a mash step
  const removeStep = (id: string) => {
    setMashSteps(mashSteps.filter(step => step.id !== id));
  };

  // Update a mash step
  const updateStep = (id: string, field: keyof MashStep, value: any) => {
    setMashSteps(mashSteps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  // Load a preset schedule
  const loadPreset = (presetKey: string) => {
    const preset = PRESET_SCHEDULES[presetKey as keyof typeof PRESET_SCHEDULES];
    if (preset) {
      setMashSteps(preset.steps.map(s => ({ ...s, id: Date.now().toString() + Math.random() })));
      // Adjust target temp to first step temp
      if (preset.steps[0]) {
        setTargetTemp(preset.steps[0].temperature);
      }
    }
  };

  // Start the mash timer
  const startMash = () => {
    if (mashSteps.length > 0) {
      setCurrentStepIndex(0);
      setTimeRemaining(mashSteps[0].duration * 60);
      setTotalElapsed(0);
      setIsRunning(true);
    }
  };

  // Toggle pause
  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  // Start specific step
  const startStep = (index: number) => {
    setCurrentStepIndex(index);
    setTimeRemaining(mashSteps[index].duration * 60);
    setIsRunning(true);
  };

  // Save current schedule
  const saveSchedule = () => {
    const name = prompt('Enter a name for this mash schedule:');
    if (name) {
      const schedule: SavedSchedule = {
        name,
        grainWeight,
        grainTemp,
        waterRatio,
        targetTemp,
        mashTunMaterial,
        steps: mashSteps
      };

      const updated = [...savedSchedules, schedule];
      setSavedSchedules(updated);
      localStorage.setItem('mashSchedules', JSON.stringify(updated));
    }
  };

  // Load saved schedule
  const loadSchedule = (schedule: SavedSchedule) => {
    setGrainWeight(schedule.grainWeight);
    setGrainTemp(schedule.grainTemp);
    setWaterRatio(schedule.waterRatio);
    setTargetTemp(schedule.targetTemp);
    setMashTunMaterial(schedule.mashTunMaterial);
    setMashSteps(schedule.steps);
  };

  // Copy summary to clipboard
  const copySummary = () => {
    const summary = `
MASH SCHEDULE
=============

Strike Water: ${calculateStrikeVolume().toFixed(1)} gallons @ ${calculateStrikeTemp().toFixed(1)}°F

Mash Steps:
${mashSteps.map((step, i) => `${i + 1}. ${step.name}: ${step.temperature}°F for ${step.duration} minutes`).join('\n')}

Sparge Water: ${calculateSpargeWater().toFixed(1)} gallons @ 168°F

Total Mash Time: ${calculateTotalTime()} minutes
    `.trim();

    navigator.clipboard.writeText(summary);
    alert('Mash schedule copied to clipboard!');
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const strikeTemp = calculateStrikeTemp();
  const strikeVolume = calculateStrikeVolume();
  const spargeWater = calculateSpargeWater();
  const totalTime = calculateTotalTime();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream">Mash Schedule Designer</h1>
          <p className="text-cream/70 mt-1">
            Design and execute your all-grain mash schedules with precision
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
            <CardTitle className="text-gold">How to Use This Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-cream/80">
            <div>
              <h4 className="font-semibold text-cream mb-2">What is Mashing?</h4>
              <p className="text-sm">
                Mashing is the process of combining crushed malted grains with hot water to convert starches into
                fermentable sugars. Different temperature rests activate different enzymes, allowing precise control
                over your beer's fermentability, body, and character.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-2">Single Infusion vs Step Mashing</h4>
              <p className="text-sm">
                <strong>Single Infusion:</strong> One temperature rest (typically 148-158°F for 60 minutes). Simple,
                effective, works for 90% of beers. Lower temps = drier beer, higher temps = fuller body.
              </p>
              <p className="text-sm mt-2">
                <strong>Step Mashing:</strong> Multiple temperature rests targeting specific enzymes. Used for traditional
                lagers, wheat beers, or when using under-modified malts. More time-consuming but creates complex profiles.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-2">Key Temperature Ranges</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>104-113°F (Acid Rest):</strong> Lowers mash pH naturally (rarely used)</li>
                <li><strong>113-131°F (Protein Rest):</strong> Improves head retention and clarity, essential for wheat beers</li>
                <li><strong>144-149°F (Beta Rest):</strong> Produces highly fermentable sugars, creates dry beer</li>
                <li><strong>154-162°F (Alpha Rest):</strong> Produces less fermentable sugars, creates fuller body</li>
                <li><strong>168-170°F (Mash Out):</strong> Stops enzyme activity, improves lautering</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-cream mb-2">Tips for Success</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Preheat your mash tun with hot water to avoid temperature loss during dough-in</li>
                <li>Stir constantly while adding grain to prevent dough balls</li>
                <li>Insulate your mash tun well to maintain temperature throughout the rest</li>
                <li>For step mashing, add small amounts of boiling water to raise temperature between steps</li>
                <li>Always verify temperatures with a reliable thermometer</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preset Schedules */}
      <Card className="bg-card/50 border-amber/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Quick Start: Load a Preset Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(PRESET_SCHEDULES).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                onClick={() => loadPreset(key)}
                className="border-amber/30 hover:bg-amber/10 hover:border-gold text-left justify-start h-auto py-3"
              >
                <div>
                  <div className="font-semibold text-cream">{preset.name}</div>
                  <div className="text-xs text-cream/60">{preset.steps.length} step{preset.steps.length > 1 ? 's' : ''}</div>
                </div>
              </Button>
            ))}
          </div>

          {savedSchedules.length > 0 && (
            <div className="mt-4 pt-4 border-t border-amber/20">
              <h4 className="text-sm font-semibold text-cream mb-2">Your Saved Schedules</h4>
              <div className="space-y-2">
                {savedSchedules.map((schedule, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => loadSchedule(schedule)}
                    className="w-full border-amber/30 hover:bg-amber/10 text-left justify-start"
                  >
                    <Save className="h-4 w-4 mr-2 text-gold" />
                    <div className="flex-1">
                      <div className="font-semibold text-cream">{schedule.name}</div>
                      <div className="text-xs text-cream/60">
                        {schedule.grainWeight} lbs grain, {schedule.steps.length} steps
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <Card className="bg-card/50 border-amber/20">
            <CardHeader>
              <CardTitle className="text-gold">Mash Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grainWeight" className="text-cream">Grain Bill Weight (lbs)</Label>
                  <Input
                    id="grainWeight"
                    type="number"
                    value={grainWeight}
                    onChange={(e) => setGrainWeight(Number(e.target.value))}
                    className="bg-background border-amber/30"
                    step="0.1"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="grainTemp" className="text-cream">Grain Temperature (°F)</Label>
                  <Input
                    id="grainTemp"
                    type="number"
                    value={grainTemp}
                    onChange={(e) => setGrainTemp(Number(e.target.value))}
                    className="bg-background border-amber/30"
                    step="1"
                  />
                </div>

                <div>
                  <Label htmlFor="waterRatio" className="text-cream">Water to Grain Ratio (qt/lb)</Label>
                  <Input
                    id="waterRatio"
                    type="number"
                    value={waterRatio}
                    onChange={(e) => setWaterRatio(Number(e.target.value))}
                    className="bg-background border-amber/30"
                    step="0.1"
                    min="0.5"
                    max="3"
                  />
                  <p className="text-xs text-cream/60 mt-1">
                    1.25 = thick mash (drier beer), 1.5 = standard, 2.0 = thin mash
                  </p>
                </div>

                <div>
                  <Label htmlFor="targetTemp" className="text-cream">Initial Target Temp (°F)</Label>
                  <Input
                    id="targetTemp"
                    type="number"
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(Number(e.target.value))}
                    className="bg-background border-amber/30"
                    step="1"
                  />
                </div>

                <div>
                  <Label htmlFor="mashTunMaterial" className="text-cream">Mash Tun Material</Label>
                  <Select value={mashTunMaterial} onValueChange={setMashTunMaterial}>
                    <SelectTrigger className="bg-background border-amber/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cooler">Cooler/Plastic (Best Insulation)</SelectItem>
                      <SelectItem value="stainless">Stainless Steel</SelectItem>
                      <SelectItem value="aluminum">Aluminum Kettle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preBoilVolume" className="text-cream">Target Pre-Boil Volume (gal)</Label>
                  <Input
                    id="preBoilVolume"
                    type="number"
                    value={targetPreBoilVolume}
                    onChange={(e) => setTargetPreBoilVolume(Number(e.target.value))}
                    className="bg-background border-amber/30"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="preheatTun"
                  checked={preheatTun}
                  onChange={(e) => setPreheatTun(e.target.checked)}
                  className="rounded border-amber/30"
                />
                <Label htmlFor="preheatTun" className="text-cream cursor-pointer">
                  Pre-heat mash tun (recommended)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Strike Water Calculator */}
          <Card className="bg-gradient-to-br from-amber/10 to-amber/5 border-amber/30">
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Strike Water Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background/50 rounded-lg p-6 text-center">
                <p className="text-2xl font-bold text-gold mb-2">
                  Heat {strikeVolume.toFixed(1)} gallons to {strikeTemp.toFixed(1)}°F
                </p>
                <p className="text-sm text-cream/70">
                  This will achieve your target mash temperature of {targetTemp}°F
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="bg-background/30 rounded p-3">
                  <div className="text-cream/60">Strike Volume</div>
                  <div className="text-lg font-semibold text-cream">{strikeVolume.toFixed(2)} gal</div>
                  <div className="text-xs text-cream/50">{(strikeVolume * 4).toFixed(1)} quarts</div>
                </div>
                <div className="bg-background/30 rounded p-3">
                  <div className="text-cream/60">Strike Temperature</div>
                  <div className="text-lg font-semibold text-cream">{strikeTemp.toFixed(1)}°F</div>
                  <div className="text-xs text-cream/50">Target: {targetTemp}°F</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mash Steps Builder */}
          <Card className="bg-card/50 border-amber/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Mash Steps
                </span>
                <Select onValueChange={(value) => {
                  const preset = STEP_PRESETS.find(p => p.name === value);
                  if (preset) addStep(preset);
                }}>
                  <SelectTrigger className="w-[200px] bg-background border-amber/30">
                    <SelectValue placeholder="Add Step..." />
                  </SelectTrigger>
                  <SelectContent>
                    {STEP_PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        <div className="flex items-center gap-2">
                          <Plus className="h-3 w-3" />
                          {preset.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mashSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`border rounded-lg p-4 ${
                    currentStepIndex === index
                      ? 'border-gold bg-amber/10'
                      : 'border-amber/20 bg-background/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-2">
                      <GripVertical className="h-5 w-5 text-cream/40" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs text-cream/60">Step Name</Label>
                          <Input
                            value={step.name}
                            onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                            className="bg-background border-amber/30 text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-cream/60">Temperature (°F)</Label>
                          <Input
                            type="number"
                            value={step.temperature}
                            onChange={(e) => updateStep(step.id, 'temperature', Number(e.target.value))}
                            className="bg-background border-amber/30 text-sm"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-cream/60">Duration (min)</Label>
                          <Input
                            type="number"
                            value={step.duration}
                            onChange={(e) => updateStep(step.id, 'duration', Number(e.target.value))}
                            className="bg-background border-amber/30 text-sm"
                          />
                        </div>
                      </div>

                      {currentStepIndex === index && (
                        <div className="bg-amber/10 rounded p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              onClick={togglePause}
                              className="bg-gold hover:bg-amber"
                            >
                              {isRunning ? (
                                <><Pause className="h-4 w-4 mr-1" /> Pause</>
                              ) : (
                                <><Play className="h-4 w-4 mr-1" /> Resume</>
                              )}
                            </Button>
                            <div>
                              <div className="text-2xl font-bold text-gold">
                                {formatTime(timeRemaining)}
                              </div>
                              <div className="text-xs text-cream/60">Time Remaining</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStepIndex !== index && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startStep(index)}
                            className="border-amber/30 hover:bg-amber/10"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start This Step
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeStep(step.id)}
                            className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                            disabled={mashSteps.length === 1}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {mashSteps.length === 0 && (
                <div className="text-center py-8 text-cream/60">
                  <p>No mash steps defined. Add a step to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visual Timeline */}
          <Card className="bg-card/50 border-amber/20">
            <CardHeader>
              <CardTitle className="text-gold">Mash Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background/30 rounded-lg p-6">
                <div className="relative h-48">
                  {/* Y-axis (temperature) */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-cream/60">
                    <span>170°F</span>
                    <span>150°F</span>
                    <span>130°F</span>
                    <span>110°F</span>
                  </div>

                  {/* Timeline bars */}
                  <div className="absolute left-16 right-0 top-0 bottom-8 flex items-end gap-1">
                    {mashSteps.map((step, index) => {
                      const height = ((step.temperature - 100) / 70) * 100; // Scale to percentage
                      const width = (step.duration / totalTime) * 100;

                      return (
                        <div
                          key={step.id}
                          className={`relative group ${
                            currentStepIndex === index ? 'opacity-100' : 'opacity-70'
                          }`}
                          style={{ width: `${width}%` }}
                        >
                          <div
                            className={`w-full rounded-t transition-all ${
                              currentStepIndex === index
                                ? 'bg-gold'
                                : index % 2 === 0
                                ? 'bg-amber/60'
                                : 'bg-amber/40'
                            }`}
                            style={{ height: `${height}%` }}
                          />

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-background border border-amber/30 rounded px-2 py-1 text-xs whitespace-nowrap z-10">
                            <div className="font-semibold text-cream">{step.name}</div>
                            <div className="text-cream/60">{step.temperature}°F / {step.duration}min</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis (time) */}
                  <div className="absolute left-16 right-0 bottom-0 h-6 flex justify-between text-xs text-cream/60">
                    <span>0</span>
                    <span>{Math.round(totalTime / 4)}</span>
                    <span>{Math.round(totalTime / 2)}</span>
                    <span>{Math.round(3 * totalTime / 4)}</span>
                    <span>{totalTime} min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Timer */}
        <div className="space-y-6">
          {/* Master Timer */}
          <Card className="bg-gradient-to-br from-gold/20 to-amber/10 border-gold/40">
            <CardHeader>
              <CardTitle className="text-gold">Mash Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStepIndex === -1 ? (
                <Button
                  onClick={startMash}
                  className="w-full bg-gold hover:bg-amber text-white py-6 text-lg"
                  disabled={mashSteps.length === 0}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Mash
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-cream/60 mb-1">Current Step</div>
                    <div className="text-lg font-semibold text-cream mb-2">
                      {mashSteps[currentStepIndex]?.name}
                    </div>
                    <div className="text-4xl font-bold text-gold mb-1">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm text-cream/60">
                      Step {currentStepIndex + 1} of {mashSteps.length}
                    </div>
                  </div>

                  <div className="bg-background/30 rounded p-3 text-center">
                    <div className="text-xs text-cream/60">Total Elapsed</div>
                    <div className="text-xl font-semibold text-cream">
                      {formatTime(totalElapsed)}
                    </div>
                  </div>

                  <Button
                    onClick={togglePause}
                    variant="outline"
                    className="w-full border-gold/40 hover:bg-gold/10"
                  >
                    {isRunning ? (
                      <><Pause className="h-4 w-4 mr-2" /> Pause</>
                    ) : (
                      <><Play className="h-4 w-4 mr-2" /> Resume</>
                    )}
                  </Button>
                </div>
              )}

              <div className="text-xs text-center text-cream/60">
                Total Mash Time: {totalTime} minutes
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="bg-card/50 border-amber/20">
            <CardHeader>
              <CardTitle className="text-gold">Mash Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="bg-background/30 rounded p-3">
                  <div className="text-cream/60 text-xs mb-1">Strike Water</div>
                  <div className="font-semibold text-cream">
                    {strikeVolume.toFixed(1)} gal @ {strikeTemp.toFixed(1)}°F
                  </div>
                </div>

                <div className="bg-background/30 rounded p-3">
                  <div className="text-cream/60 text-xs mb-1">Mash Steps</div>
                  <div className="space-y-1">
                    {mashSteps.map((step, i) => (
                      <div key={step.id} className="text-cream text-xs">
                        {i + 1}. {step.name}: {step.temperature}°F / {step.duration} min
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background/30 rounded p-3">
                  <div className="text-cream/60 text-xs mb-1">Sparge Water</div>
                  <div className="font-semibold text-cream">
                    {spargeWater.toFixed(1)} gal @ 168°F
                  </div>
                </div>

                <div className="bg-background/30 rounded p-3">
                  <div className="text-cream/60 text-xs mb-1">Grain Absorption</div>
                  <div className="font-semibold text-cream">
                    {calculateGrainAbsorption().toFixed(2)} gal
                  </div>
                </div>

                <div className="bg-amber/10 rounded p-3 border border-amber/30">
                  <div className="text-cream/60 text-xs mb-1">Total Mash Time</div>
                  <div className="font-bold text-gold text-lg">
                    {totalTime} minutes
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={copySummary}
                  variant="outline"
                  className="flex-1 border-amber/30 hover:bg-amber/10"
                  size="sm"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  onClick={saveSchedule}
                  variant="outline"
                  className="flex-1 border-amber/30 hover:bg-amber/10"
                  size="sm"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
