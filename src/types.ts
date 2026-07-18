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
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected_size: string;
  image: string;
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
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
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

export interface CartItem {
  id: string; // combination of product_id + selected_size
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected_size: string;
  image: string;
  max_stock: number;
}
