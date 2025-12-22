'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, ExternalLink } from 'lucide-react';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';
import { ProductImage } from '@/components/ProductImage';

interface StarterKitsDisplayProps {
  title: string;
  subcategory?: string;
  maxDisplay?: number;
}

export function StarterKitsDisplay({ title, subcategory = 'Equipment Kits', maxDisplay = 6 }: StarterKitsDisplayProps) {
  const [kits, setKits] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchKits() {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          category: 'Kits',
          limit: '50',
        });

        if (subcategory) {
          params.append('subcategory', subcategory);
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch kits');
        }

        const allKits: Product[] = await response.json();
        setKits(allKits.slice(0, maxDisplay));
      } catch (error) {
        console.error('Error fetching kits:', error);
        toast({
          title: 'Error',
          description: 'Failed to load starter kits. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchKits();
  }, [subcategory, maxDisplay, toast]);

  const handleAddToCart = async (productId: string, productName: string) => {
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

  if (loading) {
    return (
      <Card className="bg-card/50 border-amber/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <Package className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cream/60">Loading starter kits...</p>
        </CardContent>
      </Card>
    );
  }

  if (kits.length === 0) {
    return (
      <Card className="bg-card/50 border-amber/20">
        <CardHeader>
          <CardTitle className="text-gold flex items-center gap-2">
            <Package className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cream/60">No starter kits available at this time.</p>
          <Link href="/shop?category=kits">
            <Button variant="outline" className="mt-4 border-amber/30 text-cream hover:bg-amber/10">
              Browse All Kits
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-amber/20">
      <CardHeader>
        <CardTitle className="text-gold flex items-center gap-2">
          <Package className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-cream/70">
          Complete kits with everything you need to get started.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className="border border-amber/20 rounded-lg p-4 bg-background/30 hover:bg-background/50 transition-colors"
            >
              <div className="aspect-square relative mb-3 bg-background/50 rounded overflow-hidden">
                <ProductImage
                  src={kit.image_url}
                  alt={kit.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-semibold text-cream text-sm mb-2 line-clamp-2">
                {kit.name}
              </h4>
              {kit.short_description && (
                <p className="text-xs text-cream/60 mb-3 line-clamp-2">
                  {kit.short_description}
                </p>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-bold text-gold">
                  ${Number(kit.price).toFixed(2)}
                </span>
                <Button
                  onClick={() => handleAddToCart(kit.id, kit.name)}
                  size="sm"
                  className="bg-amber hover:bg-gold"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Link href={`/shop?category=kits${subcategory ? `&subcategory=${subcategory}` : ''}`}>
          <Button variant="outline" className="w-full border-amber/30 text-cream hover:bg-amber/10">
            View All Starter Kits
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
