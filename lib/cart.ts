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

    return items as CartItem[];
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
