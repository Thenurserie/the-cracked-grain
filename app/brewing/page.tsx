'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Beaker,
  BookOpen,
  Calculator,
  Calendar,
  Package,
  Settings,
  Library,
  Timer,
  Droplet,
  Flame,
  FlaskConical,
  Play
} from 'lucide-react';
import RecipeBuilder from '@/components/brewing/RecipeBuilder';
import RecipeLibrary from '@/components/brewing/RecipeLibrary';
import EquipmentProfiles from '@/components/brewing/EquipmentProfiles';
import GrainBillCalculator from '@/components/brewing/GrainBillCalculator';
import Calculators from '@/components/brewing/Calculators';
import Guides from '@/components/brewing/Guides';
import BrewBatches from '@/components/brewing/BrewBatches';
import Inventory from '@/components/brewing/Inventory';
import { WaterChemistry } from '@/components/brewing/WaterChemistry';
import MashScheduleDesigner from '@/components/brewing/MashScheduleDesigner';
import { AdvancedCalculators } from '@/components/brewing/AdvancedCalculators';
import { BrewSessionTracker } from '@/components/brewing/BrewSessionTracker';

export default function BrewingToolsPage() {
  const [activeTab, setActiveTab] = useState('recipe-builder');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Brewing Tools Dashboard</h1>
        <p className="text-muted-foreground">
          Complete brewing toolkit for recipe creation, batch tracking, and more
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto bg-muted/50 p-2">
          <TabsTrigger value="recipe-builder" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            <span className="hidden sm:inline">Recipe Builder</span>
            <span className="sm:hidden">Builder</span>
          </TabsTrigger>
          <TabsTrigger value="recipe-library" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </TabsTrigger>
          <TabsTrigger value="brew-session" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Brew Sessions</span>
            <span className="sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="grain-bill" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Grain Bill</span>
          </TabsTrigger>
          <TabsTrigger value="water-chemistry" className="flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            <span className="hidden sm:inline">Water</span>
          </TabsTrigger>
          <TabsTrigger value="mash-schedule" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span className="hidden sm:inline">Mash</span>
          </TabsTrigger>
          <TabsTrigger value="calculators" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Basic Calcs</span>
            <span className="sm:hidden">Calcs</span>
          </TabsTrigger>
          <TabsTrigger value="advanced-calculators" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
            <span className="sm:hidden">Adv</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guides</span>
          </TabsTrigger>
          <TabsTrigger value="batches" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Batches</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="recipe-builder" className="m-0">
            <RecipeBuilder />
          </TabsContent>

          <TabsContent value="recipe-library" className="m-0">
            <RecipeLibrary />
          </TabsContent>

          <TabsContent value="brew-session" className="m-0">
            <BrewSessionTracker />
          </TabsContent>

          <TabsContent value="equipment" className="m-0">
            <EquipmentProfiles />
          </TabsContent>

          <TabsContent value="grain-bill" className="m-0">
            <GrainBillCalculator />
          </TabsContent>

          <TabsContent value="water-chemistry" className="m-0">
            <WaterChemistry />
          </TabsContent>

          <TabsContent value="mash-schedule" className="m-0">
            <MashScheduleDesigner />
          </TabsContent>

          <TabsContent value="calculators" className="m-0">
            <Calculators />
          </TabsContent>

          <TabsContent value="advanced-calculators" className="m-0">
            <AdvancedCalculators />
          </TabsContent>

          <TabsContent value="guides" className="m-0">
            <Guides />
          </TabsContent>

          <TabsContent value="batches" className="m-0">
            <BrewBatches />
          </TabsContent>

          <TabsContent value="inventory" className="m-0">
            <Inventory />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
