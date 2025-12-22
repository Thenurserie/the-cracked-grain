'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/cartClient';
import { useToast } from '@/hooks/use-toast';

interface EquipmentItem {
  name: string;
  searchTerm: string;
  required: boolean;
}

interface EquipmentBuilderProps {
  title: string;
  equipmentList: EquipmentItem[];
  category?: string;
}

export function EquipmentBuilder({ title, equipmentList, category = 'Equipment' }: EquipmentBuilderProps) {
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState(false);
  const { toast } = useToast();

  // Memoize equipment list to prevent unnecessary re-fetches
  const memoizedEquipmentList = useMemo(() => equipmentList, [JSON.stringify(equipmentList)]);

  useEffect(() => {
    async function fetchAllEquipment() {
      setLoading(true);

      try {
        // Fetch all equipment from category
        const response = await fetch(`/api/products?category=${category}&limit=200`);
        if (!response.ok) {
          throw new Error('Failed to fetch equipment');
        }

        const allEquipment: Product[] = await response.json();
        const productMap: Record<string, Product> = {};

        // Match each equipment item to a product
        memoizedEquipmentList.forEach(item => {
          const match = allEquipment.find(p =>
            p.name.toLowerCase().includes(item.searchTerm.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(item.searchTerm.toLowerCase()))
          );
          if (match) {
            productMap[item.name] = match;
            // Pre-select required items
            if (item.required) {
              setSelectedItems(prev => new Set(prev).add(item.name));
            }
          }
        });

        setProducts(productMap);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        toast({
          title: 'Error',
          description: 'Failed to load equipment. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAllEquipment();
  }, [memoizedEquipmentList, category, toast]);

  const toggleItem = (itemName: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const handleAddToCart = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select at least one item to add to cart.',
        variant: 'destructive',
      });
      return;
    }

    setAddingToCart(true);
    let addedCount = 0;

    try {
      for (const itemName of Array.from(selectedItems)) {
        const product = products[itemName];
        if (product) {
          await addToCart(product.id, 1);
          addedCount++;
        }
      }

      toast({
        title: 'Success!',
        description: `Added ${addedCount} item${addedCount !== 1 ? 's' : ''} to cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add some items to cart.',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const selectedTotal = useMemo(() => {
    return Array.from(selectedItems).reduce((total, itemName) => {
      const product = products[itemName];
      return total + (product ? Number(product.price) : 0);
    }, 0);
  }, [selectedItems, products]);

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
          <p className="text-cream/60">Loading equipment...</p>
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
          Select the equipment you need. Required items are pre-selected.
        </p>

        <div className="space-y-2">
          {memoizedEquipmentList.map((item) => {
            const product = products[item.name];
            const isSelected = selectedItems.has(item.name);

            return (
              <div
                key={item.name}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
              >
                <Checkbox
                  id={item.name}
                  checked={isSelected}
                  onCheckedChange={() => toggleItem(item.name)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={item.name}
                    className="text-sm font-medium text-cream cursor-pointer flex items-center gap-2"
                  >
                    {item.name}
                    {item.required && (
                      <span className="text-xs text-amber bg-amber/20 px-2 py-0.5 rounded">Required</span>
                    )}
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

        {selectedItems.size > 0 && (
          <div className="pt-4 border-t border-amber/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-cream/70">
                {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
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
      </CardContent>
    </Card>
  );
}
