import { supabase } from './supabase';
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

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products (*)
    `)
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }

  return data as CartItem[];
}

export async function addToCart(productId: string, quantity: number = 1): Promise<boolean> {
  const sessionId = getSessionId();

  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existingItem) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity, updated_at: new Date().toISOString() })
      .eq('id', existingItem.id);

    return !error;
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({ session_id: sessionId, product_id: productId, quantity });

    return !error;
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
  if (quantity <= 0) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    return !error;
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', itemId);

  return !error;
}

export async function removeFromCart(itemId: string): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  return !error;
}

export async function getCartCount(): Promise<number> {
  const sessionId = getSessionId();

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('session_id', sessionId);

  if (error) return 0;

  return data.reduce((sum: number, item: any) => sum + item.quantity, 0);
}
