export interface KitCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  allowSkip: boolean;
  productFilter: {
    category?: string;
    tags?: string[];
    searchTerms?: string[];
  };
  helpText?: string;
  why?: string; // Educational: why this item is needed
}

export interface KitTier {
  id: 'starter' | 'intermediate' | 'premium';
  name: string;
  description: string;
  price: string;
  includedCategories: string[]; // IDs of categories included in this tier
  recommended: string; // Who this kit is for
}

export const kitTiers: KitTier[] = [
  {
    id: 'starter',
    name: 'Starter Kit',
    description: 'Everything you need to brew your first batch',
    price: '$85-$120',
    recommended: 'Perfect for complete beginners wanting to try homebrewing',
    includedCategories: ['fermenter', 'bottling', 'sanitizer', 'airlock'],
  },
  {
    id: 'intermediate',
    name: 'Intermediate Kit',
    description: 'Enhanced setup with measuring and transfer tools',
    price: '$160-$200',
    recommended: 'For brewers ready to refine their technique and consistency',
    includedCategories: ['kettle', 'fermenter', 'bottling', 'siphon', 'hydrometer', 'thermometer', 'airlock', 'sanitizer'],
  },
  {
    id: 'premium',
    name: 'Premium Kit',
    description: 'Professional-grade complete brewing system',
    price: '$270-$350',
    recommended: 'For serious brewers who want the best equipment from day one',
    includedCategories: ['kettle', 'fermenter', 'bottling', 'siphon', 'hydrometer', 'thermometer', 'airlock', 'sanitizer', 'wort-chiller', 'refractometer', 'ph-meter'],
  },
];

export interface KitBuilderStep {
  id: string;
  title: string;
  type: 'tier-selection' | 'equipment' | 'ingredients';
  categories?: KitCategory[];
  showIf?: { beverageType?: string };
}

// All available equipment categories
export const equipmentCategories: KitCategory[] = [
  {
    id: 'kettle',
    name: 'Brew Kettle',
    description: 'For boiling your wort or must',
    required: true,
    allowSkip: true,
    productFilter: {
      category: 'Equipment',
      tags: ['kettle', 'brew kettle', 'pot'],
      searchTerms: ['kettle', 'brew pot', 'boil kettle'],
    },
    helpText: 'Choose a kettle at least 2 gallons larger than your batch size',
    why: 'Essential for boiling wort and sterilizing your brewing liquid. A larger kettle prevents boilovers.',
  },
  {
    id: 'fermenter',
    name: 'Fermenter',
    description: 'Where fermentation happens',
    required: true,
    allowSkip: true,
    productFilter: {
      category: 'Fermentation',
      tags: ['fermenter', 'carboy', 'bucket', 'fermentation'],
      searchTerms: ['fermenter', 'carboy', 'fermentation bucket'],
    },
    helpText: 'Bucket fermenters are great for beginners, carboys let you watch fermentation',
    why: 'Your beer ferments here for 1-2 weeks. Buckets are easier to clean, glass carboys let you monitor progress.',
  },
  {
    id: 'bottling',
    name: 'Bottling Equipment',
    description: 'For packaging your finished brew',
    required: true,
    allowSkip: true,
    productFilter: {
      category: 'Bottling',
      tags: ['bottling', 'bottle', 'capper', 'bottling kit'],
      searchTerms: ['bottling kit', 'bottle capper', 'bottling equipment'],
    },
    helpText: 'Skip if you plan to keg instead of bottle',
    why: 'Includes bottle filler, capper, and caps. Bottling lets you share and store your beer easily.',
  },
  {
    id: 'siphon',
    name: 'Auto-Siphon',
    description: 'Transfer beer without disturbing sediment',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Equipment',
      tags: ['siphon', 'auto-siphon', 'racking'],
      searchTerms: ['auto siphon', 'racking cane'],
    },
    why: 'Cleanly transfers beer while leaving sediment behind, resulting in clearer beer.',
  },
  {
    id: 'hydrometer',
    name: 'Hydrometer',
    description: 'Measure alcohol content and fermentation progress',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Equipment',
      tags: ['hydrometer', 'testing'],
      searchTerms: ['hydrometer', 'triple scale hydrometer'],
    },
    why: 'Measures sugar content to calculate alcohol % and confirm fermentation is complete.',
  },
  {
    id: 'thermometer',
    name: 'Thermometer',
    description: 'Monitor temperatures during brewing',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Equipment',
      tags: ['thermometer', 'temperature'],
      searchTerms: ['brewing thermometer', 'dial thermometer'],
    },
    why: 'Critical for yeast health. Pitching yeast at the right temperature (65-75°F) ensures good fermentation.',
  },
  {
    id: 'airlock',
    name: 'Airlock & Stopper',
    description: 'Lets CO2 escape during fermentation',
    required: true,
    allowSkip: true,
    productFilter: {
      category: 'Equipment',
      tags: ['airlock', 'stopper', 'bung'],
      searchTerms: ['airlock', 'stopper', '3-piece airlock'],
    },
    why: 'Allows CO2 to escape while preventing oxygen and contaminants from entering your fermenter.',
  },
  {
    id: 'sanitizer',
    name: 'Sanitizer',
    description: 'Sanitation is the #1 key to good beer',
    required: true,
    allowSkip: false,
    productFilter: {
      category: 'Chemicals',
      tags: ['sanitizer', 'star san', 'cleaning'],
      searchTerms: ['star san', 'sanitizer', 'no rinse sanitizer'],
    },
    why: 'Most important item! Star San kills bacteria and wild yeast that would ruin your beer. "Sanitize everything!"',
  },
  {
    id: 'wort-chiller',
    name: 'Wort Chiller',
    description: 'Cool wort quickly for clearer beer',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Equipment',
      tags: ['wort chiller', 'chiller', 'immersion chiller'],
      searchTerms: ['wort chiller', 'immersion chiller'],
    },
    why: 'Rapidly cools wort from boiling to pitching temperature, reducing chill haze and infection risk.',
  },
  {
    id: 'refractometer',
    name: 'Refractometer',
    description: 'Quick gravity readings with just a few drops',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Equipment',
      tags: ['refractometer'],
      searchTerms: ['refractometer', 'brix refractometer'],
    },
    why: 'Faster than a hydrometer, uses only 2-3 drops. Great for monitoring fermentation without wasting beer.',
  },
  {
    id: 'ph-meter',
    name: 'pH Meter',
    description: 'Monitor mash and water pH',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Equipment',
      tags: ['ph meter', 'ph tester'],
      searchTerms: ['ph meter', 'ph tester'],
    },
    why: 'Proper pH (5.2-5.6) improves efficiency and flavor. More important for all-grain brewing.',
  },
];

