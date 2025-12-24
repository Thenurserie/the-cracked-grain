'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BeerBrewingGuide } from '@/components/brewing/BeerBrewingGuide';
import { KitBrewGuide } from '@/components/brewing/KitBrewGuide';
import { AllGrainGuide } from '@/components/brewing/AllGrainGuide';
import { AdvancedBrewingGuide } from '@/components/brewing/AdvancedBrewingGuide';
import { FermentationGuideContent } from '@/components/brewing/FermentationGuideContent';
import { PackagingGuide } from '@/components/brewing/PackagingGuide';
import { WineMakingGuide } from '@/components/brewing/WineMakingGuide';
import { MeadMakingGuide } from '@/components/brewing/MeadMakingGuide';
import { KombuchaGuide } from '@/components/brewing/KombuchaGuide';
import { CiderMakingGuide } from '@/components/brewing/CiderMakingGuide';
import {
  BookOpen,
  Beaker,
  Wine,
  Droplet,
  Apple,
  Sparkles,
  ChevronRight,
  FlaskConical,
  Package
} from 'lucide-react';

type GuideType = 'beer' | 'kit-brew' | 'all-grain' | 'advanced' | 'fermentation' | 'packaging' | 'wine' | 'mead' | 'kombucha' | 'cider' | null;

