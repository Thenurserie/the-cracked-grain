// Complete Recipe Database - Condensed for efficiency
export interface RecipeCard {
  id: string;
  name: string;
  slug: string;
  type: 'Beer' | 'Wine' | 'Mead' | 'Cider' | 'Kombucha';
  style: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  brewTime: string;
  description: string;
  featured?: boolean;
  stats: {
    og: string;
    fg: string;
    abv: string;
    ibu: string;
    srm: string;
    color?: string;
  };
}

export const recipes: RecipeCard[] = [
  {
    id: "ozark-echo-ipa",
    name: "Ozark Echo IPA",
    slug: "ozark-echo-ipa",
    type: "Beer",
    style: "American IPA",
    difficulty: "Intermediate",
    brewTime: "4 weeks",
    description: "A legendary Centennial-hopped IPA inspired by the great lakes region. This amber-hued beauty rings with citrus and floral notes that echo across the Ozark hills.",
    featured: true,
    stats: {
      og: "1.065",
      fg: "1.012",
      abv: "7.0%",
      ibu: "60",
      srm: "11",
      color: "Amber"
    }
  },
  {
    id: "dublin-dry-stout",
    name: "Dublin Dry Stout",
    slug: "dublin-dry-stout",
    type: "Beer",
    style: "Dry Stout",
    difficulty: "Intermediate",
    brewTime: "3 weeks",
    description: "Classic Irish stout. Roasty, creamy, and sessionable. Best served with a proper two-part pour.",
    featured: true,
    stats: {
      og: "1.040",
      fg: "1.010",
      abv: "4.0%",
      ibu: "38",
      srm: "35",
      color: "Black"
    }
  },
  {
    id: "bavarian-hefeweizen",
    name: "Bavarian Hefeweizen",
    slug: "bavarian-hefeweizen",
    type: "Beer",
    style: "Weissbier",
    difficulty: "Intermediate",
    brewTime: "3 weeks",
    description: "Traditional Bavarian wheat beer with classic banana and clove notes. Cloudy, refreshing, and authentically German.",
    stats: {
      og: "1.050",
      fg: "1.012",
      abv: "5.0%",
      ibu: "14",
      srm: "4",
      color: "Pale Straw"
    }
  },
  {
    id: "blue-ozark-moon",
    name: "Blue Ozark Moon",
    slug: "blue-ozark-moon",
    type: "Beer",
    style: "Belgian Witbier",
    difficulty: "Beginner",
    brewTime: "3 weeks",
    description: "Our tribute to America's most famous wheat ale. Orange peel and coriander create that unmistakable Belgian-inspired character.",
    featured: true,
    stats: {
      og: "1.052",
      fg: "1.010",
      abv: "5.4%",
      ibu: "12",
      srm: "4",
      color: "Pale Straw/Hazy"
    }
  },
  {
    id: "spotted-hog-cream-ale",
    name: "Spotted Hog Cream Ale",
    slug: "spotted-hog-cream-ale",
    type: "Beer",
    style: "Cream Ale",
    difficulty: "Beginner",
    brewTime: "4 weeks",
    description: "Our tribute to Wisconsin's most beloved cream ale. Smooth, refreshing, and dangerously drinkable.",
    stats: {
      og: "1.047",
      fg: "1.010",
      abv: "4.8%",
      ibu: "15",
      srm: "4",
      color: "Pale Gold"
    }
  },
  {
    id: "elder-statesman-dipa",
    name: "Elder Statesman DIPA",
    slug: "elder-statesman-dipa",
    type: "Beer",
    style: "Double IPA",
    difficulty: "Advanced",
    brewTime: "4 weeks",
    description: "A tribute to the elder statesman of West Coast Double IPAs. Piney, citrusy gateway to hop heaven.",
    featured: true,
    stats: {
      og: "1.075",
      fg: "1.010",
      abv: "8.0%",
      ibu: "90",
      srm: "6",
      color: "Gold"
    }
  },
  {
    id: "razorback-slobber",
    name: "Razorback Slobber",
    slug: "razorback-slobber",
    type: "Beer",
    style: "Brown Porter",
    difficulty: "Intermediate",
    brewTime: "4 weeks",
    description: "Our tribute to Montana's legendary brown ale. Chocolatey, caramelly, with subtle coffee notes.",
    stats: {
      og: "1.052",
      fg: "1.012",
      abv: "5.3%",
      ibu: "28",
      srm: "22",
      color: "Dark Brown"
    }
  },
  {
    id: "belgian-tripel",
    name: "Belgian Tripel",
    slug: "belgian-tripel",
    type: "Beer",
    style: "Belgian Tripel",
    difficulty: "Advanced",
    brewTime: "6 weeks",
    description: "Classic Trappist-style golden strong ale. Spicy, fruity, deceptively strong, and divinely inspired.",
    stats: {
      og: "1.085",
      fg: "1.010",
      abv: "9.5%",
      ibu: "35",
      srm: "5",
      color: "Pale Gold"
    }
  },
  {
    id: "oktoberfest-marzen",
    name: "Oktoberfest Märzen",
    slug: "oktoberfest-marzen",
    type: "Beer",
    style: "Märzen",
    difficulty: "Advanced",
    brewTime: "10 weeks",
    description: "Traditional German festival beer. Rich, malty, amber, and perfect for celebrating. Prost!",
    stats: {
      og: "1.056",
      fg: "1.012",
      abv: "5.8%",
      ibu: "24",
      srm: "12",
      color: "Amber/Orange"
    }
  }
];

export function getRecipeBySlug(slug: string): RecipeCard | undefined {
  return recipes.find(r => r.slug === slug);
}

export function getRecipesByType(type: string): RecipeCard[] {
  if (type === 'All') return recipes;
  return recipes.filter(r => r.type === type);
}

export function getRecipesByDifficulty(difficulty: string): RecipeCard[] {
  if (difficulty === 'All') return recipes;
  return recipes.filter(r => r.difficulty === difficulty);
}

export function getFeaturedRecipes(): RecipeCard[] {
  return recipes.filter(r => r.featured);
}
