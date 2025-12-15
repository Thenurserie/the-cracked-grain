import { prisma } from './db';
import { CartItem } from './types';

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

export async function getCartItems(): Promise<CartItem[]> {
  const sessionId = getSessionId();
  if (!sessionId) return [];

  try {
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

    // Map Prisma results to CartItem type
    return items.map(item => ({
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
        image_url: item.product.imageUrl || '/images/placeholder-product.jpg',
        images: [item.product.imageUrl || '/images/placeholder-product.jpg'],
        rating: 4.5,
        review_count: 0,
        in_stock: item.product.stockQuantity > 0,
        stock_quantity: item.product.stockQuantity,
        featured: false,
        created_at: item.product.createdAt.toISOString(),
        updated_at: item.product.updatedAt.toISOString(),
      } : undefined,
    }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

export async function addToCart(productId: string, quantity: number = 1): Promise<boolean> {
  const sessionId = getSessionId();
  if (!sessionId) return false;

  try {
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        sessionId,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity if item already exists
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          sessionId,
          productId,
          quantity,
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
  try {
    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: {
          id: itemId,
        },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          id: itemId,
        },
        data: {
          quantity,
        },
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return false;
  }
}

export async function removeFromCart(itemId: string): Promise<boolean> {
  try {
    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
}

export async function getCartCount(): Promise<number> {
  const sessionId = getSessionId();
  if (!sessionId) return 0;

  try {
    const items = await prisma.cartItem.findMany({
      where: {
        sessionId,
      },
      select: {
        quantity: true,
      },
    });

    return items.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
}
