'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Clock, Flame } from 'lucide-react';

interface MashStep {
  id?: string;
  step_number: number;
  name: string;
  type: string;
  temperature: number;
  time: number;
  infusion_amount?: number;
  notes: string;
}

interface MashSchedule {
  id?: string;
  recipe_id?: string;
  user_id?: string;
  name: string;
  is_template: boolean;
  steps: MashStep[];
}

const MASH_STEP_TYPES = [
  { value: 'infusion', label: 'Infusion' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'decoction', label: 'Decoction' },
  { value: 'direct-heat', label: 'Direct Heat' },
];

const COMMON_MASH_TEMPS = [
  { name: 'Acid Rest', temp: 95, time: 20, description: 'pH adjustment, rarely used' },
  { name: 'Protein Rest', temp: 122, time: 20, description: 'Protein breakdown, improves head retention' },
  { name: 'β-Glucanase Rest', temp: 104, time: 20, description: 'Reduces viscosity, good for oats/wheat' },
  { name: 'Saccharification', temp: 152, time: 60, description: 'Main conversion, balanced beer' },
  { name: 'Low Sacch', temp: 148, time: 60, description: 'Dry, highly fermentable beer' },
  { name: 'High Sacch', temp: 158, time: 60, description: 'Full-bodied, sweeter beer' },
  { name: 'Mash Out', temp: 170, time: 10, description: 'Stop enzyme activity, improve lautering' },
];