const GUIDE_CARDS = [
  {
    id: 'beer' as GuideType,
    title: 'Beer Brewing',
    description: 'Complete guide to brewing beer from start to finish',
    icon: Beaker,
    image: '/images/brewing/Craft your recipe.png',
    color: 'from-amber-500/20 to-gold/10',
    difficulty: 'All Levels'
  },
  {
    id: 'kit-brew' as GuideType,
    title: 'Extract/Kit Brewing',
    description: 'Perfect for beginners - extract brew day, fermentation, and bottling',
    icon: Beaker,
    image: '/images/brewing/Craft your recipe.png',
    color: 'from-amber-500/20 to-gold/10',
    difficulty: 'Beginner'
  },
  {
    id: 'all-grain' as GuideType,
    title: 'All-Grain Brewing',
    description: 'Advanced brewing with full grain mashing and sparging',
    icon: Beaker,
    image: '/images/brewing/Track your brews.png',
    color: 'from-orange-500/20 to-amber-500/10',
    difficulty: 'Intermediate to Advanced'
  },
  {
    id: 'advanced' as GuideType,
    title: 'Advanced Techniques',
    description: 'Master advanced brewing techniques and processes',
    icon: Beaker,
    image: '/images/brewing/Craft your recipe.png',
    color: 'from-red-500/20 to-orange-500/10',
    difficulty: 'Advanced'
  },
  {
    id: 'fermentation' as GuideType,
    title: 'Fermentation Guide',
    description: 'Deep dive into fermentation science and techniques',
    icon: FlaskConical,
    image: '/images/brewing/Track your brews.png',
    color: 'from-blue-500/20 to-cyan-500/10',
    difficulty: 'All Levels'
  },
  {
    id: 'packaging' as GuideType,
    title: 'Packaging Guide',
    description: 'Bottling, kegging, and carbonation techniques',
    icon: Package,
    image: '/images/brewing/Craft your recipe.png',
    color: 'from-green-500/20 to-emerald-500/10',
    difficulty: 'All Levels'
  },
  {
    id: 'wine' as GuideType,
    title: 'Wine Making',
    description: 'Master the art of crafting wine from fruit and juice',
    icon: Wine,
    image: '/images/brewing/Track your brews.png',
    color: 'from-purple-500/20 to-pink-500/10',
    difficulty: 'Intermediate'
  },
  {
    id: 'mead' as GuideType,
    title: 'Mead Making',
    description: 'Create traditional and modern meads with honey',
    icon: Droplet,
    image: '/images/brewing/Craft your recipe.png',
    color: 'from-yellow-500/20 to-amber-500/10',
    difficulty: 'Beginner to Intermediate'
  },
  {
    id: 'kombucha' as GuideType,
    title: 'Kombucha',
    description: 'Brew probiotic-rich kombucha tea at home',
    icon: Sparkles,
    image: '/images/brewing/Track your brews.png',
    color: 'from-green-500/20 to-emerald-500/10',
    difficulty: 'Beginner'
  },
  {
    id: 'cider' as GuideType,
    title: 'Cider Making',
    description: 'From fresh-pressed apples to finished cider',
    icon: Apple,
    image: '/images/brewing/Craft your recipe.png',
    color: 'from-red-500/20 to-orange-500/10',
    difficulty: 'Beginner to Intermediate'
  }
];

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<GuideType>(null);

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as GuideType;
    const validGuides = ['beer', 'kit-brew', 'all-grain', 'advanced', 'fermentation', 'packaging', 'wine', 'mead', 'kombucha', 'cider'];
    if (hash && validGuides.includes(hash)) {
      setSelectedGuide(hash);
      // Small delay to ensure content is rendered before scrolling
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const yOffset = -100; // Header offset
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Update URL hash when guide is selected
  const handleGuideSelect = (guide: GuideType) => {
    setSelectedGuide(guide);
    if (guide) {
      window.history.pushState(null, '', `#${guide}`);
      // Scroll to the guide section
      setTimeout(() => {
        const element = document.getElementById(guide);
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://admin.thecrackedgrain.com/assets/c6ba14d1-392d-49c4-9405-d45f646f2a09?width=1920&quality=80&format=webp"
          alt="Brewing guides and education"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <BookOpen className="h-16 w-16 text-gold mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-cream mb-6">Brewing Guides</h1>
          <p className="text-xl md:text-2xl text-cream/90 mb-4">
            Learn to brew from start to finish
          </p>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto">
            Comprehensive step-by-step guides for beer, wine, mead, kombucha, and cider.
            From complete beginner to advanced techniques.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Back Button */}
        {selectedGuide && (
          <button
            onClick={() => handleGuideSelect(null)}
            className="mb-8 flex items-center gap-2 text-gold hover:text-amber transition-colors"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
            Back to all guides
          </button>
        )}

        {/* Guide Category Cards */}
        {!selectedGuide && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-cream mb-4">Choose Your Path</h2>
              <p className="text-cream/70 max-w-2xl mx-auto">
                Select a guide to begin your brewing journey. Each guide includes detailed
                instructions, equipment lists, troubleshooting tips, and product recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GUIDE_CARDS.map((guide) => (
                <Card
                  key={guide.id}
                  className="bg-card border-amber/20 hover:border-gold transition-all cursor-pointer group overflow-hidden"
                  onClick={() => handleGuideSelect(guide.id)}
                >
                  <div className={`relative h-48 bg-gradient-to-br ${guide.color}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <guide.icon className="h-24 w-24 text-gold/30 group-hover:text-gold/50 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-cream/10 text-cream border-cream/30">
                        {guide.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-cream group-hover:text-gold transition-colors flex items-center justify-between">
                      {guide.title}
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-cream/70 text-sm">
                      {guide.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Individual Guide Content */}
        <div className="space-y-12">
          {selectedGuide === 'beer' && (
            <div id="beer">
              <BeerBrewingGuide />
            </div>
          )}

          {selectedGuide === 'kit-brew' && (
            <div id="kit-brew">
              <KitBrewGuide />
            </div>
          )}

          {selectedGuide === 'all-grain' && (
            <div id="all-grain">
              <AllGrainGuide />
            </div>
          )}

          {selectedGuide === 'advanced' && (
            <div id="advanced">
              <AdvancedBrewingGuide />
            </div>
          )}

          {selectedGuide === 'fermentation' && (
            <div id="fermentation">
              <FermentationGuideContent />
            </div>
          )}

          {selectedGuide === 'packaging' && (
            <div id="packaging">
              <PackagingGuide />
            </div>
          )}

          {selectedGuide === 'wine' && (
            <div id="wine">
              <WineMakingGuide />
            </div>
          )}

          {selectedGuide === 'mead' && (
            <div id="mead">
              <MeadMakingGuide />
            </div>
          )}

          {selectedGuide === 'kombucha' && (
            <div id="kombucha">
              <KombuchaGuide />
            </div>
          )}

          {selectedGuide === 'cider' && (
            <div id="cider">
              <CiderMakingGuide />
            </div>
          )}
        </div>

        {/* Quick Links Section */}
        {!selectedGuide && (
          <div className="mt-16 pt-16 border-t border-amber/20">
            <Card className="bg-gradient-to-br from-amber/10 to-gold/5 border-amber/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center">
                      <Beaker className="h-8 w-8 text-gold" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-cream mb-2">Ready to Brew?</h3>
                    <p className="text-cream/70 mb-4">
                      Check out our brewing tools for recipe creation, calculators, and batch tracking.
                    </p>
                    <a
                      href="/brewing"
                      className="inline-flex items-center gap-2 text-gold hover:text-amber transition-colors font-medium"
                    >
                      Explore Brewing Tools
                      <ChevronRight className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
