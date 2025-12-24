import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const tags = searchParams.get('tags')?.split(',') || [];
  const searchTerms = searchParams.get('search')?.split(',') || [];
  const batchSize = searchParams.get('batchSize') || '5-gallon';

  try {
    const where: any = {
      isActive: true,
      stockQuantity: { gt: 0 }, // Only in-stock items
    };

    // Add category filter if provided
    if (category) {
      where.category = category;
    }

    // Build search conditions for tags and search terms
    const searchConditions: any[] = [];

    // Add tag searches (search in name and description)
    if (tags.length > 0) {
      tags.forEach(tag => {
        searchConditions.push({
          OR: [
            { name: { contains: tag, mode: 'insensitive' } },
            { description: { contains: tag, mode: 'insensitive' } },
          ],
        });
      });
    }

    // Add search term searches
    if (searchTerms.length > 0) {
      searchTerms.forEach(term => {
        searchConditions.push({
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
          ],
        });
      });
    }

    // Combine search conditions with OR
    if (searchConditions.length > 0) {
      where.OR = searchConditions.flatMap(condition => condition.OR);
    }

    // Fetch from database
    let products = await prisma.product.findMany({
      where,
      orderBy: { price: 'asc' },
      take: 20,
    });

    // Filter by batch size if applicable (check product name/description)
    if (batchSize === '1-gallon') {
      products = products.filter(p =>
        p.name?.toLowerCase().includes('1 gal') ||
        p.name?.toLowerCase().includes('1-gal') ||
        p.name?.toLowerCase().includes('small') ||
        !p.name?.toLowerCase().includes('10 gal')
      );
    } else if (batchSize === '10-gallon') {
      products = products.filter(p =>
        p.name?.toLowerCase().includes('10 gal') ||
        p.name?.toLowerCase().includes('10-gal') ||
        p.name?.toLowerCase().includes('large') ||
        p.description?.toLowerCase().includes('10 gallon')
      );
    }

    // Map to consistent format
    const mappedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      comparePrice: null,
      image: product.imageUrl || null,
      slug: product.slug,
      inStock: product.stockQuantity > 0,
      stockQuantity: product.stockQuantity,
      sku: product.sku || product.id,
    }));

    return NextResponse.json({ products: mappedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { products: [], error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
