import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Truck, Package, Shield } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { getProduct as getPrismaProduct, getProductsByCategory } from '@/lib/products';
import { Product } from '@/lib/types';
import type { Metadata } from 'next';

// Force this route to be dynamic (not statically generated)
// This prevents database access during build time
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Convert Prisma Product to legacy Product type
function convertPrismaProduct(prismaProduct: any): Product {
  return {
    id: prismaProduct.id,
    category_id: null, // Will use category string instead
    name: prismaProduct.name,
    slug: prismaProduct.slug,
    description: prismaProduct.description || '',
    short_description: prismaProduct.description?.substring(0, 150) || '',
    price: Number(prismaProduct.price),
    image_url: prismaProduct.imageUrl || '/images/placeholder-product.jpg',
    images: [prismaProduct.imageUrl || '/images/placeholder-product.jpg'],
    rating: 4.5, // Default rating for now
    review_count: 0, // Default review count for now
    in_stock: prismaProduct.stockQuantity > 0,
    stock_quantity: prismaProduct.stockQuantity,
    featured: false,
    created_at: prismaProduct.createdAt.toISOString(),
    updated_at: prismaProduct.updatedAt.toISOString(),
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  const prismaProduct = await getPrismaProduct(slug);

  if (!prismaProduct) {
    return null;
  }

  return convertPrismaProduct(prismaProduct);
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  // Get the category from the original Prisma product
  const prismaProduct = await getPrismaProduct(product.slug);
  if (!prismaProduct || !prismaProduct.category) return [];

  const relatedPrismaProducts = await getProductsByCategory(prismaProduct.category);

  // Filter out the current product and limit to 4
  return relatedPrismaProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4)
    .map(convertPrismaProduct);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | The Cracked Grain',
    };
  }

  return {
    title: `${product.name} | The Cracked Grain`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/shop/${product.slug}`,
      type: 'website',
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image_url],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `https://thecrackedgrain.com/shop/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://thecrackedgrain.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://thecrackedgrain.com/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://thecrackedgrain.com/shop/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container mx-auto px-4 py-12">
        <nav className="text-sm text-cream/60 mb-8">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          {' / '}
          <Link href="/shop" className="hover:text-gold">
            Shop
          </Link>
          {' / '}
          <span className="text-cream">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#2a2a2a] border border-amber/20">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-cream mb-4">{product.name}</h1>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-gold text-gold'
                          : 'text-cream/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-cream/70">
                  {product.rating.toFixed(1)} ({product.review_count} reviews)
                </span>
              </div>

              <div className="text-4xl font-bold text-gold mb-6">
                ${product.price.toFixed(2)}
              </div>

              <p className="text-cream/80 leading-relaxed">{product.description}</p>
            </div>

            <ProductDetailClient product={product} />

            <div className="border-t border-amber/20 pt-6 space-y-4">
              <div className="flex items-center text-cream/80">
                <Truck className="mr-3 h-5 w-5 text-gold" />
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center text-cream/80">
                <Package className="mr-3 h-5 w-5 text-gold" />
                <span className="text-sm">Ships within 2-3 business days</span>
              </div>
              <div className="flex items-center text-cream/80">
                <Shield className="mr-3 h-5 w-5 text-gold" />
                <span className="text-sm">30-day return guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="border-t border-amber/20 pt-12">
            <h2 className="text-3xl font-bold text-cream mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
