export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  image_url: string;
  images: string[];
  rating: number;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  user_id: string | null;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}
