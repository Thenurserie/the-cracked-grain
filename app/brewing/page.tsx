'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  Play,
  ChevronRight
} from 'lucide-react';
import RecipeBuilder from '@/components/brewing/RecipeBuilder';
import RecipeLibrary from '@/components/brewing/RecipeLibrary';
import EquipmentProfiles from '@/components/brewing/EquipmentProfiles';
import GrainBillCalculator from '@/components/brewing/GrainBillCalculator';
import Calculators from '@/components/brewing/Calculators';
import BrewBatches from '@/components/brewing/BrewBatches';
import Inventory from '@/components/brewing/Inventory';
import { WaterChemistry } from '@/components/brewing/WaterChemistry';
import MashScheduleDesigner from '@/components/brewing/MashScheduleDesigner';
import { AdvancedCalculators } from '@/components/brewing/AdvancedCalculators';
import { BrewSessionTracker } from '@/components/brewing/BrewSessionTracker';
import { BrewingInstructions } from '@/components/brewing/BrewingInstructions';

export default function BrewingToolsPage() {
  const [activeTab, setActiveTab] = useState('recipe-builder');

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['recipe-builder', 'recipe-library', 'brew-session', 'equipment', 'grain-bill', 'water-chemistry', 'mash-schedule', 'calculators', 'advanced-calculators', 'batches', 'inventory'];

    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
      // Small delay to ensure content is rendered before scrolling
      setTimeout(() => {
        const yOffset = -120; // Header offset
        const y = window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.history.pushState(null, '', `#${value}`);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden mb-8">
        <Image
          src="https://admin.thecrackedgrain.com/assets/c6ba14d1-392d-49c4-9405-d45f646f2a09?width=1920&quality=80&format=webp"
          alt="Brewing tools and equipment"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-cream mb-4">Brewing Tools Dashboard</h1>
          <p className="text-xl text-cream/90">
            Complete brewing toolkit for recipe creation, batch tracking, and more
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* Quick Tip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative h-[160px] rounded-lg overflow-hidden border border-amber/20 group hover:border-gold transition-all">
          <Image
            src="/images/brewing/Craft your recipe.png"
            alt="Craft Your Recipe"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <h3 className="text-xl font-bold text-cream mb-1 group-hover:text-gold transition-colors">
              Craft Your Recipe
            </h3>
            <p className="text-cream/80 text-sm">
              Build custom recipes with our powerful recipe builder
            </p>
          </div>
        </div>

        <div className="relative h-[160px] rounded-lg overflow-hidden border border-amber/20 group hover:border-gold transition-all">
          <Image
            src="/images/brewing/Track your brews.png"
            alt="Track Your Brews"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <h3 className="text-xl font-bold text-cream mb-1 group-hover:text-gold transition-colors">
              Track Your Brews
            </h3>
            <p className="text-cream/80 text-sm">
              Monitor every batch from grain to glass
            </p>
          </div>
        </div>

        <div className="relative h-[160px] rounded-lg overflow-hidden border border-amber/20 group hover:border-gold transition-all">
          <Image
            src="/images/brewing/Perfect your process.png"
            alt="Perfect Your Process"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <h3 className="text-xl font-bold text-cream mb-1 group-hover:text-gold transition-colors">
              Perfect Your Process
            </h3>
            <p className="text-cream/80 text-sm">
              Advanced calculators and water chemistry tools
            </p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="mb-6 bg-gradient-to-r from-amber/10 to-gold/5 border border-amber/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-cream mb-1">New to Brewing?</h3>
            <p className="text-cream/70 text-sm">Start with our comprehensive brewing guides for step-by-step instructions.</p>
          </div>
          <Link
            href="/guides"
            className="flex items-center gap-2 px-4 py-2 bg-amber hover:bg-gold text-white rounded-lg transition-colors whitespace-nowrap"
          >
            View Guides
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto bg-muted/50 p-2 overflow-x-auto">
          <TabsTrigger value="recipe-builder" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Beaker className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Recipe</span>
          </TabsTrigger>
          <TabsTrigger value="recipe-library" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Library className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Library</span>
          </TabsTrigger>
          <TabsTrigger value="brew-session" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Play className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Session</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Settings className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="grain-bill" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Package className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Grain</span>
          </TabsTrigger>
          <TabsTrigger value="water-chemistry" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Droplet className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Water</span>
          </TabsTrigger>
          <TabsTrigger value="mash-schedule" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Flame className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Mash</span>
          </TabsTrigger>
          <TabsTrigger value="calculators" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Calculator className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Calc</span>
          </TabsTrigger>
          <TabsTrigger value="advanced-calculators" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <FlaskConical className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Advanced</span>
          </TabsTrigger>
          <TabsTrigger value="batches" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Batches</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
            <Timer className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>Inventory</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Instructions Panel */}
          <BrewingInstructions activeTab={activeTab} />

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

          <TabsContent value="batches" className="m-0">
            <BrewBatches />
          </TabsContent>

          <TabsContent value="inventory" className="m-0">
            <Inventory />
          </TabsContent>
        </div>
      </Tabs>
      </div>
    </div>
  );
}
