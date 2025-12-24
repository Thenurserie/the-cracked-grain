export interface KitCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  allowSkip: boolean;  // "I already have one"
  productFilter: {
    category?: string;      // Directus category to filter
    tags?: string[];        // Product tags to match
    searchTerms?: string[]; // Fallback search terms
  };
  helpText?: string;
}

export interface KitBuilderStep {
  id: string;
  title: string;
  type: 'choice' | 'products' | 'accessories';
  options?: { value: string; label: string; description?: string }[];
  categories?: KitCategory[];
  showIf?: { beverageType?: string };
}

export const kitBuilderSteps: KitBuilderStep[] = [
  {
    id: 'experience-level',
    title: "What's your brewing experience?",
    type: 'choice',
    options: [
      { value: 'beginner', label: 'Complete Beginner', description: "I've never brewed before" },
      { value: 'some', label: 'Some Experience', description: "I've brewed a few batches" },
      { value: 'experienced', label: 'Experienced', description: 'I know what I need' },
    ],
  },
  {
    id: 'beverage-type',
    title: 'What are you brewing?',
    type: 'choice',
    options: [
      { value: 'beer', label: 'Beer', description: 'Ales, lagers, stouts, IPAs' },
      { value: 'wine', label: 'Wine', description: 'Grape, fruit, or country wines' },
      { value: 'mead', label: 'Mead', description: 'Honey-based beverages' },
      { value: 'cider', label: 'Cider', description: 'Apple or pear cider' },
      { value: 'kombucha', label: 'Kombucha', description: 'Fermented tea' },
    ],
  },
  {
    id: 'batch-size',
    title: 'What batch size?',
    type: 'choice',
    options: [
      { value: '1-gallon', label: '1 Gallon', description: 'Perfect for beginners or experiments' },
      { value: '5-gallon', label: '5 Gallon', description: 'Standard homebrew batch (~50 bottles)' },
      { value: '10-gallon', label: '10 Gallon', description: 'Advanced brewers (~100 bottles)' },
    ],
  },
  {
    id: 'brewing-method',
    title: 'Brewing method?',
    type: 'choice',
    showIf: { beverageType: 'beer' },  // Only show for beer
    options: [
      { value: 'extract', label: 'Extract Brewing (DME/LME)', description: 'Beginner-friendly, less equipment needed' },
      { value: 'all-grain', label: 'All-Grain', description: 'Full control, traditional method' },
    ],
  },
  {
    id: 'equipment',
    title: 'Select your equipment',
    type: 'products',
    categories: [
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
      },
    ],
  },
  {
    id: 'essentials',
    title: 'Essential accessories',
    type: 'accessories',
    categories: [
      {
        id: 'siphon',
        name: 'Auto-Siphon',
        description: 'Transfer beer without disturbing sediment',
        required: true,
        allowSkip: true,
        productFilter: {
          category: 'Equipment',
          tags: ['siphon', 'auto-siphon', 'racking'],
          searchTerms: ['auto siphon', 'racking cane'],
        },
      },
      {
        id: 'hydrometer',
        name: 'Hydrometer',
        description: 'Measure alcohol content and fermentation progress',
        required: true,
        allowSkip: true,
        productFilter: {
          category: 'Equipment',
          tags: ['hydrometer', 'testing'],
          searchTerms: ['hydrometer', 'triple scale hydrometer'],
        },
      },
      {
        id: 'thermometer',
        name: 'Thermometer',
        description: 'Monitor temperatures during brewing',
        required: true,
        allowSkip: true,
        productFilter: {
          category: 'Equipment',
          tags: ['thermometer', 'temperature'],
          searchTerms: ['brewing thermometer', 'dial thermometer'],
        },
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
      },
      {
        id: 'sanitizer',
        name: 'Sanitizer',
        description: 'Sanitation is the #1 key to good beer',
        required: true,
        allowSkip: false,  // Everyone needs sanitizer
        productFilter: {
          category: 'Chemicals',
          tags: ['sanitizer', 'star san', 'cleaning'],
          searchTerms: ['star san', 'sanitizer', 'no rinse sanitizer'],
        },
      },
    ],
  },
  {
    id: 'upgrades',
    title: 'Optional upgrades',
    type: 'accessories',
    categories: [
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
      },
      {
        id: 'brew-bag',
        name: 'Brew Bag',
        description: 'For BIAB or steeping grains',
        required: false,
        allowSkip: true,
        productFilter: {
          category: 'Equipment',
          tags: ['brew bag', 'biab', 'grain bag'],
          searchTerms: ['brew bag', 'biab bag', 'grain bag'],
        },
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
      },
      {
        id: 'fermentation-temp',
        name: 'Temperature Control',
        description: 'Maintain consistent fermentation temps',
        required: false,
        allowSkip: true,
        productFilter: {
          category: 'Equipment',
          tags: ['temperature controller', 'fermentation chamber', 'inkbird'],
          searchTerms: ['temperature controller', 'inkbird', 'fermentation control'],
        },
      },
    ],
  },
];

// Bundle discount configuration
export const bundleDiscounts = {
  minItemsForDiscount: 5,
  discountPercent: 10,  // 10% off when buying 5+ items
  maxDiscountPercent: 15,  // 15% off when buying 8+ items
  maxDiscountThreshold: 8,
};
