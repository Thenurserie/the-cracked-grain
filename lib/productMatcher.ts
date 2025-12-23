/**
 * Product Matching Utility
 * Matches recipe ingredients to products in the database
 */

export interface ProductMatch {
  query: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    slug: string;
  } | null;
  price: number | null;
  unit: string;
  confidence: 'exact' | 'high' | 'medium' | 'low' | 'none';
}

/**
 * Calculate match confidence score between ingredient and product name
 */
function calculateMatchScore(ingredientName: string, productName: string): number {
  const ingredient = ingredientName.toLowerCase().trim();
  const product = productName.toLowerCase().trim();

  // Exact match
  if (ingredient === product) return 100;

  // Check if ingredient is contained in product name
  if (product.includes(ingredient)) return 90;

  // Check if product is contained in ingredient name
  if (ingredient.includes(product)) return 85;

  // Word-by-word matching
  const ingredientWords = ingredient.split(/\s+/);
  const productWords = product.split(/\s+/);

  let matchingWords = 0;
  for (const iWord of ingredientWords) {
    if (productWords.some(pWord => pWord.includes(iWord) || iWord.includes(pWord))) {
      matchingWords++;
    }
  }

  const wordMatchRatio = matchingWords / Math.max(ingredientWords.length, productWords.length);
  return Math.floor(wordMatchRatio * 80);
}

/**
 * Determine unit of measurement based on product category and name
 */
function determineUnit(product: any): string {
  const name = product.name.toLowerCase();
  const category = product.category?.toLowerCase() || '';

  // Hops are typically sold by the ounce
  if (category.includes('hop') || name.includes('hop')) {
    return 'oz';
  }

  // Yeast is sold by the packet/package
  if (category.includes('yeast') || name.includes('yeast')) {
    return 'pkg';
  }

  // Grains and malts are sold by the pound
  if (category.includes('grain') || category.includes('malt') ||
      name.includes('malt') || name.includes('grain')) {
    return 'lb';
  }

  // Default to each/unit
  return 'ea';
}

/**
 * Find the best matching product for an ingredient
 */
export async function findMatchingProduct(
  ingredientName: string,
  category?: string
): Promise<ProductMatch> {
  try {
    const params = new URLSearchParams({
      q: ingredientName,
      limit: '10'
    });

    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`/api/products?${params}`);

    if (!response.ok) {
      return {
        query: ingredientName,
        product: null,
        price: null,
        unit: 'lb',
        confidence: 'none'
      };
    }

    const products = await response.json();

    if (!products || products.length === 0) {
      return {
        query: ingredientName,
        product: null,
        price: null,
        unit: 'lb',
        confidence: 'none'
      };
    }

    // Find best match
    let bestMatch = products[0];
    let bestScore = calculateMatchScore(ingredientName, bestMatch.name);

    for (const product of products.slice(1)) {
      const score = calculateMatchScore(ingredientName, product.name);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = product;
      }
    }

    // Determine confidence level
    let confidence: ProductMatch['confidence'];
    if (bestScore >= 95) confidence = 'exact';
    else if (bestScore >= 80) confidence = 'high';
    else if (bestScore >= 60) confidence = 'medium';
    else if (bestScore >= 40) confidence = 'low';
    else confidence = 'none';

    // Only return matches with medium or higher confidence
    if (confidence === 'low' || confidence === 'none') {
      return {
        query: ingredientName,
        product: null,
        price: null,
        unit: 'lb',
        confidence: 'none'
      };
    }

    return {
      query: ingredientName,
      product: {
        id: bestMatch.id,
        name: bestMatch.name,
        price: Number(bestMatch.price),
        imageUrl: bestMatch.image_url || bestMatch.imageUrl,
        slug: bestMatch.slug
      },
      price: Number(bestMatch.price),
      unit: determineUnit(bestMatch),
      confidence
    };
  } catch (error) {
    console.error('Error matching product:', error);
    return {
      query: ingredientName,
      product: null,
      price: null,
      unit: 'lb',
      confidence: 'none'
    };
  }
}

/**
 * Batch match multiple ingredients
 */
export async function batchMatchProducts(
  ingredients: Array<{ name: string; category?: string }>
): Promise<ProductMatch[]> {
  const matches = await Promise.all(
    ingredients.map(ing => findMatchingProduct(ing.name, ing.category))
  );

  return matches;
}

/**
 * Generate a shopping list from ingredients
 */
export interface ShoppingListItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price?: number;
  productId?: string;
}

export function generateShoppingList(
  fermentables: Array<{ name: string; weight: number }>,
  hops: Array<{ name: string; amount: number }>,
  yeast: { name: string } | null,
  matches: ProductMatch[]
): ShoppingListItem[] {
  const list: ShoppingListItem[] = [];

  // Add fermentables
  fermentables.forEach((f, index) => {
    const match = matches.find(m => m.query === f.name);
    list.push({
      name: f.name,
      quantity: f.weight,
      unit: 'lb',
      category: 'Grains',
      price: match?.price ? match.price * f.weight : undefined,
      productId: match?.product?.id
    });
  });

  // Add hops
  hops.forEach(h => {
    const match = matches.find(m => m.query === h.name);
    list.push({
      name: h.name,
      quantity: h.amount,
      unit: 'oz',
      category: 'Hops',
      price: match?.price ? match.price * h.amount : undefined,
      productId: match?.product?.id
    });
  });

  // Add yeast
  if (yeast) {
    const match = matches.find(m => m.query === yeast.name);
    list.push({
      name: yeast.name,
      quantity: 1,
      unit: 'pkg',
      category: 'Yeast',
      price: match?.price || undefined,
      productId: match?.product?.id
    });
  }

  return list;
}

/**
 * Format shopping list as text for copying
 */
export function formatShoppingListText(
  recipeName: string,
  list: ShoppingListItem[],
  totalCost: number
): string {
  const sections = {
    'Grains': list.filter(i => i.category === 'Grains'),
    'Hops': list.filter(i => i.category === 'Hops'),
    'Yeast': list.filter(i => i.category === 'Yeast'),
    'Other': list.filter(i => !['Grains', 'Hops', 'Yeast'].includes(i.category))
  };

  let text = `SHOPPING LIST FOR: ${recipeName}\n`;
  text += '='.repeat(50) + '\n\n';

  Object.entries(sections).forEach(([category, items]) => {
    if (items.length > 0) {
      text += `${category.toUpperCase()}:\n`;
      items.forEach(item => {
        text += `☐ ${item.name} - ${item.quantity} ${item.unit}`;
        if (item.price) {
          text += ` ($${item.price.toFixed(2)})`;
        }
        text += '\n';
      });
      text += '\n';
    }
  });

  text += `ESTIMATED TOTAL: $${totalCost.toFixed(2)}\n`;

  return text;
}
