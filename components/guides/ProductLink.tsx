'use client';

import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductLinkProps {
  children: React.ReactNode;
  searchTerm?: string;
  category?: string;
  subcategory?: string;
  className?: string;
}

export function ProductLink({ children, searchTerm, category, subcategory, className = '' }: ProductLinkProps) {
  // Build the shop URL based on provided params
  let shopUrl = '/shop';
  const params = new URLSearchParams();

  if (searchTerm) {
    params.append('search', searchTerm);
  }
  if (category) {
    params.append('category', category);
  }
  if (subcategory) {
    params.append('subcategory', subcategory);
  }

  if (params.toString()) {
    shopUrl += `?${params.toString()}`;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={shopUrl}
            className={`
              inline-block relative
              text-inherit
              transition-all duration-200
              hover:text-amber
              after:content-['']
              after:absolute
              after:left-0
              after:bottom-0
              after:w-full
              after:h-[1px]
              after:bg-amber
              after:opacity-0
              after:transition-opacity
              after:duration-200
              hover:after:opacity-100
              ${className}
            `}
          >
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-background border-amber/40">
          <p className="text-sm">Shop for this item</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
