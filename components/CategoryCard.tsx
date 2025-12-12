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
      <div className="group relative h-64 rounded-lg overflow-hidden border border-amber/20 hover:border-gold transition-all duration-300 hover:shadow-lg hover:shadow-amber/10">
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-gold transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-cream/90 mb-3 line-clamp-2">
            {category.description}
          </p>
          <div className="flex items-center text-gold group-hover:translate-x-2 transition-transform">
            <span className="text-sm font-medium">Shop Now</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
