'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BrewingInstructionsProps {
  activeTab: string;
}

interface ListItem {
  label?: string;
  desc?: string;
  indent?: boolean;
}

interface InstructionSection {
  heading?: string;
  content?: string;
  list?: ListItem[];
}

interface Instruction {
  title: string;
  sections: InstructionSection[];
}

const INSTRUCTIONS: Record<string, Instruction> = {
  'recipe-builder': {
    title: 'Building Your Recipe',
    sections: [
      {
        heading: 'Recipe Name & Style',
        content: 'Give your recipe a memorable name and select a beer style (e.g., American IPA, German Pilsner). The style helps set target parameters for color, bitterness, and alcohol.'
      },
      {
        heading: 'Brew Method',
        content: '',
        list: [
          { label: 'All Grain', desc: 'Full control using malted grains. Requires mashing equipment.' },
          { label: 'Extract', desc: 'Uses pre-made malt extract. Simpler process, great for beginners.' },
          { label: 'Partial Mash', desc: 'Combines extract with some grain mashing. Best of both worlds.' }
        ]
      },
      {
        heading: 'Batch Size',
        content: 'Enter your target finished volume in gallons. Account for losses to trub, hops, and boil-off. A 5-gallon batch typically needs 6-6.5 gallons pre-boil.'
      },
      {
        heading: 'Boil Time',
        content: 'Standard is 60 minutes. Longer boils (90 min) help reduce DMS in pilsner malts. Shorter boils work for hop-forward styles.'
      },
      {
        heading: 'Efficiency',
        content: 'How much sugar you extract from grains. Beginners: 65-70%. Experienced: 72-78%. Extract brewers: set to 100%.'
      },
      {
        heading: 'Fermentables',
        content: 'Click \'+ Add Grain\' to build your grain bill. Base malts typically make up 80-90% of the recipe. Specialty malts add color, body, and flavor.'
      }
    ]
  },
  'recipe-library': {
    title: 'Your Recipe Library',
    sections: [
      {
        heading: '',
        content: 'Browse and manage your saved recipes.',
        list: [
          { desc: 'Click any recipe to load it into the Recipe Builder' },
          { desc: 'Duplicate recipes to create variations' },
          { desc: 'Tag recipes for easy organization' },
          { desc: 'Filter by style, date, or rating' },
          { desc: 'Export recipes to share with other brewers' },
          { desc: 'Import recipes from BeerXML files' }
        ]
      }
    ]
  },
  'brew-session': {
    title: 'Tracking Your Brew Day',
    sections: [
      {
        heading: '',
        content: 'Record every detail of your brewing process:'
      },
      {
        heading: 'Pre-Brew',
        list: [
          { desc: 'Log your ingredients and any substitutions' },
          { desc: 'Record water volumes and chemistry adjustments' },
          { desc: 'Note ambient temperature and humidity' }
        ]
      },
      {
        heading: 'During Brewing',
        list: [
          { desc: 'Track mash temperatures at intervals' },
          { desc: 'Record pre-boil gravity and volume' },
          { desc: 'Log hop additions with exact times' },
          { desc: 'Note any process deviations' }
        ]
      },
      {
        heading: 'Fermentation',
        list: [
          { desc: 'Record OG (Original Gravity) at pitching' },
          { desc: 'Track temperature daily' },
          { desc: 'Log gravity readings to monitor progress' },
          { desc: 'Record FG (Final Gravity) when stable' }
        ]
      },
      {
        heading: 'Post-Brew',
        list: [
          { desc: 'Calculate actual ABV, IBU, and color' },
          { desc: 'Add tasting notes' },
          { desc: 'Rate your batch' },
          { desc: 'Note improvements for next time' }
        ]
      }
    ]
  },
  'equipment': {
    title: 'Equipment Profiles',
    sections: [
      {
        heading: '',
        content: 'Set up your brewing system for accurate calculations:'
      },
      {
        heading: 'Mash Tun',
        list: [
          { desc: 'Volume capacity' },
          { desc: 'Dead space (liquid below drain)' },
          { desc: 'Heat loss per hour' }
        ]
      },
      {
        heading: 'Boil Kettle',
        list: [
          { desc: 'Volume capacity' },
          { desc: 'Boil-off rate (typically 1-1.5 gal/hour)' },
          { desc: 'Trub loss' }
        ]
      },
      {
        heading: 'Fermenter',
        list: [
          { desc: 'Volume capacity' },
          { desc: 'Headspace requirements' },
          { desc: 'Trub/yeast cake loss' }
        ]
      },
      {
        heading: 'System Efficiency',
        content: 'Your equipment profile helps calculate:',
        list: [
          { desc: 'Required grain amounts' },
          { desc: 'Water volumes for mash and sparge' },
          { desc: 'Expected pre-boil and post-boil volumes' }
        ]
      }
    ]
  },
  'grain-bill': {
    title: 'Grain Bill Calculator',
    sections: [
      {
        heading: '',
        content: 'Build your fermentable profile:'
      },
      {
        heading: 'Base Malts (80-90% of bill)',
        list: [
          { label: '2-Row', desc: 'Clean, neutral base' },
          { label: 'Pilsner', desc: 'Light, slightly sweet' },
          { label: 'Maris Otter', desc: 'Rich, biscuity' },
          { label: 'Munich', desc: 'Adds malty depth' }
        ]
      },
      {
        heading: 'Specialty Malts (10-20% of bill)',
        list: [
          { label: 'Crystal/Caramel', desc: 'Sweetness and color' },
          { label: 'Roasted', desc: 'Coffee, chocolate notes' },
          { label: 'Wheat', desc: 'Body and head retention' }
        ]
      },
      {
        heading: 'The calculator shows:',
        list: [
          { desc: 'Total grain weight needed' },
          { desc: 'Estimated OG (Original Gravity)' },
          { desc: 'Estimated color (SRM)' },
          { desc: 'Fermentability percentage' }
        ]
      }
    ]
  },
  'water-chemistry': {
    title: 'Water Chemistry',
    sections: [
      {
        heading: '',
        content: 'Adjust your water to match beer styles:'
      },
      {
        heading: 'Key Minerals',
        list: [
          { label: 'Calcium (Ca)', desc: 'Yeast health, enzyme function. 50-150 ppm' },
          { label: 'Magnesium (Mg)', desc: 'Yeast nutrient. 10-30 ppm' },
          { label: 'Sodium (Na)', desc: 'Enhances malt. 0-150 ppm' },
          { label: 'Chloride (Cl)', desc: 'Fullness, malt emphasis. 0-250 ppm' },
          { label: 'Sulfate (SO4)', desc: 'Dry, hop emphasis. 0-350 ppm' },
          { label: 'Bicarbonate (HCO3)', desc: 'Affects pH. Varies by style' }
        ]
      },
      {
        heading: 'Water Profiles',
        list: [
          { label: 'Pilsen', desc: 'Very soft, low minerals' },
          { label: 'Burton', desc: 'High sulfate, hoppy beers' },
          { label: 'Dublin', desc: 'High bicarbonate, stouts' },
          { label: 'Munich', desc: 'Balanced, malty beers' }
        ]
      },
      {
        heading: 'Mash pH',
        content: 'Target 5.2-5.6 for optimal enzyme activity. Use acid malt or lactic acid to lower pH.'
      }
    ]
  },
  'mash-schedule': {
    title: 'Mash Calculator',
    sections: [
      {
        heading: '',
        content: 'Calculate your mash parameters:'
      },
      {
        heading: 'Water to Grain Ratio',
        content: 'Typical range: 1.25-1.5 quarts per pound',
        list: [
          { label: 'Thicker mash (1.25)', desc: 'More body, less fermentable' },
          { label: 'Thinner mash (1.5)', desc: 'Drier, more fermentable' }
        ]
      },
      {
        heading: 'Strike Water Temperature',
        content: 'The calculator determines how hot your water should be to hit your target mash temp. Accounts for:',
        list: [
          { desc: 'Grain temperature (usually room temp)' },
          { desc: 'Mash tun heat absorption' },
          { desc: 'Target mash temperature' }
        ]
      },
      {
        heading: 'Mash Steps',
        list: [
          { label: 'Protein rest (113-131°F)', desc: 'Improves clarity' },
          { label: 'Saccharification (148-158°F)', desc: 'Converts starch to sugar' },
          { desc: 'Lower (148-152°F): Drier, more fermentable', indent: true },
          { desc: 'Higher (154-158°F): Fuller body, sweeter', indent: true },
          { label: 'Mash out (168°F)', desc: 'Stops enzyme activity' }
        ]
      }
    ]
  },
  'calculators': {
    title: 'Essential Brewing Calculators',
    sections: [
      {
        heading: 'ABV Calculator',
        content: 'Enter Original Gravity (OG) and Final Gravity (FG) to calculate alcohol content. Formula: ABV = (OG - FG) × 131.25'
      },
      {
        heading: 'IBU Calculator',
        content: 'Estimate bitterness from hop additions:',
        list: [
          { desc: 'Enter hop weight, alpha acid %, boil time' },
          { desc: 'Accounts for utilization based on gravity' }
        ]
      },
      {
        heading: 'Priming Sugar Calculator',
        content: 'Calculate carbonation sugar for bottling:',
        list: [
          { desc: 'Enter batch size and desired CO2 volumes' },
          { desc: 'Shows amounts for corn sugar, table sugar, or DME' }
        ]
      },
      {
        heading: 'Gravity Correction',
        content: 'Adjust hydrometer readings for temperature. Hydrometers are calibrated at 60°F (15.5°C).'
      },
      {
        heading: 'Unit Conversions',
        content: 'Convert between metric and imperial for weights, volumes, and temperatures.'
      }
    ]
  },
  'advanced-calculators': {
    title: 'Advanced Calculations',
    sections: [
      {
        heading: 'Yeast Pitching Rate',
        content: 'Calculate optimal yeast cell count:',
        list: [
          { label: 'Ales', desc: '0.75 million cells/mL/°Plato' },
          { label: 'Lagers', desc: '1.5 million cells/mL/°Plato' },
          { label: 'High gravity', desc: 'Increase pitch rate' }
        ]
      },
      {
        heading: 'Starter Calculator',
        content: 'Determine starter size to grow yeast:',
        list: [
          { desc: 'Input yeast age and viability' },
          { desc: 'Calculate DME and water needed' },
          { desc: 'Estimate cell growth' }
        ]
      },
      {
        heading: 'Refractometer Correction',
        content: 'Convert Brix readings during fermentation. Alcohol skews refractometer readings - this corrects for that.'
      },
      {
        heading: 'Dilution/Boil-Off',
        content: 'Calculate how to hit target gravity:',
        list: [
          { desc: 'Add water to reduce OG' },
          { desc: 'Extend boil to increase OG' }
        ]
      }
    ]
  },
  'guides': {
    title: 'Brewing Guides',
    sections: [
      {
        heading: '',
        content: 'Step-by-step instructions for:',
        list: [
          { desc: 'Your first all-grain brew' },
          { desc: 'Extract brewing basics' },
          { desc: 'Yeast handling and starters' },
          { desc: 'Fermentation temperature control' },
          { desc: 'Kegging vs bottling' },
          { desc: 'Troubleshooting off-flavors' },
          { desc: 'Cleaning and sanitation' },
          { desc: 'Water chemistry basics' }
        ]
      }
    ]
  },
  'batches': {
    title: 'Batch History',
    sections: [
      {
        heading: '',
        content: 'Review all your past brews:',
        list: [
          { desc: 'Sort by date, style, or rating' },
          { desc: 'Compare actual vs target numbers' },
          { desc: 'Track improvement over time' },
          { desc: 'Identify patterns in your process' },
          { desc: 'Export data for analysis' }
        ]
      }
    ]
  },
  'inventory': {
    title: 'Ingredient Inventory',
    sections: [
      {
        heading: '',
        content: 'Track your brewing supplies:'
      },
      {
        heading: 'Grains',
        list: [
          { desc: 'Log quantities on hand' },
          { desc: 'Set low-stock alerts' },
          { desc: 'Track freshness dates' }
        ]
      },
      {
        heading: 'Hops',
        list: [
          { desc: 'Monitor quantities and alpha acids' },
          { desc: 'Store in freezer for freshness' },
          { desc: 'Note harvest year' }
        ]
      },
      {
        heading: 'Yeast',
        list: [
          { desc: 'Track packages and viability' },
          { desc: 'Log manufacture dates' },
          { desc: 'Monitor refrigerator stock' }
        ]
      },
      {
        heading: 'The system can:',
        list: [
          { desc: 'Deduct ingredients when brewing' },
          { desc: 'Alert when supplies are low' },
          { desc: 'Suggest recipes based on inventory' }
        ]
      }
    ]
  }
};

export function BrewingInstructions({ activeTab }: BrewingInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const instructions = INSTRUCTIONS[activeTab as keyof typeof INSTRUCTIONS];

  if (!instructions) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-card border-2 border-amber/30 rounded-lg p-4 flex items-center justify-between hover:border-gold hover:bg-amber/5 transition-all"
        aria-label={isOpen ? 'Close instructions' : 'Open instructions'}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="text-lg font-semibold text-gold">How to Use: {instructions.title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gold flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gold flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 bg-card border border-amber/20 rounded-lg p-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
          {instructions.sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {section.heading && (
                <h3 className="text-lg font-semibold text-gold">{section.heading}</h3>
              )}
              {section.content && (
                <p className="text-cream/80 text-sm leading-relaxed">{section.content}</p>
              )}
              {section.list && (
                <ul className="space-y-2">
                  {section.list.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className={`text-cream/80 text-sm ${item.indent ? 'ml-6' : ''}`}
                    >
                      {item.label ? (
                        <>
                          <span className="text-amber font-medium">{item.label}:</span>{' '}
                          {item.desc}
                        </>
                      ) : (
                        <span className="flex items-start">
                          <span className="text-amber mr-2">•</span>
                          <span>{item.desc}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
