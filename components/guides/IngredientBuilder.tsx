'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export function IngredientBuilder({ title, defaultStyle }: IngredientBuilderProps) {
  const [selectedStyle, setSelectedStyle] = useState<BeerStyleIngredients | null>(
    defaultStyle ? BEER_STYLES.find(s => s.style === defaultStyle) || BEER_STYLES[0] : BEER_STYLES[0]
  );
  const [matchingKits, setMatchingKits] = useState<Product[]>([]);
  const [loadingKits, setLoadingKits] = useState(false);
  const { toast } = useToast();

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
          <Select value={selectedStyle?.style} onValueChange={handleStyleChange}>
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
          {selectedStyle && (
            <p className="text-xs text-cream/60">
              {selectedStyle.description}
            </p>
          )}
        </div>

        {selectedStyle && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gold">Ingredients Needed:</h4>

              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-medium text-cream/70 mb-1.5">Malt/Grains:</h5>
                  <ul className="space-y-1">
                    {selectedStyle.ingredients.malt.map((item, idx) => (
                      <li key={idx} className="text-sm text-cream/80 flex items-start gap-2">
                        <span className="text-amber">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-medium text-cream/70 mb-1.5">Hops:</h5>
                  <ul className="space-y-1">
                    {selectedStyle.ingredients.hops.map((item, idx) => (
                      <li key={idx} className="text-sm text-cream/80 flex items-start gap-2">
                        <span className="text-amber">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-medium text-cream/70 mb-1.5">Yeast:</h5>
                  <p className="text-sm text-cream/80 flex items-start gap-2">
                    <span className="text-amber">•</span>
                    {selectedStyle.ingredients.yeast}
                  </p>
                </div>

                {selectedStyle.ingredients.other && selectedStyle.ingredients.other.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-cream/70 mb-1.5">Other:</h5>
                    <ul className="space-y-1">
                      {selectedStyle.ingredients.other.map((item, idx) => (
                        <li key={idx} className="text-sm text-cream/80 flex items-start gap-2">
                          <span className="text-amber">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Link href="/shop?category=grains">
                <Button variant="outline" className="w-full mt-4 border-amber/30 text-cream hover:bg-amber/10">
                  Browse All Ingredients
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

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
                          src={kit.image_url}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
