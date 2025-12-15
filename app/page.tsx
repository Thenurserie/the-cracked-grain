import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { prisma } from '@/lib/db';
import { Product, Category } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

// Force this route to be dynamic (not statically generated)
// This prevents database access during build time
export const dynamic = 'force-dynamic';

async function getCategories(): Promise<Category[]> {
  try {
    // Extract unique categories from products (no Category table exists)
    const uniqueCategories = await prisma.product.findMany({
      select: { category: true },
      where: { isActive: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    // Map to Category type with generated slugs
    // Note: slug must match exact category value in database for filtering to work
    const categoryImages: Record<string, string> = {
      'Grains': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
      'Hops': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80',
      'Yeast': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
      'Equipment': 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&q=80',
      'Chemicals': 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&q=80',
    };

    return uniqueCategories
      .filter(item => item.category !== null)
      .map((item, index) => ({
        id: (index + 1).toString(),
        name: item.category as string,
        slug: item.category as string, // Keep original case to match database
        description: `Browse our ${item.category} products`,
        image_url: categoryImages[item.category as string] || 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=800&q=80',
        created_at: new Date().toISOString(),
      }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 4,
    });

    // Map Prisma Product to TypeScript Product interface
    return products.map((p) => ({
      id: p.id,
      category_id: null,
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      short_description: p.description?.substring(0, 100) || '',
      price: Number(p.price),
      image_url: p.imageUrl || '',
      images: p.imageUrl ? [p.imageUrl] : [],
      rating: 0,
      review_count: 0,
      in_stock: p.stockQuantity > 0,
      stock_quantity: p.stockQuantity,
      featured: false,
      created_at: p.createdAt.toISOString(),
      updated_at: p.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div>
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#1a1a1a]" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-cream mb-6">
            Brew Better Beer
          </h1>
          <p className="text-xl md:text-2xl text-cream/90 mb-8 max-w-2xl mx-auto">
            Premium homebrew supplies for craft beer enthusiasts. Quality ingredients and equipment for every brew.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-amber hover:bg-gold text-white font-semibold text-lg px-8 py-6">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            Shop by Category
          </h2>
          <p className="text-cream/70 max-w-2xl mx-auto">
            Explore our comprehensive selection of brewing supplies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-[#2a2a2a] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
              Featured Products
            </h2>
            <p className="text-cream/70 max-w-2xl mx-auto">
              Handpicked favorites from our brewing experts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop">
              <Button size="lg" className="bg-amber hover:bg-gold text-white">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            Join Our Community
          </h2>
          <p className="text-cream/70 mb-8">
            Subscribe to receive brewing tips, new product announcements, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-[#2a2a2a] border border-amber/30 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-gold"
            />
            <Button type="submit" className="bg-amber hover:bg-gold text-white px-6">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
