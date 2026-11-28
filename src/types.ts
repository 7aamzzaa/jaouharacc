export type InventoryPolicy = 'tracked' | 'availability_to_confirm';

export interface ProductVariant {
  id: string;
  sku?: string;
  finish: string;
  color: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  material: string;
  color: string;
  rating?: number | null;
  reviews?: number | null;
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  imageAltText?: string;
  tags?: string[];
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  variants?: ProductVariant[];
  inventory_policy?: InventoryPolicy;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected_size: string;
  image: string;
  variant_id?: string;
  variant_sku?: string;
  variant_finish?: string;
  variant_color?: string;
  variant_label?: string;
  availability_to_confirm?: boolean;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_country: string;
  customer_city: string;
  customer_street: string;
  customer_apartment?: string;
  payment_method: string;
  order_notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  discount_code?: string;
  total: number;
  idempotency_key?: string;
  status: 'pending' | 'awaiting_availability' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read';
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  status: 'active';
}

export interface CartItem {
  id: string; // product_id + variant id for variants, otherwise product_id + selected_size
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected_size: string;
  image: string;
  max_stock: number;
  variant_id?: string;
  variant_sku?: string;
  variant_finish?: string;
  variant_color?: string;
  variant_label?: string;
  availability_to_confirm?: boolean;
}
export interface Review {
  id: string;
  product_id: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Public DTO: never expose customer email or moderation status to shoppers.
export interface PublicReview {
  id: string;
  product_id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}