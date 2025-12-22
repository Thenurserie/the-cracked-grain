export interface BeerStyleIngredients {
  style: string;
  description: string;
  ingredients: {
    malt: string[];
    hops: string[];
    yeast: string;
    other?: string[];
  };
}

export const BEER_STYLES: BeerStyleIngredients[] = [
  {
    style: 'Pale Ale',
    description: 'Balanced, hoppy beer with moderate bitterness and light malt sweetness',
    ingredients: {
      malt: ['Pale Malt (6-8 lbs)', 'Crystal/Caramel Malt 60L (0.5 lbs)'],
      hops: ['Cascade hops (1 oz bittering)', 'Cascade hops (1 oz aroma)'],
      yeast: 'American Ale Yeast (US-05 or similar)',
      other: ['Priming Sugar', 'Irish Moss (clarifier)'],
    },
  },
  {
    style: 'IPA (India Pale Ale)',
    description: 'Hop-forward beer with high bitterness, floral and citrus notes',
    ingredients: {
      malt: ['Pale Malt (10-12 lbs)', 'Crystal Malt 40L (0.5 lbs)', 'Carapils (0.5 lbs)'],
      hops: ['Chinook hops (1 oz bittering)', 'Cascade hops (1 oz flavor)', 'Citra hops (2 oz aroma/dry hop)'],
      yeast: 'American Ale Yeast (US-05 or Chico strain)',
      other: ['Priming Sugar', 'Yeast Nutrient'],
    },
  },
  {
    style: 'Stout',
    description: 'Dark, rich beer with roasted malt flavors and coffee/chocolate notes',
    ingredients: {
      malt: ['Pale Malt (8 lbs)', 'Roasted Barley (1 lb)', 'Crystal Malt 60L (0.5 lbs)', 'Flaked Barley (0.5 lbs)'],
      hops: ['East Kent Goldings hops (1.5 oz bittering)'],
      yeast: 'Irish Ale Yeast (WLP004 or similar)',
      other: ['Priming Sugar', 'Lactose (for milk stout, optional)'],
    },
  },
  {
    style: 'Porter',
    description: 'Dark ale with chocolate and toffee flavors, lighter than stout',
    ingredients: {
      malt: ['Pale Malt (7 lbs)', 'Chocolate Malt (0.75 lbs)', 'Crystal Malt 60L (0.5 lbs)', 'Black Patent Malt (0.25 lbs)'],
      hops: ['Fuggles hops (1 oz bittering)', 'East Kent Goldings (0.5 oz aroma)'],
      yeast: 'English Ale Yeast (S-04 or similar)',
      other: ['Priming Sugar', 'Irish Moss'],
    },
  },
  {
    style: 'Wheat Beer',
    description: 'Light, refreshing beer with wheat malt and often fruity/spicy notes',
    ingredients: {
      malt: ['Wheat Malt (5 lbs)', 'Pilsner Malt (5 lbs)'],
      hops: ['Hallertau hops (1 oz bittering)'],
      yeast: 'German Wheat Beer Yeast (WB-06 or similar)',
      other: ['Priming Sugar', 'Coriander (optional)', 'Orange Peel (optional)'],
    },
  },
  {
    style: 'Blonde Ale',
    description: 'Light, easy-drinking ale with subtle malt and hop character',
    ingredients: {
      malt: ['Pale Malt (8 lbs)', 'Carapils (0.5 lbs)', 'Honey Malt (0.25 lbs)'],
      hops: ['Liberty hops (0.75 oz bittering)', 'Mt. Hood hops (0.5 oz aroma)'],
      yeast: 'American Ale Yeast (US-05)',
      other: ['Priming Sugar'],
    },
  },
  {
    style: 'Amber Ale',
    description: 'Balanced beer with caramel malt sweetness and moderate hop character',
    ingredients: {
      malt: ['Pale Malt (8 lbs)', 'Crystal Malt 60L (1 lb)', 'Munich Malt (1 lb)'],
      hops: ['Cascade hops (1 oz bittering)', 'Willamette hops (1 oz aroma)'],
      yeast: 'American Ale Yeast (US-05)',
      other: ['Priming Sugar', 'Irish Moss'],
    },
  },
  {
    style: 'Pilsner',
    description: 'Crisp, clean lager with noble hop character and light malt',
    ingredients: {
      malt: ['Pilsner Malt (9 lbs)', 'Carapils (0.5 lbs)'],
      hops: ['Saaz hops (1.5 oz bittering)', 'Saaz hops (1 oz aroma)'],
      yeast: 'Czech Pilsner Lager Yeast (W-34/70 or similar)',
      other: ['Priming Sugar', 'Calcium Chloride'],
    },
  },
];
