import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const sortBy = searchParams.get('sortBy') || 'name';
    const limit = parseInt(searchParams.get('limit') || '50');
    const query = searchParams.get('q'); // Text search query

    const products = await getProducts({
      category: category && category !== 'all' ? category : undefined,
      subcategory: subcategory || undefined,
      isActive: true,
      limit: limit,
      search: query || undefined, // Add search parameter
    });

    // Sort products
    let sortedProducts = [...products];
    switch (sortBy) {
      case 'price-asc':
        sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
      default:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    // Convert Prisma products to legacy format
    const legacyProducts = sortedProducts.map((p) => ({
      id: p.id,
      category_id: null,
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      short_description: p.description?.substring(0, 150) || '',
      price: Number(p.price),
      image_url: p.imageUrl || '/images/placeholder-product.jpg',
      images: [p.imageUrl || '/images/placeholder-product.jpg'],
      rating: 4.5,
      review_count: 0,
      in_stock: p.stockQuantity > 0,
      stock_quantity: p.stockQuantity,
      featured: false,
      created_at: p.createdAt.toISOString(),
      updated_at: p.updatedAt.toISOString(),
    }));

    return NextResponse.json(legacyProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
