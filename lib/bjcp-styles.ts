export interface BJCPStyle {
  category: string;
  subcategory: string;
  name: string;
  og: { min: number; max: number };
  fg: { min: number; max: number };
  abv: { min: number; max: number };
  ibu: { min: number; max: number };
  srm: { min: number; max: number };
  description: string;
}

export const BJCP_STYLES: BJCPStyle[] = [
  {
    category: '1',
    subcategory: 'A',
    name: 'American Light Lager',
    og: { min: 1.028, max: 1.040 },
    fg: { min: 0.998, max: 1.008 },
    abv: { min: 2.8, max: 4.2 },
    ibu: { min: 8, max: 12 },
    srm: { min: 2, max: 3 },
    description: 'Highly carbonated, very light-bodied, nearly flavorless lager.'
  },
  {
    category: '5',
    subcategory: 'B',
    name: 'Kölsch',
    og: { min: 1.044, max: 1.050 },
    fg: { min: 1.007, max: 1.011 },
    abv: { min: 4.4, max: 5.2 },
    ibu: { min: 18, max: 30 },
    srm: { min: 3.5, max: 5 },
    description: 'Clean, crisp, delicately-balanced beer with a very soft, rounded palate and gently fruity profile.'
  },
  {
    category: '10',
    subcategory: 'A',
    name: 'Weissbier',
    og: { min: 1.044, max: 1.052 },
    fg: { min: 1.010, max: 1.014 },
    abv: { min: 4.3, max: 5.6 },
    ibu: { min: 8, max: 15 },
    srm: { min: 2, max: 6 },
    description: 'Pale, refreshing, lightly-hopped German wheat beer with high carbonation and distinctive banana-and-clove yeast character.'
  },
  {
    category: '11',
    subcategory: 'A',
    name: 'Ordinary Bitter',
    og: { min: 1.030, max: 1.039 },
    fg: { min: 1.007, max: 1.011 },
    abv: { min: 3.2, max: 3.8 },
    ibu: { min: 25, max: 35 },
    srm: { min: 8, max: 14 },
    description: 'Low gravity, alcohol, and carbonation make it easy to drink in quantity.'
  },
  {
    category: '18',
    subcategory: 'A',
    name: 'Blonde Ale',
    og: { min: 1.038, max: 1.054 },
    fg: { min: 1.008, max: 1.013 },
    abv: { min: 3.8, max: 5.5 },
    ibu: { min: 15, max: 28 },
    srm: { min: 3, max: 6 },
    description: 'Easy-drinking, approachable, malt-oriented American craft beer.'
  },
  {
    category: '18',
    subcategory: 'B',
    name: 'American Pale Ale',
    og: { min: 1.045, max: 1.060 },
    fg: { min: 1.010, max: 1.015 },
    abv: { min: 4.5, max: 6.2 },
    ibu: { min: 30, max: 50 },
    srm: { min: 5, max: 10 },
    description: 'Pale, refreshing, hoppy ale with citrus and pine hop character.'
  },
  {
    category: '19',
    subcategory: 'A',
    name: 'American Amber Ale',
    og: { min: 1.045, max: 1.060 },
    fg: { min: 1.010, max: 1.015 },
    abv: { min: 4.5, max: 6.2 },
    ibu: { min: 25, max: 40 },
    srm: { min: 10, max: 17 },
    description: 'Amber, hoppy, moderate-strength American craft beer with a caramel malty flavor.'
  },
  {
    category: '19',
    subcategory: 'B',
    name: 'California Common',
    og: { min: 1.048, max: 1.054 },
    fg: { min: 1.011, max: 1.014 },
    abv: { min: 4.5, max: 5.5 },
    ibu: { min: 30, max: 45 },
    srm: { min: 10, max: 14 },
    description: 'Lightly fruity beer with firm, grainy maltiness and interesting toasty and caramel flavors.'
  },
  {
    category: '21',
    subcategory: 'A',
    name: 'American IPA',
    og: { min: 1.056, max: 1.070 },
    fg: { min: 1.008, max: 1.014 },
    abv: { min: 5.5, max: 7.5 },
    ibu: { min: 40, max: 70 },
    srm: { min: 6, max: 14 },
    description: 'Decidedly hoppy and bitter, moderately strong American pale ale.'
  },
  {
    category: '21',
    subcategory: 'B',
    name: 'Specialty IPA: New England IPA',
    og: { min: 1.060, max: 1.085 },
    fg: { min: 1.010, max: 1.015 },
    abv: { min: 6.0, max: 9.0 },
    ibu: { min: 25, max: 60 },
    srm: { min: 3, max: 7 },
    description: 'Juicy, fruity, hazy, bitter IPA with intense fruit flavors and aromas.'
  },
  {
    category: '22',
    subcategory: 'A',
    name: 'Double IPA',
    og: { min: 1.065, max: 1.085 },
    fg: { min: 1.008, max: 1.018 },
    abv: { min: 7.5, max: 10.0 },
    ibu: { min: 60, max: 120 },
    srm: { min: 6, max: 14 },
    description: 'Intensely hoppy, fairly strong pale ale without the big, rich, complex maltiness.'
  },
  {
    category: '23',
    subcategory: 'A',
    name: 'Specialty IPA: Belgian IPA',
    og: { min: 1.058, max: 1.080 },
    fg: { min: 1.008, max: 1.016 },
    abv: { min: 6.2, max: 9.5 },
    ibu: { min: 50, max: 100 },
    srm: { min: 5, max: 15 },
    description: 'IPA with fruitiness and spiciness of Belgian yeast along with citrus and pine hop character.'
  },
  {
    category: '13',
    subcategory: 'B',
    name: 'British Brown Ale',
    og: { min: 1.040, max: 1.052 },
    fg: { min: 1.008, max: 1.013 },
    abv: { min: 4.2, max: 5.4 },
    ibu: { min: 20, max: 30 },
    srm: { min: 12, max: 22 },
    description: 'Malty, brown caramel-centric British ale without the roasted flavors of a Porter.'
  },
  {
    category: '15',
    subcategory: 'A',
    name: 'Irish Red Ale',
    og: { min: 1.036, max: 1.046 },
    fg: { min: 1.010, max: 1.014 },
    abv: { min: 3.8, max: 5.0 },
    ibu: { min: 18, max: 28 },
    srm: { min: 9, max: 14 },
    description: 'Easy-drinking pint, often with subtle flavors.'
  },
  {
    category: '20',
    subcategory: 'A',
    name: 'American Porter',
    og: { min: 1.050, max: 1.070 },
    fg: { min: 1.012, max: 1.018 },
    abv: { min: 4.8, max: 6.5 },
    ibu: { min: 25, max: 50 },
    srm: { min: 22, max: 40 },
    description: 'Substantial, malty dark beer with a complex and flavorful dark malt character.'
  },
  {
    category: '20',
    subcategory: 'B',
    name: 'American Stout',
    og: { min: 1.050, max: 1.075 },
    fg: { min: 1.010, max: 1.022 },
    abv: { min: 5.0, max: 7.0 },
    ibu: { min: 35, max: 75 },
    srm: { min: 30, max: 40 },
    description: 'Fairly strong, highly roasted, bitter, hoppy dark stout.'
  },
  {
    category: '20',
    subcategory: 'C',
    name: 'Imperial Stout',
    og: { min: 1.075, max: 1.115 },
    fg: { min: 1.018, max: 1.030 },
    abv: { min: 8.0, max: 12.0 },
    ibu: { min: 50, max: 90 },
    srm: { min: 30, max: 40 },
    description: 'Intensely-flavored, big, dark ale with a wide range of flavor balances.'
  },
  {
    category: '24',
    subcategory: 'A',
    name: 'Witbier',
    og: { min: 1.044, max: 1.052 },
    fg: { min: 1.008, max: 1.012 },
    abv: { min: 4.5, max: 5.5 },
    ibu: { min: 8, max: 20 },
    srm: { min: 2, max: 4 },
    description: 'Refreshing, elegant, tasty, moderate-strength wheat-based ale.'
  },
  {
    category: '25',
    subcategory: 'B',
    name: 'Saison',
    og: { min: 1.048, max: 1.065 },
    fg: { min: 1.002, max: 1.008 },
    abv: { min: 5.0, max: 7.0 },
    ibu: { min: 20, max: 35 },
    srm: { min: 5, max: 14 },
    description: 'Refreshing, medium to strong fruity/spicy ale with distinctive yellow-orange color.'
  },
  {
    category: '26',
    subcategory: 'A',
    name: 'Belgian Pale Ale',
    og: { min: 1.048, max: 1.054 },
    fg: { min: 1.010, max: 1.014 },
    abv: { min: 4.8, max: 5.5 },
    ibu: { min: 20, max: 30 },
    srm: { min: 8, max: 14 },
    description: 'Moderately malty, somewhat fruity, easy-drinking, copper-colored Belgian ale.'
  },
];

export function findMatchingStyle(og: number, fg: number, abv: number, ibu: number, srm: number): BJCPStyle[] {
  return BJCP_STYLES.filter(style => {
    const ogMatch = og >= style.og.min && og <= style.og.max;
    const fgMatch = fg >= style.fg.min && fg <= style.fg.max;
    const abvMatch = abv >= style.abv.min && abv <= style.abv.max;
    const ibuMatch = ibu >= style.ibu.min && ibu <= style.ibu.max;
    const srmMatch = srm >= style.srm.min && srm <= style.srm.max;

    const matches = [ogMatch, fgMatch, abvMatch, ibuMatch, srmMatch].filter(Boolean).length;
    return matches >= 3;
  });
}
