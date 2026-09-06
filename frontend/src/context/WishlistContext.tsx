import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const refreshWishlist = async () => {
    if (token && token !== 'demo_admin_jwt_token' && token !== 'demo_customer_jwt_token') {
      try {
        const res = await api.getWishlist();
        setWishlist(res?.wishlist || []);
        return;
      } catch (e) {
        console.warn('Could not load server wishlist, falling back to local');
      }
    }
    const saved = localStorage.getItem('sai_guest_wishlist');
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch (e) {}
    } else {
      setWishlist([]);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [token]);

  const isInWishlist = (productId: number) => {
    return wishlist.some(w => w.product_id === productId);
  };

  const toggleWishlist = async (productId: number) => {
    if (token && token !== 'demo_admin_jwt_token' && token !== 'demo_customer_jwt_token') {
      try {
        const res = await api.toggleWishlist(productId);
        await refreshWishlist();
        return res.inWishlist;
      } catch (err) {
        console.warn('Server toggleWishlist failed, toggling locally:', err);
      }
    }
    // Local / Guest wishlist toggle
    const exists = isInWishlist(productId);
    let updated: WishlistItem[];
    if (exists) {
      updated = wishlist.filter(w => w.product_id !== productId);
    } else {
      const newItem: WishlistItem = {
        id: Date.now(),
        user_id: 0,
        product_id: productId,
        created_at: new Date().toISOString()
      };
      updated = [...wishlist, newItem];
    }
    setWishlist(updated);
    localStorage.setItem('sai_guest_wishlist', JSON.stringify(updated));
    return !exists;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
