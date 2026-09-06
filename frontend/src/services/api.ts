import { User, Product, Category, CartItem, WishlistItem, Address, Coupon, Order, Review, Banner, AdminStats } from '../types';

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
  login: (credentials: { email: string; password: string }) =>
    request<{ message: string; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  register: (payload: { name: string; email: string; phone?: string; password: string }) =>
    request<{ message: string; user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  // Products
  getProducts: (params: { category?: string; search?: string; inStock?: boolean; minPrice?: number; maxPrice?: number; sort?: string; featured?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.inStock) query.append('inStock', 'true');
    if (params.minPrice) query.append('minPrice', String(params.minPrice));
    if (params.maxPrice) query.append('maxPrice', String(params.maxPrice));
    if (params.sort) query.append('sort', params.sort);
    if (params.featured) query.append('featured', 'true');
    return request<{ count: number; products: Product[] }>(`/products?${query.toString()}`);
  },

  getProductBySlug: (slug: string) =>
    request<{ product: Product; reviews: Review[] }>(`/products/slug/${slug}`),

  getProductById: (id: number) =>
    request<{ product: Product; reviews: Review[] }>(`/products/${id}`),

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
  getCategories: () =>
    request<{ categories: Category[] }>('/categories'),

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
  getCoupons: (all = false) =>
    request<{ coupons: Coupon[] }>(`/coupons?all=${all}`),

  validateCoupon: (code: string, subtotal: number) =>
    request<{ valid: boolean; coupon: { id: number; code: string; description: string; discount_amount: number } }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    }),

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
  getBanners: () =>
    request<{ banners: Banner[] }>('/banners'),

  // Admin
  getAdminDashboard: () =>
    request<AdminStats>('/admin/dashboard'),

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
