'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronRight } from 'lucide-react';

export interface QuickShopItem {
  name: string;
  searchTerm?: string;
  category?: string;
  subcategory?: string;
}

interface QuickShopBoxProps {
  title: string;
  items: QuickShopItem[];
  browseAllCategory?: string;
  className?: string;
}

export function QuickShopBox({ title, items, browseAllCategory, className = '' }: QuickShopBoxProps) {
  const buildShopUrl = (item: QuickShopItem) => {
    let url = '/shop';
    const params = new URLSearchParams();

    if (item.searchTerm) {
      params.append('search', item.searchTerm);
    }
    if (item.category) {
      params.append('category', item.category);
    }
    if (item.subcategory) {
      params.append('subcategory', item.subcategory);
    }

    return params.toString() ? `${url}?${params.toString()}` : url;
  };

  const browsAllUrl = browseAllCategory
    ? `/shop?category=${encodeURIComponent(browseAllCategory)}`
    : '/shop';

  return (
    <Card className={`bg-[#2a2a2a] border-amber/30 my-6 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-amber flex items-center gap-2 text-xl">
          <ShoppingCart className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1.5">
          {items.map((item, index) => (
            <Link
              key={index}
              href={buildShopUrl(item)}
              className="
                block px-3 py-2 rounded
                text-cream/90 text-sm
                transition-all duration-200
                hover:bg-amber/10
                hover:text-amber
                hover:translate-x-1
                group
              "
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="pt-3 mt-3 border-t border-amber/20">
          <Link href={browsAllUrl}>
            <Button
              variant="outline"
              className="w-full border-amber/40 text-amber hover:bg-amber/10 hover:text-amber"
            >
              Browse All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
