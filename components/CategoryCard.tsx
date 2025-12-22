import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${category.slug}`}>
      <div className="group relative h-40 md:h-44 rounded-lg overflow-hidden border border-amber/20 hover:border-gold transition-all duration-300 hover:shadow-lg hover:shadow-amber/10">
        {category.image_url && (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
          <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-gold transition-colors">
            {category.name}
          </h3>
          <div className="flex items-center text-gold group-hover:translate-x-2 transition-transform">
            <span className="text-xs md:text-sm font-medium">Shop Now</span>
            <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