export function MashScheduleDesigner() {
  const [schedules, setSchedules] = useState<MashSchedule[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<MashSchedule>({
    name: 'New Mash Schedule',
    is_template: true,
    steps: [],
  });
  const [grainWeight, setGrainWeight] = useState(12);
  const [grainTemp, setGrainTemp] = useState(68);
  const [strikeWaterTemp, setStrikeWaterTemp] = useState(165);
  const [mashMethod, setMashMethod] = useState<'single-infusion' | 'step-mash' | 'decoction' | 'biab'>('single-infusion');

  useEffect(() => {
    loadSchedules();
  }, []);

  async function loadSchedules() {
    const { data, error } = await supabase
      .from('mash_schedules')
      .select(`
        *,
        steps:mash_steps(*)
      `)
      .eq('is_template', true)
      .order('name');

    if (data) {
      setSchedules(data.map(schedule => ({
        ...schedule,
        steps: schedule.steps || [],
      })));
    }
  }

  function addStep(step?: Partial<MashStep>) {
    const newStep: MashStep = {
      step_number: currentSchedule.steps.length + 1,
      name: step?.name || `Step ${currentSchedule.steps.length + 1}`,
      type: step?.type || 'infusion',
      temperature: step?.temperature || 152,
      time: step?.time || 60,
      notes: step?.notes || '',
    };

    setCurrentSchedule({
      ...currentSchedule,
      steps: [...currentSchedule.steps, newStep],
    });
  }

  function removeStep(index: number) {
    const newSteps = currentSchedule.steps.filter((_, i) => i !== index);
    setCurrentSchedule({
      ...currentSchedule,
      steps: newSteps.map((step, i) => ({ ...step, step_number: i + 1 })),
    });
  }

  function updateStep(index: number, updates: Partial<MashStep>) {
    const newSteps = [...currentSchedule.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setCurrentSchedule({
      ...currentSchedule,
      steps: newSteps,
    });
  }

  function moveStep(index: number, direction: 'up' | 'down') {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentSchedule.steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...currentSchedule.steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];

    setCurrentSchedule({
      ...currentSchedule,
      steps: newSteps.map((step, i) => ({ ...step, step_number: i + 1 })),
    });
  }

  async function saveSchedule() {
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('mash_schedules')
      .insert([{
        name: currentSchedule.name,
        is_template: currentSchedule.is_template,
      }])
      .select()
      .single();

    if (scheduleData && !scheduleError) {
      const stepsToInsert = currentSchedule.steps.map(step => ({
        mash_schedule_id: scheduleData.id,
        step_number: step.step_number,
        name: step.name,
        step_type: step.type,
        temperature: step.temperature,
        time: step.time,
        infusion_amount: step.infusion_amount,
      }));

      await supabase.from('mash_steps').insert(stepsToInsert);
      await loadSchedules();

      setCurrentSchedule({
        name: 'New Mash Schedule',
        is_template: true,
        steps: [],
      });
    }
  }

  function loadTemplate(schedule: MashSchedule) {
    setCurrentSchedule({
      name: `${schedule.name} (Copy)`,
      is_template: true,
      steps: schedule.steps.map((step, index) => ({
        ...step,
        id: undefined,
        step_number: index + 1,
      })),
    });
  }

  function calculateStrikeWater(targetTemp: number) {
    const waterToGrainRatio = 1.5;
    const mashThickness = waterToGrainRatio;
    const temp = ((targetTemp - grainTemp) * (0.2 / mashThickness)) + targetTemp;
    return Math.round(temp);
  }

  function applyMethod() {
    let steps: Partial<MashStep>[] = [];

    switch (mashMethod) {
      case 'single-infusion':
        steps = [
          { name: 'Saccharification', type: 'infusion', temperature: 152, time: 60 },
          { name: 'Mash Out', type: 'infusion', temperature: 170, time: 10 },
        ];
        break;

      case 'step-mash':
        steps = [
          { name: 'Protein Rest', type: 'infusion', temperature: 122, time: 15 },
          { name: 'Saccharification', type: 'temperature', temperature: 152, time: 45 },
          { name: 'Mash Out', type: 'temperature', temperature: 170, time: 10 },
        ];
        break;

      case 'decoction':
        steps = [
          { name: 'Protein Rest', type: 'infusion', temperature: 122, time: 20 },
          { name: 'First Decoction', type: 'decoction', temperature: 152, time: 30, notes: 'Pull 1/3 of mash, boil 15 min' },
          { name: 'Saccharification', type: 'temperature', temperature: 158, time: 30 },
          { name: 'Second Decoction', type: 'decoction', temperature: 170, time: 15, notes: 'Pull 1/3 of mash, boil 10 min' },
          { name: 'Mash Out', type: 'temperature', temperature: 170, time: 10 },
        ];
        break;

      case 'biab':
        steps = [
          { name: 'Saccharification', type: 'direct-heat', temperature: 152, time: 60, notes: 'Full volume mash' },
          { name: 'Mash Out', type: 'direct-heat', temperature: 170, time: 10, notes: 'Raise temp slowly' },
        ];
        break;
    }

    setCurrentSchedule({
      ...currentSchedule,
      steps: steps.map((step, index) => ({
        step_number: index + 1,
        name: step.name || `Step ${index + 1}`,
        type: step.type || 'infusion',
        temperature: step.temperature || 152,
        time: step.time || 60,
        notes: step.notes || '',
      })),
    });
  }

  const totalMashTime = currentSchedule.steps.reduce((sum, step) => sum + step.time, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Mash Schedule Designer
          </CardTitle>
          <CardDescription>
            Design custom mash schedules for single infusion, step mash, decoction, or BIAB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Schedule Name</Label>
              <Input
                value={currentSchedule.name}
                onChange={(e) => setCurrentSchedule({...currentSchedule, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Mash Method</Label>
              <Select value={mashMethod} onValueChange={(value: any) => setMashMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-infusion">Single Infusion</SelectItem>
                  <SelectItem value="step-mash">Step Mash</SelectItem>
                  <SelectItem value="decoction">Decoction Mash</SelectItem>
                  <SelectItem value="biab">BIAB (Brew in a Bag)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={applyMethod} variant="outline" className="w-full">
            Apply {mashMethod.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Template
          </Button>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Mash Steps</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Total: {totalMashTime} min
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Step</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Temp (°F)</TableHead>
                  <TableHead>Time (min)</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSchedule.steps.map((step, index) => (
                  <TableRow key={index}>
                    <TableCell>{step.step_number}</TableCell>
                    <TableCell>
                      <Input
                        value={step.name}
                        onChange={(e) => updateStep(index, { name: e.target.value })}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={step.type}
                        onValueChange={(value) => updateStep(index, { type: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MASH_STEP_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={step.temperature}
                        onChange={(e) => updateStep(index, { temperature: parseFloat(e.target.value) || 0 })}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={step.time}
                        onChange={(e) => updateStep(index, { time: parseFloat(e.target.value) || 0 })}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={step.notes}
                        onChange={(e) => updateStep(index, { notes: e.target.value })}
                        placeholder="Optional notes"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveStep(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveStep(index, 'down')}
                          disabled={index === currentSchedule.steps.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeStep(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button onClick={() => addStep()} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </div>

          <div className="rounded-lg border p-4 bg-muted/50 space-y-4">
            <h3 className="font-semibold">Common Mash Temperatures</h3>
            <div className="grid gap-2">
              {COMMON_MASH_TEMPS.map(temp => (
                <div key={temp.name} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{temp.name}:</span>
                    <span className="text-muted-foreground ml-2">{temp.description}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addStep({ name: temp.name, temperature: temp.temp, time: temp.time })}
                  >
                    {temp.temp}°F ({temp.time} min)
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-4 space-y-4">
            <h3 className="font-semibold">Strike Water Calculator</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Grain Weight (lbs)</Label>
                <Input
                  type="number"
                  value={grainWeight}
                  onChange={(e) => setGrainWeight(parseFloat(e.target.value) || 0)}
                  step="0.5"
                />
              </div>
              <div className="space-y-2">
                <Label>Grain Temp (°F)</Label>
                <Input
                  type="number"
                  value={grainTemp}
                  onChange={(e) => setGrainTemp(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Mash Temp (°F)</Label>
                <Input
                  type="number"
                  value={currentSchedule.steps[0]?.temperature || 152}
                  onChange={(e) => {
                    const temp = parseFloat(e.target.value) || 0;
                    if (currentSchedule.steps[0]) {
                      updateStep(0, { temperature: temp });
                    }
                  }}
                />
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Strike Water Temperature</p>
              <p className="text-3xl font-bold">
                {calculateStrikeWater(currentSchedule.steps[0]?.temperature || 152)}°F
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Water volume: {(grainWeight * 1.5).toFixed(1)} qts (1.5 qt/lb ratio)
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveSchedule} className="flex-1">
              Save Schedule Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Templates</CardTitle>
            <CardDescription>Load a saved mash schedule template</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {schedules.map(schedule => (
                <div key={schedule.id} className="rounded-lg border p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{schedule.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {schedule.steps.length} steps, {schedule.steps.reduce((sum, step) => sum + step.time, 0)} min total
                    </p>
                  </div>
                  <Button onClick={() => loadTemplate(schedule)} variant="outline">
                    Load Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}