import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/cart - Get cart items for session
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id');

    if (!sessionId) {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.cartItem.findMany({
      where: {
        sessionId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform Prisma products to match frontend Product interface
    const transformedItems = items.map(item => ({
      id: item.id,
      sessionId: item.sessionId,
      productId: item.productId,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: item.product ? {
        id: item.product.id,
        category_id: null,
        name: item.product.name,
        slug: item.product.slug,
        description: item.product.description || '',
        short_description: item.product.description?.substring(0, 150) || '',
        price: Number(item.product.price),
        image_url: item.product.imageUrl || '',
        images: item.product.imageUrl ? [item.product.imageUrl] : [],
        rating: 4.5,
        review_count: 0,
        in_stock: item.product.stockQuantity > 0,
        stock_quantity: item.product.stockQuantity,
        featured: false,
        created_at: item.product.createdAt.toISOString(),
        updated_at: item.product.updatedAt.toISOString(),
      } : undefined
    }));

    return NextResponse.json({ items: transformedItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id');
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Use transaction to safely handle concurrent requests
    await prisma.$transaction(async (tx) => {
      // Check if item already exists in cart within transaction
      const existingItem = await tx.cartItem.findFirst({
        where: {
          sessionId,
          productId,
        },
      });

      if (existingItem) {
        // Update quantity if item already exists
        await tx.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        // Create new cart item
        await tx.cartItem.create({
          data: {
            sessionId,
            productId,
            quantity,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
