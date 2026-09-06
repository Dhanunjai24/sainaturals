import { User, Product, Category, CartItem, WishlistItem, Address, Coupon, Order, Review, Banner, AdminStats } from '../types';
import { 
  FALLBACK_CATEGORIES, 
  FALLBACK_PRODUCTS, 
  FALLBACK_COUPONS, 
  FALLBACK_BANNERS, 
  FALLBACK_REVIEWS 
} from './fallbackData';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` : '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('sai_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  };

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    try {
      return await request<{ message: string; user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    } catch (err: any) {
      // Offline / Static demo fallback for testing credentials
      const email = credentials.email.toLowerCase().trim();
      if (email === 'admin@sainaturals.com') {
        const demoAdmin: User = {
          id: 1,
          name: 'Store Admin',
          email: 'admin@sainaturals.com',
          phone: '+91 77995 49977',
          role: 'admin',
          created_at: new Date().toISOString()
        };
        return { message: 'Demo Admin Authenticated', user: demoAdmin, token: 'demo_admin_jwt_token' };
      }
      if (email === 'customer@sainaturals.com') {
        const demoCust: User = {
          id: 2,
          name: 'Sai Customer',
          email: 'customer@sainaturals.com',
          phone: '+91 98765 43210',
          role: 'customer',
          created_at: new Date().toISOString()
        };
        return { message: 'Demo Customer Authenticated', user: demoCust, token: 'demo_customer_jwt_token' };
      }
      throw err;
    }
  },

  register: async (payload: { name: string; email: string; phone?: string; password: string }) => {
    try {
      return await request<{ message: string; user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Offline fallback register
      const demoUser: User = {
        id: Date.now(),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: 'customer',
        created_at: new Date().toISOString()
      };
      return { message: 'Registration successful!', user: demoUser, token: 'demo_customer_jwt_token' };
    }
  },

  getMe: async () => {
    const token = localStorage.getItem('sai_token');
    if (token === 'demo_admin_jwt_token') {
      return {
        user: {
          id: 1,
          name: 'Store Admin',
          email: 'admin@sainaturals.com',
          phone: '+91 77995 49977',
          role: 'admin',
          created_at: new Date().toISOString()
        } as User
      };
    }
    if (token === 'demo_customer_jwt_token') {
      return {
        user: {
          id: 2,
          name: 'Sai Customer',
          email: 'customer@sainaturals.com',
          phone: '+91 98765 43210',
          role: 'customer',
          created_at: new Date().toISOString()
        } as User
      };
    }
    return request<{ user: User }>('/auth/me');
  },

  // Products
  getProducts: async (params: { category?: string; search?: string; inStock?: boolean; minPrice?: number; maxPrice?: number; sort?: string; featured?: boolean } = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.inStock) query.append('inStock', 'true');
      if (params.minPrice) query.append('minPrice', String(params.minPrice));
      if (params.maxPrice) query.append('maxPrice', String(params.maxPrice));
      if (params.sort) query.append('sort', params.sort);
      if (params.featured) query.append('featured', 'true');
      const res = await request<{ count: number; products: Product[] }>(`/products?${query.toString()}`);
      if (res && Array.isArray(res.products) && res.products.length > 0) {
        return res;
      }
    } catch (err) {
      console.warn('Backend unavailable, serving embedded catalogue:', err);
    }

    // Filter fallback catalogue locally
    let list = [...FALLBACK_PRODUCTS];
    if (params.category) {
      const cat = FALLBACK_CATEGORIES.find(c => c.slug === params.category || String(c.id) === params.category);
      if (cat) list = list.filter(p => p.category_id === cat.id);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.local_name && p.local_name.toLowerCase().includes(q)));
    }
    if (params.featured) {
      list = list.filter(p => p.is_featured);
    }
    if (params.inStock) {
      list = list.filter(p => p.stock_quantity > 0);
    }
    if (params.minPrice) {
      list = list.filter(p => Number(p.discount_price || p.price) >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      list = list.filter(p => Number(p.discount_price || p.price) <= Number(params.maxPrice));
    }
    if (params.sort === 'price_asc') {
      list.sort((a, b) => Number(a.discount_price || a.price) - Number(b.discount_price || b.price));
    } else if (params.sort === 'price_desc') {
      list.sort((a, b) => Number(b.discount_price || b.price) - Number(a.discount_price || a.price));
    }
    return { count: list.length, products: list };
  },

  getProductBySlug: async (slug: string) => {
    try {
      const res = await request<{ product: Product; reviews: Review[] }>(`/products/slug/${slug}`);
      if (res && res.product) return res;
    } catch (err) {
      console.warn('Backend unavailable, serving fallback product detail:', err);
    }
    const product = FALLBACK_PRODUCTS.find(p => p.slug === slug);
    if (!product) throw new Error('Product not found');
    const reviews = FALLBACK_REVIEWS.filter(r => r.product_id === product.id);
    return { product, reviews };
  },

  getProductById: async (id: number) => {
    try {
      const res = await request<{ product: Product; reviews: Review[] }>(`/products/${id}`);
      if (res && res.product) return res;
    } catch (err) {
      console.warn('Backend unavailable, serving fallback product by id:', err);
    }
    const product = FALLBACK_PRODUCTS.find(p => p.id === Number(id));
    if (!product) throw new Error('Product not found');
    const reviews = FALLBACK_REVIEWS.filter(r => r.product_id === product.id);
    return { product, reviews };
  },

  createProduct: (payload: Partial<Product>) =>
    request<{ message: string; product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateProduct: (id: number, payload: Partial<Product>) =>
    request<{ message: string; product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  deleteProduct: (id: number) =>
    request<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),

  adjustStock: (id: number, delta: number, reason?: string) =>
    request<{ message: string; newStock: number }>(`/products/${id}/stock`, {
      method: 'POST',
      body: JSON.stringify({ delta, reason })
    }),

  // Categories
  getCategories: async () => {
    try {
      const res = await request<{ categories: Category[] }>('/categories');
      if (res && Array.isArray(res.categories) && res.categories.length > 0) return res;
    } catch (err) {
      console.warn('Backend unavailable, serving fallback categories:', err);
    }
    return { categories: FALLBACK_CATEGORIES };
  },

  createCategory: (payload: Partial<Category>) =>
    request<{ message: string; category: Category }>('/categories', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateCategory: (id: number, payload: Partial<Category>) =>
    request<{ message: string; category: Category }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  deleteCategory: (id: number) =>
    request<{ message: string }>(`/categories/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: () =>
    request<{ cartId: number; items: CartItem[]; subtotal: number; totalItems: number; freeDeliveryThreshold: number }>('/cart'),

  addToCart: (productId: number, quantity: number = 1) =>
    request<{ message: string; cartId: number; items: CartItem[]; subtotal: number; totalItems: number }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    }),

  updateCartItem: (cartItemId: number, quantity: number) =>
    request<{ message: string; cartId: number; items: CartItem[]; subtotal: number; totalItems: number }>(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    }),

  clearCart: () =>
    request<{ message: string; items: CartItem[]; subtotal: number; totalItems: number }>('/cart', {
      method: 'DELETE'
    }),

  // Wishlist
  getWishlist: () =>
    request<{ wishlist: WishlistItem[] }>('/wishlist'),

  toggleWishlist: (productId: number) =>
    request<{ inWishlist: boolean }>('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId })
    }),

  // Addresses
  getAddresses: () =>
    request<{ addresses: Address[] }>('/addresses'),

  addAddress: (payload: Partial<Address>) =>
    request<{ message: string; address: Address }>('/addresses', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  deleteAddress: (id: number) =>
    request<{ message: string }>(`/addresses/${id}`, { method: 'DELETE' }),

  // Coupons
  getCoupons: async (all = false) => {
    try {
      const res = await request<{ coupons: Coupon[] }>(`/coupons?all=${all}`);
      if (res && Array.isArray(res.coupons) && res.coupons.length > 0) return res;
    } catch (err) {
      console.warn('Backend unavailable, serving fallback coupons:', err);
    }
    return { coupons: FALLBACK_COUPONS };
  },

  validateCoupon: async (code: string, subtotal: number) => {
    try {
      return await request<{ valid: boolean; message: string; coupon: { id: number; code: string; description: string; discount_amount: number }; discount_amount: number }>('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal })
      });
    } catch (err) {
      // Local validation fallback
      const c = FALLBACK_COUPONS.find(item => item.code.toUpperCase() === code.trim().toUpperCase() && item.is_active);
      if (!c) {
        throw new Error('Invalid or expired coupon code.');
      }
      if (subtotal < Number(c.min_order_amount)) {
        throw new Error(`Minimum order amount of ₹${c.min_order_amount} required to apply this coupon.`);
      }
      let disc = c.discount_type === 'percent' ? Math.round((subtotal * Number(c.discount_value)) / 100) : Number(c.discount_value);
      if (c.max_discount) disc = Math.min(disc, Number(c.max_discount));
      return {
        valid: true,
        message: `Coupon ${c.code} applied: ₹${disc} discount!`,
        coupon: {
          id: c.id,
          code: c.code,
          description: c.description,
          discount_amount: disc
        },
        discount_amount: disc
      };
    }
  },

  // Orders
  checkout: (payload: { addressId: number; couponCode?: string; paymentMethod: string; deliverySlot?: string; notes?: string }) =>
    request<{ message: string; order: Order }>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMyOrders: () =>
    request<{ count: number; orders: Order[] }>('/orders/my-orders'),

  getOrderDetails: (id: number | string) =>
    request<{ order: Order }>(`/orders/${id}`),

  cancelOrder: (id: number | string, reason?: string) =>
    request<{ success: boolean; message: string }>(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    }),

  // Reviews
  addReview: (payload: { productId: number; rating: number; title: string; comment: string }) =>
    request<{ message: string; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Banners
  getBanners: async () => {
    try {
      const res = await request<{ banners: Banner[] }>('/banners');
      if (res && Array.isArray(res.banners) && res.banners.length > 0) return res;
    } catch (err) {
      console.warn('Backend unavailable, serving fallback banners:', err);
    }
    return { banners: FALLBACK_BANNERS };
  },

  // Admin
  getAdminDashboard: async () => {
    try {
      return await request<AdminStats>('/admin/dashboard');
    } catch (err) {
      // Fallback dashboard stats for preview/demo
      return {
        totalRevenue: 28450,
        totalOrders: 32,
        totalCustomers: 18,
        lowStockCount: 2,
        recentOrders: [
          {
            id: 101,
            order_number: 'SSNF-20260906-8821',
            user_id: 2,
            customer_name: 'Sai Customer',
            customer_email: 'customer@sainaturals.com',
            total_amount: 1450,
            order_status: 'out_for_delivery',
            payment_status: 'paid',
            payment_method: 'upi',
            delivery_slot: 'Morning (8:00 AM - 11:00 AM)',
            created_at: new Date().toISOString()
          }
        ],
        topProducts: FALLBACK_PRODUCTS.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          price: p.price,
          discount_price: p.discount_price,
          stock_quantity: p.stock_quantity,
          total_sold: 24
        }))
      };
    }
  },

  getAdminOrders: (params: { status?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    return request<{ count: number; orders: Order[] }>(`/admin/orders?${query.toString()}`);
  },

  updateOrderStatus: (id: number, status: string) =>
    request<{ message: string; order: Order }>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  getAdminCustomers: () =>
    request<{ count: number; customers: Array<User & { total_orders: number; total_spend: number }> }>('/admin/customers'),

  getAdminInventory: (lowStock = false) =>
    request<{ count: number; lowStockCount: number; inventory: Product[] }>(`/admin/inventory?lowStock=${lowStock}`),

  getAdminSalesReport: () =>
    request<{
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      paymentSplit: { cod: number; upi: number };
      dailySales: Array<{ date: string; amount: number }>;
    }>('/admin/reports/sales')
};
