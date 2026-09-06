import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  appliedCoupon: { code: string; discount_amount: number; description: string } | null;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_amount: number; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    if (token) {
      try {
        setIsLoading(true);
        const res = await api.getCart();
        setItems(res.items);
      } catch (err) {
        console.warn('Could not load server cart, falling back to local');
      } finally {
        setIsLoading(false);
      }
    } else {
      const saved = localStorage.getItem('sai_guest_cart');
      if (saved) {
        try { setItems(JSON.parse(saved)); } catch (e) {}
      }
    }
  };

  useEffect(() => {
    refreshCart();
  }, [token]);

  const saveLocalGuestCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('sai_guest_cart', JSON.stringify(newItems));
  };

  const addToCart = async (product: Product, quantity = 1) => {
    if (token) {
      const res = await api.addToCart(product.id, quantity);
      setItems(res.items);
    } else {
      // Guest cart
      const existing = items.find(i => i.product_id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = items.map(i =>
          i.product_id === product.id
            ? { ...i, quantity: Math.min(product.stock_quantity, i.quantity + quantity) }
            : i
        );
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          cart_id: 0,
          product_id: product.id,
          name: product.name,
          local_name: product.local_name,
          price: product.price,
          discount_price: product.discount_price,
          stock_quantity: product.stock_quantity,
          unit: product.unit,
          image_url: product.image_url,
          quantity: Math.min(product.stock_quantity, quantity)
        };
        updated = [...items, newItem];
      }
      saveLocalGuestCart(updated);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (token) {
      const res = await api.updateCartItem(cartItemId, quantity);
      setItems(res.items);
    } else {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = items.filter(i => i.id !== cartItemId);
      } else {
        updated = items.map(i => i.id === cartItemId ? { ...i, quantity } : i);
      }
      saveLocalGuestCart(updated);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    await updateQuantity(cartItemId, 0);
  };

  const clearCart = async () => {
    if (token) {
      await api.clearCart();
    }
    setItems([]);
    localStorage.removeItem('sai_guest_cart');
    setAppliedCoupon(null);
  };

  // Computations
  const subtotal = items.reduce(
    (sum, i) => sum + (Number(i.discount_price || i.price) * i.quantity),
    0
  );
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 40;
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  const applyCoupon = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        setAppliedCoupon({
          code: res.coupon.code,
          discount_amount: res.coupon.discount_amount,
          description: res.coupon.description
        });
        return { success: true, message: `Coupon "${code}" applied! Saved ₹${res.coupon.discount_amount}` };
      }
      return { success: false, message: 'Invalid coupon' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to apply coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        discountAmount,
        totalAmount,
        appliedCoupon,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
