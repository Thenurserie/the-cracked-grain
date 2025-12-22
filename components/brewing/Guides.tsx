'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BeerBrewingGuide } from './BeerBrewingGuide';

const GUIDES = {
  'Starter Kit': [
    {
      title: 'Extract Brew Day SOP',
      difficulty: 'Beginner',
      time: '4-5 hours',
      content: {
        overview: 'Complete standard operating procedure for extract brewing your first batch',
        steps: [
          'Sanitize all equipment that will touch wort post-boil',
          'Heat 2.5 gallons of water to 155°F',
          'Steep specialty grains for 30 minutes in grain bag',
          'Remove grains, bring water to boil',
          'Remove from heat, add malt extract and stir to dissolve',
          'Return to boil, start 60-minute timer',
          'Add hops according to schedule (60, 15, 5 min)',
          'Cool wort to 70°F using ice bath or wort chiller',
          'Transfer to sanitized fermenter',
          'Top up to 5 gallons with sanitized water',
          'Take gravity reading and pitch yeast',
          'Seal fermenter with airlock and ferment for 2 weeks'
        ],
        tips: [
          'Maintain a vigorous boil to drive off DMS',
          'Cool wort as quickly as possible to minimize risk of infection',
          'Aerate wort well before pitching yeast',
          'Keep fermentation temperature stable in the 65-70°F range'
        ]
      }
    },
    {
      title: 'Fermentation Guide',
      difficulty: 'Beginner',
      time: '2-4 weeks',
      content: {
        overview: 'Everything you need to know about proper fermentation',
        steps: [
          'Place fermenter in temperature-stable location',
          'Monitor airlock activity (should start within 12-24 hours)',
          'Primary fermentation: 1-2 weeks',
          'Take gravity reading after 3 days',
          'Check gravity stability (same reading 2 days apart = done)',
          'Optional: Secondary fermentation or dry hopping',
          'Cold crash at 35°F for 2-3 days before bottling'
        ],
        tips: [
          'Stable temperature is more important than exact temperature',
          'Avoid opening fermenter unnecessarily',
          'Use fermentation schedule specific to your yeast strain',
          'Take detailed notes for future batches'
        ]
      }
    },
    {
      title: 'Bottling Day',
      difficulty: 'Beginner',
      time: '2-3 hours',
      content: {
        overview: 'Safe and effective bottling procedures',
        steps: [
          'Sanitize all bottling equipment',
          'Dissolve priming sugar in 1 cup boiling water',
          'Add cooled priming solution to bottling bucket',
          'Gently transfer beer to bottling bucket',
          'Fill bottles to within 1 inch of top',
          'Cap bottles immediately',
          'Store at room temperature for 2 weeks to carbonate',
          'Chill and enjoy'
        ],
        tips: [
          'Use a bottling wand for consistent fills',
          'Avoid splashing to minimize oxidation',
          'Clean bottles before sanitizing',
          'Store carbonating bottles at 70°F for best results'
        ]
      }
    }
  ],
  'Brewing Basics': [
    {
      title: 'Getting Started Brew Day',
      difficulty: 'Beginner',
      time: '6-8 hours',
      content: {
        overview: 'Essential brew day workflow and timeline',
        steps: [
          'Gather and organize all ingredients and equipment',
          'Clean and sanitize everything',
          'Heat strike water to calculated temperature',
          'Mash grains at target temperature',
          'Lauter and sparge to collect wort',
          'Boil for 60-90 minutes with hop additions',
          'Cool wort rapidly',
          'Transfer to fermenter and pitch yeast',
          'Clean up equipment immediately'
        ],
        tips: [
          'Prep everything the night before',
          'Use a brew day checklist',
          'Keep detailed notes',
          'Stay organized and patient'
        ]
      }
    },
    {
      title: 'Sanitation 101',
      difficulty: 'Beginner',
      time: '30 minutes',
      content: {
        overview: 'Critical sanitation practices for infection-free beer',
        steps: [
          'Clean all equipment thoroughly with unscented detergent',
          'Rinse completely to remove all soap residue',
          'Sanitize with Star San or iodophor solution',
          'Allow proper contact time (2 minutes for Star San)',
          'Air dry or use immediately without rinsing',
          'Sanitize anything that touches cooled wort'
        ],
        tips: [
          'Clean is not the same as sanitized',
          'Make extra sanitizer solution',
          'Keep a spray bottle of sanitizer handy',
          'If in doubt, sanitize again'
        ]
      }
    },
    {
      title: 'Water Chemistry Intro',
      difficulty: 'Intermediate',
      time: '1 hour',
      content: {
        overview: 'Understanding water chemistry basics for better beer',
        steps: [
          'Get water report from municipality',
          'Test your water pH',
          'Understand key minerals: Calcium, Sulfate, Chloride',
          'Match water profile to beer style',
          'Make small adjustments with salts',
          'Document results and iterate'
        ],
        tips: [
          'Start with RO water for complete control',
          'Focus on calcium first (50-150 ppm)',
          'Sulfate enhances hop bitterness',
          'Chloride enhances malt sweetness'
        ]
      }
    },
    {
      title: 'Understanding Hops',
      difficulty: 'Beginner',
      time: '30 minutes',
      content: {
        overview: 'Hop varieties, uses, and addition timing',
        steps: [
          'Learn hop categories: Bittering, Aroma, Dual Purpose',
          'Understand Alpha Acid percentage',
          'Master timing: 60min (bittering), 15min (flavor), 5min (aroma)',
          'Try dry hopping for intense aroma',
          'Store hops properly in freezer',
          'Experiment with single-hop beers'
        ],
        tips: [
          'Higher alpha = more bittering potential',
          'Late additions preserve hop aroma',
          'Dry hop for 3-7 days',
          'Keep hops frozen and vacuum sealed'
        ]
      }
    },
    {
      title: 'Malt & Grain Basics',
      difficulty: 'Beginner',
      time: '30 minutes',
      content: {
        overview: 'Base malts, specialty grains, and their uses',
        steps: [
          'Understand base malts: 2-Row, Pilsner, Maris Otter',
          'Learn crystal malt lovibond scale',
          'Explore roasted malts for dark beers',
          'Calculate grain bill percentages',
          'Match grains to beer styles',
          'Crush grain fresh for best results'
        ],
        tips: [
          'Base malts should be 60-90% of grain bill',
          'Crystal malts add color and sweetness',
          'Roasted malts add color and roasted flavors',
          'Fresh milled grain extracts better'
        ]
      }
    }
  ],
  'All-Grain Brewing': [
    {
      title: 'Single Infusion Mash',
      difficulty: 'Intermediate',
      time: '90 minutes',
      content: {
        overview: 'The most common all-grain mashing technique',
        steps: [
          'Calculate strike water temperature and volume',
          'Heat water to strike temperature',
          'Add grain and stir thoroughly',
          'Check and adjust mash temperature to 148-158°F',
          'Cover and maintain temperature for 60 minutes',
          'Check for complete conversion with iodine test',
          'Mash out at 170°F for 10 minutes'
        ],
        tips: [
          'Lower temps (148-152°F) create drier beer',
          'Higher temps (154-158°F) create fuller body',
          'Insulate mash tun to maintain temperature',
          'Stir gently to avoid creating dough balls'
        ]
      }
    },
    {
      title: 'Step Mashing Guide',
      difficulty: 'Advanced',
      time: '2-3 hours',
      content: {
        overview: 'Multiple temperature rests for complex beers',
        steps: [
          'Protein rest: 122-131°F for 15-20 minutes',
          'Saccharification rest 1: 145-150°F for 30 minutes',
          'Saccharification rest 2: 154-160°F for 30 minutes',
          'Mash out: 170°F for 10 minutes',
          'Monitor and control temperature carefully',
          'Use direct heat or infusion to raise temps'
        ],
        tips: [
          'Protein rest improves head retention',
          'Multiple sacch rests create complex fermentability',
          'Use for high-adjunct beers',
          'Not necessary for well-modified modern malts'
        ]
      }
    },
    {
      title: 'Mash Water Planning',
      difficulty: 'Intermediate',
      time: '30 minutes',
      content: {
        overview: 'Calculating water volumes for all-grain brewing',
        steps: [
          'Calculate mash water: grain weight × 1.25 qt/lb',
          'Calculate sparge water based on batch size',
          'Account for grain absorption (0.1 gal/lb)',
          'Factor in evaporation during boil',
          'Add dead space losses',
          'Document actual volumes for future reference'
        ],
        tips: [
          'Start with 1.25-1.5 qt/lb ratio',
          'Thicker mashes favor beta amylase',
          'Thinner mashes favor alpha amylase',
          'Measure everything to improve calculations'
        ]
      }
    },
    {
      title: 'Water Chemistry Advanced',
      difficulty: 'Advanced',
      time: '1-2 hours',
      content: {
        overview: 'Fine-tuning water for specific styles',
        steps: [
          'Start with complete water analysis',
          'Calculate residual alkalinity',
          'Adjust mash pH to 5.2-5.6 range',
          'Build proper mineral profile for style',
          'Add acids or alkaline buffers as needed',
          'Verify pH with calibrated meter'
        ],
        tips: [
          'Pale beers need low alkalinity',
          'Dark beers can handle higher alkalinity',
          'Calcium helps enzyme activity',
          'Target Sulfate:Chloride ratio for balance'
        ]
      }
    },
    {
      title: 'Hop Schedule Design',
      difficulty: 'Intermediate',
      time: '45 minutes',
      content: {
        overview: 'Creating effective hop schedules',
        steps: [
          'Determine target IBU for style',
          'Calculate bittering addition for 60% of IBUs',
          'Add flavor hops at 15-20 minutes',
          'Add aroma hops at 5 minutes or less',
          'Consider whirlpool/steep additions at 180°F',
          'Plan dry hop additions post-fermentation'
        ],
        tips: [
          'Front-load for clean bitterness',
          'Back-load for hop aroma',
          'Whirlpool hops add flavor without harsh bitterness',
          'Dry hop rate: 0.5-2 oz per gallon'
        ]
      }
    },
    {
      title: 'Lautering & Sparging',
      difficulty: 'Intermediate',
      time: '60-90 minutes',
      content: {
        overview: 'Efficient wort collection techniques',
        steps: [
          'Recirculate wort until clear (vorlauf)',
          'Collect first runnings slowly',
          'Heat sparge water to 170°F',
          'Sprinkle sparge water gently over grain bed',
          'Maintain grain bed depth throughout',
          'Stop collecting when gravity drops below 1.010',
          'Monitor pH (stop if above 6.0)'
        ],
        tips: [
          'Slow and steady wins the race',
          'Avoid channeling in grain bed',
          'Dont over-sparge (causes tannin extraction)',
          'Batch sparging is faster, fly sparging is more efficient'
        ]
      }
    }
  ],
  'Fermentation': [
    {
      title: 'Temperature Control (Ale)',
      difficulty: 'Intermediate',
      time: '2-3 weeks',
      content: {
        overview: 'Managing fermentation temperature for clean ale character',
        steps: [
          'Pitch yeast at recommended temperature',
          'Allow temperature to rise 2-3°F after 24 hours',
          'Maintain steady temperature during active fermentation',
          'Allow free rise during final days for diacetyl cleanup',
          'Cold crash at 35°F for 2-3 days',
          'Package beer'
        ],
        tips: [
          'Fermentation temperature = beer temperature, not ambient',
          'Use fermentation chamber if possible',
          'Swamp cooler works well for beginners',
          'Temperature swings create off-flavors'
        ]
      }
    },
    {
      title: 'Lager Fermentation',
      difficulty: 'Advanced',
      time: '6-8 weeks',
      content: {
        overview: 'Low and slow for crisp, clean lagers',
        steps: [
          'Pitch at 45-50°F with adequate yeast',
          'Ferment at 48-52°F for 2-3 weeks',
          'Check gravity until stable',
          'Raise temperature to 65°F for diacetyl rest (2 days)',
          'Lager at 32-40°F for 4-6 weeks',
          'Package when clear and clean'
        ],
        tips: [
          'Use 1.5-2x yeast cells vs. ales',
          'Temperature control is critical',
          'Longer lagering creates smoother beer',
          'Be patient, its worth it'
        ]
      }
    },
    {
      title: 'Pitch Rates & Starters',
      difficulty: 'Intermediate',
      time: '1-2 days',
      content: {
        overview: 'Ensuring adequate healthy yeast for fermentation',
        steps: [
          'Calculate cells needed based on OG and volume',
          'Determine if starter is needed',
          'Make starter 1-2 days before brew day',
          'Use DME at 1.040 gravity',
          'Aerate starter well',
          'Pitch at high krausen or cold crash and decant',
          'Pitch entire starter into fermenter'
        ],
        tips: [
          'Ales need 0.75M cells/mL/°P',
          'Lagers need 1.5M cells/mL/°P',
          'Use online calculator for starter size',
          'Stir plate improves starter efficiency'
        ]
      }
    },
    {
      title: 'Dry Hopping Best Practices',
      difficulty: 'Intermediate',
      time: '3-7 days',
      content: {
        overview: 'Maximizing hop aroma without grassy flavors',
        steps: [
          'Wait until fermentation is complete',
          'Sanitize hops package exterior',
          'Add hops directly to fermenter',
          'Keep temperature at 65-70°F',
          'Dry hop for 3-5 days (up to 7)',
          'Cold crash to drop hops',
          'Package carefully to minimize oxygen'
        ],
        tips: [
          'Dry hopping adds no bitterness',
          'Use whole hops or pellets',
          'More is not always better (0.5-2 oz/gal)',
          'Minimize oxygen exposure when adding'
        ]
      }
    },
    {
      title: 'Managing Off-Flavors',
      difficulty: 'Intermediate',
      time: 'Ongoing',
      content: {
        overview: 'Identifying and preventing common beer defects',
        steps: [
          'Learn to identify common off-flavors',
          'Diacetyl: butter/butterscotch (incomplete fermentation)',
          'Acetaldehyde: green apple (underpitched/young beer)',
          'DMS: corn/cooked vegetables (insufficient boil)',
          'Phenolic: band-aid/medicinal (contamination)',
          'Oxidation: cardboard/sherry (oxygen exposure)',
          'Identify root cause and adjust process'
        ],
        tips: [
          'Buy commercial off-flavor training kit',
          'Take detailed brew notes',
          'Change one variable at a time',
          'Most issues traced to temperature or sanitation'
        ]
      }
    },
    {
      title: 'Yeast Health & Vitality',
      difficulty: 'Intermediate',
      time: 'Ongoing',
      content: {
        overview: 'Maintaining healthy yeast for best fermentation',
        steps: [
          'Use fresh yeast within expiration date',
          'Store liquid yeast in refrigerator',
          'Make starter for liquid yeast',
          'Aerate wort thoroughly before pitching',
          'Pitch adequate cell count',
          'Monitor fermentation temperature',
          'Consider yeast nutrients for high-gravity beers',
          'Harvest and reuse healthy yeast'
        ],
        tips: [
          'Healthy yeast = clean fermentation',
          'Adequate oxygen critical for yeast reproduction',
          'Yeast can be reused 5-10 generations',
          'Vitality decreases with age and stress'
        ]
      }
    }
  ],
  'Packaging': [
    {
      title: 'Bottling Workflow',
      difficulty: 'Beginner',
      time: '2-3 hours',
      content: {
        overview: 'Step-by-step bottling process',
        steps: [
          'Clean all bottles thoroughly',
          'Sanitize bottles, caps, and equipment',
          'Prepare priming sugar solution',
          'Add priming sugar to bottling bucket',
          'Transfer beer gently to bucket',
          'Fill bottles with bottling wand',
          'Cap immediately after filling',
          'Store at 70°F for 2 weeks',
          'Refrigerate and enjoy'
        ],
        tips: [
          'Minimize splashing to avoid oxidation',
          'Consistent fill levels ensure proper carbonation',
          'Use oxygen-absorbing caps for hoppy beers',
          'Wait full 2 weeks before sampling'
        ]
      }
    },
    {
      title: 'Kegging & Closed Transfer',
      difficulty: 'Intermediate',
      time: '1 hour',
      content: {
        overview: 'Kegging for faster carbonation and less oxidation',
        steps: [
          'Clean and sanitize keg',
          'Purge keg with CO2',
          'Transfer beer via closed transfer or siphon',
          'Seal keg and purge headspace',
          'Set regulator to carbonation pressure',
          'Carbonate for 7-14 days',
          'Reduce to serving pressure',
          'Pour and enjoy'
        ],
        tips: [
          'Closed transfer minimizes oxygen exposure',
          'Force carbonation faster: 30 PSI for 24 hours',
          'Line balancing prevents foamy pours',
          'Clean beer lines regularly'
        ]
      }
    },
    {
      title: 'Cold Crash & Clarity',
      difficulty: 'Beginner',
      time: '2-3 days',
      content: {
        overview: 'Improving beer clarity through cold crashing',
        steps: [
          'Complete fermentation fully',
          'Lower temperature to 35-40°F',
          'Hold for 2-3 days',
          'Yeast and proteins drop out',
          'Optional: add gelatin finings',
          'Package carefully to avoid stirring sediment'
        ],
        tips: [
          'Cold crashing doesnt affect flavor',
          'Improves clarity dramatically',
          'Works for both bottles and kegs',
          'Use CO2 to purge keg to avoid oxygen'
        ]
      }
    },
    {
      title: 'Carbonation Methods',
      difficulty: 'Intermediate',
      time: 'Varies',
      content: {
        overview: 'Natural and forced carbonation techniques',
        steps: [
          'Natural: Add priming sugar and bottle condition',
          'Forced: Use CO2 under pressure in keg',
          'Set and forget: Low pressure for 7-14 days',
          'Fast carb: 30 PSI for 24 hours, then serving pressure',
          'Shake method: 30 PSI while shaking keg for 5 minutes',
          'Check carbonation level and adjust'
        ],
        tips: [
          'Different styles need different CO2 volumes',
          'Temperature affects carbonation pressure',
          'Use carbonation calculator',
          'Be patient with bottle conditioning'
        ]
      }
    },
    {
      title: 'Long-Term Storage',
      difficulty: 'Beginner',
      time: 'Ongoing',
      content: {
        overview: 'Storing beer to maintain quality',
        steps: [
          'Store bottles upright to minimize oxidation',
          'Keep in cool, dark place (50-60°F)',
          'Avoid temperature fluctuations',
          'Minimize light exposure (UV causes skunking)',
          'Higher ABV beers age better',
          'Most beers best within 3-6 months',
          'Barleywines and imperials can age years'
        ],
        tips: [
          'Cold and dark preserves freshness',
          'Hoppy beers drink fresh',
          'Some beers improve with age',
          'Track packaging dates'
        ]
      }
    }
  ]
};

export default function Guides() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Brewing Guides</h2>

      <Tabs defaultValue="Complete Guide" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 h-auto bg-muted/50 p-2">
          <TabsTrigger value="Complete Guide">
            Complete Guide
          </TabsTrigger>
          {Object.keys(GUIDES).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Complete Beer Brewing Guide Tab */}
        <TabsContent value="Complete Guide" className="mt-4">
          <BeerBrewingGuide />
        </TabsContent>

        {Object.entries(GUIDES).map(([category, guides]) => (
          <TabsContent key={category} value={category} className="mt-4">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {guides.map((guide, index) => (
                <AccordionItem key={index} value={`${category}-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <div className="font-semibold">{guide.title}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {guide.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {guide.time}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Overview</h4>
                        <p className="text-sm text-muted-foreground">
                          {guide.content.overview}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Steps</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          {guide.content.steps.map((step, i) => (
                            <li key={i} className="text-muted-foreground">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Pro Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {guide.content.tips.map((tip, i) => (
                            <li key={i} className="text-muted-foreground">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