// Ingredient/Chemical categories
export const ingredientCategories: KitCategory[] = [
  {
    id: 'yeast-nutrient',
    name: 'Yeast Nutrient',
    description: 'Boost yeast health and fermentation',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Ingredients',
      tags: ['yeast nutrient', 'nutrient'],
      searchTerms: ['yeast nutrient', 'fermaid'],
    },
    why: 'Provides vitamins and minerals for healthy yeast. Especially important for high-gravity beers and mead.',
  },
  {
    id: 'pectic-enzyme',
    name: 'Pectic Enzyme',
    description: 'Improve clarity in fruit wines',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Ingredients',
      tags: ['pectic enzyme', 'pectinase'],
      searchTerms: ['pectic enzyme', 'pectinase'],
    },
    why: 'Breaks down pectin in fruit wines, preventing haze. Essential for apple, peach, and berry wines.',
  },
  {
    id: 'potassium-sorbate',
    name: 'Potassium Sorbate',
    description: 'Stabilize sweet wines',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Chemicals',
      tags: ['potassium sorbate', 'stabilizer'],
      searchTerms: ['potassium sorbate', 'wine stabilizer'],
    },
    why: 'Prevents re-fermentation in sweet wines. Use with potassium metabisulfite to back-sweeten safely.',
  },
  {
    id: 'acid-blend',
    name: 'Acid Blend',
    description: 'Balance wine acidity',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Ingredients',
      tags: ['acid blend', 'tartaric acid'],
      searchTerms: ['acid blend', 'wine acid'],
    },
    why: 'Balances pH and adds tartness to wines. Use when fruit lacks natural acidity.',
  },
  {
    id: 'campden-tablets',
    name: 'Campden Tablets',
    description: 'Sanitize must and prevent oxidation',
    required: false,
    allowSkip: true,
    productFilter: {
      category: 'Chemicals',
      tags: ['campden', 'metabisulfite'],
      searchTerms: ['campden tablets', 'potassium metabisulfite'],
    },
    why: 'Kills wild yeast and bacteria in must before fermentation. Also prevents oxidation during aging.',
  },
];

export const kitBuilderSteps: KitBuilderStep[] = [
  {
    id: 'tier-selection',
    title: 'Choose Your Kit Level',
    type: 'tier-selection',
  },
  {
    id: 'equipment',
    title: 'Customize Your Equipment',
    type: 'equipment',
    categories: equipmentCategories,
  },
  {
    id: 'ingredients',
    title: 'Add Brewing Chemicals & Ingredients',
    type: 'ingredients',
    categories: ingredientCategories,
  },
];

// Bundle discount configuration
export const bundleDiscounts = {
  minItemsForDiscount: 5,
  discountPercent: 10,
  maxDiscountPercent: 15,
  maxDiscountThreshold: 8,
};
