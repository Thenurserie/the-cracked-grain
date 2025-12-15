import { CartItem } from './types';

function getSessionId(): string {
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
    const response = await fetch('/api/cart', {
      headers: {
        'x-session-id': sessionId,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch cart items');
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

export async function addToCart(productId: string, quantity: number = 1): Promise<boolean> {
  const sessionId = getSessionId();
  if (!sessionId) return false;

  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      console.error('Failed to add to cart');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      console.error('Failed to update cart item');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating cart item:', error);
    return false;
  }
}

export async function removeFromCart(itemId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Failed to remove from cart');
      return false;
    }

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
    const response = await fetch('/api/cart/count', {
      headers: {
        'x-session-id': sessionId,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch cart count');
      return 0;
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
}
