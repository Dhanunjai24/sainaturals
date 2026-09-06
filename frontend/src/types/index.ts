export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  local_name?: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order?: number;
}

export interface Product {
  id: number;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  name: string;
  local_name?: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  unit: string;
  image_url: string;
  is_featured?: boolean;
  is_active?: boolean;
  rating: number;
  review_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  name: string;
  local_name?: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  unit: string;
  image_url: string;
  quantity: number;
}

export interface WishlistItem {
  id: number;
  user_id?: number;
  product_id: number;
  name?: string;
  local_name?: string;
  price?: number;
  discount_price?: number;
  stock_quantity?: number;
  unit?: string;
  image_url?: string;
  rating?: number;
  created_at?: string;
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  street_address: string;
  landmark?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  address_type: string;
  is_default: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  valid_until: string;
  is_active: boolean;
  max_uses?: number;
  times_used?: number;
  used_count?: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_name?: string;
  shipping_phone?: string;
  landmark?: string;
  subtotal?: number;
  discount_amount?: number;
  delivery_fee?: number;
  total_amount: number;
  payment_method?: 'cod' | 'upi' | 'card' | string;
  payment_status?: 'pending' | 'completed' | 'paid' | 'failed' | 'refunded' | string;
  order_status: 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled' | string;
  delivery_slot?: string;
  notes?: string;
  created_at: string;
  street_address?: string;
  area?: string;
  city?: string;
  pincode?: string;
  delivery_address?: string;
  items?: OrderItem[];
  delivery?: {
    driver_name: string;
    driver_phone: string;
    status: string;
    estimated_delivery?: string;
  };
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name?: string;
  rating: number;
  title: string;
  comment: string;
  status: string;
  created_at?: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  display_order: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  recentOrders: Order[];
  topProducts: Array<{
    id: number;
    name: string;
    image_url: string;
    price: number;
    discount_price?: number;
    stock_quantity: number;
    total_sold: number;
  }>;
}
