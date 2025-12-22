'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Beaker, ExternalLink, Package } from 'lucide-react';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';
import { BEER_STYLES, BeerStyleIngredients } from '@/data/beer-recipes';
import { ProductImage } from '@/components/ProductImage';

interface IngredientBuilderProps {
  title: string;
  defaultStyle?: string;
}

interface IngredientItem {
  name: string;
  category: string;
  searchTerm: string;
}

export function IngredientBuilder({ title, defaultStyle }: IngredientBuilderProps) {
  const [selectedStyle, setSelectedStyle] = useState<BeerStyleIngredients | null>(
    defaultStyle ? BEER_STYLES.find(s => s.style === defaultStyle) || BEER_STYLES[0] : BEER_STYLES[0]
  );
  const [matchingKits, setMatchingKits] = useState<Product[]>([]);
  const [loadingKits, setLoadingKits] = useState(false);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState(false);
  const { toast } = useToast();

  // Build ingredient list from selected style
  const ingredientList = useMemo(() => {
    if (!selectedStyle) return [];

    const items: IngredientItem[] = [];

    // Add malts
    selectedStyle.ingredients.malt.forEach(malt => {
      const searchTerm = malt.toLowerCase().includes('pale') ? 'pale malt' :
                        malt.toLowerCase().includes('crystal') || malt.toLowerCase().includes('caramel') ? 'crystal malt' :
                        malt.toLowerCase().includes('munich') ? 'munich malt' :
                        malt.toLowerCase().includes('wheat') ? 'wheat malt' :
                        malt.toLowerCase().includes('pilsner') ? 'pilsner malt' :
                        malt.toLowerCase().includes('chocolate') ? 'chocolate malt' :
                        malt.toLowerCase().includes('roasted') ? 'roasted barley' :
                        malt.toLowerCase().includes('black') ? 'black malt' :
                        malt.toLowerCase().includes('carapils') ? 'carapils' :
                        malt.toLowerCase().includes('flaked') ? 'flaked barley' :
                        malt.toLowerCase().includes('honey') ? 'honey malt' : 'malt';

      items.push({
        name: malt,
        category: 'Grains',
        searchTerm
      });
    });

    // Add hops
    selectedStyle.ingredients.hops.forEach(hop => {
      const searchTerm = hop.toLowerCase().includes('cascade') ? 'cascade' :
                        hop.toLowerCase().includes('chinook') ? 'chinook' :
                        hop.toLowerCase().includes('citra') ? 'citra' :
                        hop.toLowerCase().includes('centennial') ? 'centennial' :
                        hop.toLowerCase().includes('columbus') ? 'columbus' :
                        hop.toLowerCase().includes('goldings') ? 'goldings' :
                        hop.toLowerCase().includes('fuggles') ? 'fuggles' :
                        hop.toLowerCase().includes('hallertau') ? 'hallertau' :
                        hop.toLowerCase().includes('saaz') ? 'saaz' :
                        hop.toLowerCase().includes('liberty') ? 'liberty' :
                        hop.toLowerCase().includes('willamette') ? 'willamette' :
                        hop.toLowerCase().includes('mt') || hop.toLowerCase().includes('hood') ? 'mt hood' : 'hops';

      items.push({
        name: hop,
        category: 'Hops',
        searchTerm
      });
    });

    // Add yeast
    items.push({
      name: selectedStyle.ingredients.yeast,
      category: 'Yeast',
      searchTerm: selectedStyle.ingredients.yeast.toLowerCase().includes('ale') ? 'ale yeast' :
                 selectedStyle.ingredients.yeast.toLowerCase().includes('lager') ? 'lager yeast' :
                 selectedStyle.ingredients.yeast.toLowerCase().includes('wheat') ? 'wheat yeast' :
                 selectedStyle.ingredients.yeast.toLowerCase().includes('irish') ? 'irish ale' : 'yeast'
    });

    // Add other ingredients
    if (selectedStyle.ingredients.other) {
      selectedStyle.ingredients.other.forEach(item => {
        const searchTerm = item.toLowerCase().includes('priming') ? 'priming sugar' :
                          item.toLowerCase().includes('irish moss') ? 'irish moss' :
                          item.toLowerCase().includes('nutrient') ? 'yeast nutrient' :
                          item.toLowerCase().includes('lactose') ? 'lactose' :
                          item.toLowerCase().includes('coriander') ? 'coriander' :
                          item.toLowerCase().includes('orange') ? 'orange peel' :
                          item.toLowerCase().includes('calcium') ? 'calcium' : item.toLowerCase();

        items.push({
          name: item,
          category: 'Chemicals',
          searchTerm
        });
      });
    }

    return items;
  }, [selectedStyle]);

  // Fetch products for ingredients
  useEffect(() => {
    async function fetchIngredientProducts() {
      if (ingredientList.length === 0) return;

      setLoadingProducts(true);

      try {
        const productMap: Record<string, Product> = {};

        // Fetch products from different categories
        const categories = ['Grains', 'Hops', 'Yeast', 'Chemicals'];

        for (const category of categories) {
          const response = await fetch(`/api/products?category=${category}&limit=200`);
          if (!response.ok) continue;

          const categoryProducts: Product[] = await response.json();

          // Match ingredients to products
          ingredientList.forEach(item => {
            if (item.category === category && !productMap[item.name]) {
              const match = categoryProducts.find(p =>
                p.name.toLowerCase().includes(item.searchTerm.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(item.searchTerm.toLowerCase()))
              );
              if (match) {
                productMap[item.name] = match;
              }
            }
          });
        }

        setProducts(productMap);
      } catch (error) {
        console.error('Error fetching ingredient products:', error);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchIngredientProducts();
  }, [ingredientList]);

  // Fetch matching kits
  useEffect(() => {
    async function fetchMatchingKits() {
      if (!selectedStyle) return;

      setLoadingKits(true);

      try {
        const response = await fetch('/api/products?category=Kits&subcategory=Beer Kits&limit=50');
        if (!response.ok) {
          throw new Error('Failed to fetch kits');
        }

        const allKits: Product[] = await response.json();

        // Filter kits that match the selected style
        const styleKeywords = selectedStyle.style.toLowerCase().split(' ');
        const filtered = allKits.filter(kit => {
          const kitName = kit.name.toLowerCase();
          return styleKeywords.some(keyword => kitName.includes(keyword));
        }).slice(0, 3);

        setMatchingKits(filtered);
      } catch (error) {
        console.error('Error fetching kits:', error);
      } finally {
        setLoadingKits(false);
      }
    }

    fetchMatchingKits();
  }, [selectedStyle]);

  const handleStyleChange = (styleName: string) => {
    const style = BEER_STYLES.find(s => s.style === styleName);
    if (style) {
      setSelectedStyle(style);
      setSelectedIngredients(new Set()); // Clear selections when changing style
    }
  };

  const toggleIngredient = (ingredientName: string) => {
    setSelectedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientName)) {
        newSet.delete(ingredientName);
      } else {
        newSet.add(ingredientName);
      }
      return newSet;
    });
  };

  const handleAddToCart = async () => {
    if (selectedIngredients.size === 0) {
      toast({
        title: 'No ingredients selected',
        description: 'Please select at least one ingredient to add to cart.',
        variant: 'destructive',
      });
      return;
    }

    setAddingToCart(true);
    let addedCount = 0;

    try {
      for (const ingredientName of Array.from(selectedIngredients)) {
        const product = products[ingredientName];
        if (product) {
          await addToCart(product.id, 1);
          addedCount++;
        }
      }

      toast({
        title: 'Success!',
        description: `Added ${addedCount} ingredient${addedCount !== 1 ? 's' : ''} to cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add some ingredients to cart.',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddKitToCart = async (productId: string, productName: string) => {
    try {
      await addToCart(productId, 1);
      toast({
        title: 'Added to cart!',
        description: `${productName} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add to cart.',
        variant: 'destructive',
      });
    }
  };

  const selectedTotal = useMemo(() => {
    return Array.from(selectedIngredients).reduce((total, ingredientName) => {
      const product = products[ingredientName];
      return total + (product ? Number(product.price) : 0);
    }, 0);
  }, [selectedIngredients, products]);

  if (!selectedStyle) return null;

  return (
    <Card className="bg-card/50 border-amber/20">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-cream">
            Select Beer Style
          </label>
          <Select value={selectedStyle.style} onValueChange={handleStyleChange}>
            <SelectTrigger className="bg-background/50 border-amber/30 text-cream">
              <SelectValue placeholder="Choose a beer style..." />
            </SelectTrigger>
            <SelectContent>
              {BEER_STYLES.map((style) => (
                <SelectItem key={style.style} value={style.style}>
                  {style.style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-cream/60">
            {selectedStyle.description}
          </p>
        </div>

        {loadingProducts ? (
          <p className="text-sm text-cream/60">Loading ingredients...</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-cream/70">
              Select the ingredients you need for {selectedStyle.style}:
            </p>

            <div className="space-y-2">
              {ingredientList.map((item) => {
                const product = products[item.name];
                const isSelected = selectedIngredients.has(item.name);

                return (
                  <div
                    key={item.name}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                  >
                    <Checkbox
                      id={item.name}
                      checked={isSelected}
                      onCheckedChange={() => toggleIngredient(item.name)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={item.name}
                        className="text-sm font-medium text-cream cursor-pointer"
                      >
                        {item.name}
                      </label>
                      {product ? (
                        <div className="text-xs text-cream/60 mt-1">
                          {product.name} - ${Number(product.price).toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-xs text-cream/40 mt-1">
                          Not available in stock
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedIngredients.size > 0 && (
              <div className="pt-4 border-t border-amber/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cream/70">
                    {selectedIngredients.size} ingredient{selectedIngredients.size !== 1 ? 's' : ''} selected
                  </span>
                  <span className="text-lg font-semibold text-gold">
                    ${selectedTotal.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-amber hover:bg-gold"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {addingToCart ? 'Adding to Cart...' : 'Add Selected to Cart'}
                </Button>
              </div>
            )}

            <Link href="/shop?category=grains">
              <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
                Browse All Ingredients
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Matching Beer Kits */}
        <div className="pt-4 border-t border-amber/20 space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gold" />
            <h4 className="text-sm font-semibold text-gold">
              Or Choose a {selectedStyle.style} Kit:
            </h4>
          </div>

          {loadingKits ? (
            <p className="text-sm text-cream/60">Loading kits...</p>
          ) : matchingKits.length > 0 ? (
            <div className="space-y-3">
              {matchingKits.map((kit) => (
                <div
                  key={kit.id}
                  className="flex gap-3 p-3 border border-amber/20 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                >
                  <div className="w-20 h-20 relative bg-background/50 rounded overflow-hidden flex-shrink-0">
                    <ProductImage
                      imageUrl={kit.image_url}
                      alt={kit.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-cream mb-1 line-clamp-1">
                      {kit.name}
                    </h5>
                    {kit.short_description && (
                      <p className="text-xs text-cream/60 mb-2 line-clamp-2">
                        {kit.short_description}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold text-gold">
                        ${Number(kit.price).toFixed(2)}
                      </span>
                      <Button
                        onClick={() => handleAddKitToCart(kit.id, kit.name)}
                        size="sm"
                        className="bg-amber hover:bg-gold"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/shop?category=kits&subcategory=Beer Kits">
                <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10 text-xs">
                  View All Beer Kits
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-cream/60">
                No pre-made {selectedStyle.style} kits found.
              </p>
              <Link href="/shop?category=kits&subcategory=Beer Kits">
                <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10 text-xs">
                  Browse All Beer Kits
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
