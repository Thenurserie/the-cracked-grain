// ============================================================================
// DIRECTUS API CONFIGURATION
// ============================================================================

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://admin.thecrackedgrain.com';
const DIRECTUS_TOKEN = '5KmoigBiCbbPPKdyVSHW48EzrNk5lIzr';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface RecipeFermentable {
  name: string;
  amount: string;
  unit: string;
  percentage?: string;
  notes?: string;
}

export interface RecipeMethod {
  type: 'all-grain' | 'lme' | 'dme';
  fermentables: RecipeFermentable[];
  instructions: string[];
  water_volumes?: {
    strike?: string;
    sparge?: string;
    preboil?: string;
  };
  mash_temp?: string;
  mash_time?: string;
  steep_temp?: string;
  steep_time?: string;
  notes?: string[];
}

export interface RecipeHop {
  name: string;
  amount: string;
  time: string;
  purpose: string;
  ibu?: number;
}

export interface RecipeYeast {
  name: string;
  lab: string;
  type: string;
  notes?: string;
}

export interface RecipeFermentationStep {
  day: string;
  instruction: string;
  notes?: string;
}

export interface RecipePackaging {
  bottling?: {
    priming_sugar: string;
    co2_volumes: string;
    bottle_count: string;
    condition_time: string;
    condition_temp: string;
  };
  kegging?: {
    psi: string;
    temp: string;
    ready_time: string;
    notes?: string;
  };
}

export interface RecipeTips {
  dos?: string[];
  donts?: string[];
  water_chemistry?: string;
}

export interface Recipe {
  id: string;
  status: string;
  slug: string;
  name: string;
  type: string;
  style: string;
  bjcp_style?: string;
  difficulty: string;
  batch_size: string;
  brew_time: string;
  description: string;
  featured?: boolean;
  og?: string;
  fg?: string;
  abv?: string;
  ibu?: string;
  srm?: string;
  color?: string;
  methods?: RecipeMethod[];
  hops?: RecipeHop[];
  total_hops?: string;
  boil_time?: string;
  yeast?: RecipeYeast[];
  fermentation_temp?: string;
  fermentation?: RecipeFermentationStep[];
  packaging?: RecipePackaging;
  tips?: RecipeTips;
  food_pairing?: string[];
  date_created?: string;
  date_updated?: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  product_id: string;
  method_type?: string;
  ingredient_type: string;
  amount?: string;
  unit?: string;
  timing?: string;
  notes?: string;
  sort_order?: number;
}

// ============================================================================
// ASSET URL HELPER
// ============================================================================

/**
 * Get the Directus asset URL with optional transforms
 * @param imageId - The UUID of the image in Directus
 * @param options - Transform options (width, height, quality, fit)
 * @returns The full URL to the Directus asset with transforms
 */
export function getDirectusAssetUrl(
  imageId: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
  }
): string {
  if (!imageId) {
    return '/images/placeholder-product.svg';
  }

  // If it's already a full URL, return it as-is
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
    return imageId;
  }

  // Construct the Directus asset URL
  let url = `${DIRECTUS_URL}/assets/${imageId}`;

  // Add Directus transform parameters
  if (options) {
    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.fit) params.append('fit', options.fit);

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
}

// ============================================================================
// RECIPE API FUNCTIONS
// ============================================================================

/**
 * Fetch all published recipes from Directus
 * @param options - Optional filter and sort parameters
 * @returns Array of recipes
 */
export async function getRecipes(options?: {
  type?: string;
  difficulty?: string;
  featured?: boolean;
}): Promise<Recipe[]> {
  try {
    // Build filter query - don't filter by status, get all recipes
    const filters: string[] = [];

    if (options?.type) {
      filters.push(`filter[type][_eq]=${encodeURIComponent(options.type)}`);
    }
    if (options?.difficulty) {
      filters.push(`filter[difficulty][_eq]=${encodeURIComponent(options.difficulty)}`);
    }
    if (options?.featured !== undefined) {
      filters.push(`filter[featured][_eq]=${options.featured}`);
    }

    const queryString = filters.length > 0 ? filters.join('&') + '&' : '';
    const url = `${DIRECTUS_URL}/items/recipes?${queryString}sort=-featured,-created_at&limit=-1`;

    // Use Next.js revalidation only on server-side
    const fetchOptions = typeof window === 'undefined'
      ? { next: { revalidate: 60 } }
      : {};

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Fetch a single recipe by slug
 * @param slug - The recipe slug
 * @returns Recipe object or null
 */
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const url = `${DIRECTUS_URL}/items/recipes?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`;

    // Use Next.js revalidation only on server-side
    const fetchOptions = typeof window === 'undefined'
      ? { next: { revalidate: 60 } }
      : {};

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

/**
 * Fetch recipe ingredients with linked product data
 * @param recipeId - The recipe UUID
 * @returns Array of recipe ingredients with product details
 */
export async function getRecipeIngredients(recipeId: string): Promise<any[]> {
  try {
    const url = `${DIRECTUS_URL}/items/recipe_ingredients?filter[recipe_id][_eq]=${recipeId}&fields=*,product_id.*&sort=sort_order`;

    // Use Next.js revalidation only on server-side
    const fetchOptions = typeof window === 'undefined'
      ? { next: { revalidate: 60 } }
      : {};

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe ingredients: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching recipe ingredients:', error);
    return [];
  }
}

/**
 * Get all unique recipe types
 * @returns Array of recipe types
 */
export async function getRecipeTypes(): Promise<string[]> {
  try {
    const recipes = await getRecipes();
    const types = Array.from(new Set(recipes.map(r => r.type)));
    return types.sort();
  } catch (error) {
    console.error('Error fetching recipe types:', error);
    return [];
  }
}

/**
 * Get all unique difficulty levels
 * @returns Array of difficulty levels
 */
export async function getDifficultyLevels(): Promise<string[]> {
  try {
    const recipes = await getRecipes();
    const levels = Array.from(new Set(recipes.map(r => r.difficulty)));
    return levels.sort();
  } catch (error) {
    console.error('Error fetching difficulty levels:', error);
    return [];
  }
}
