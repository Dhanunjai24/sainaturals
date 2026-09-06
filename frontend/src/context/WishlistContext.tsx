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
    if (token) {
      try {
        const res = await api.getWishlist();
        setWishlist(res.wishlist);
      } catch (e) {
        console.warn('Could not load wishlist');
      }
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
    if (!token) {
      alert('Please log in to save items to your wishlist.');
      return false;
    }
    const res = await api.toggleWishlist(productId);
    await refreshWishlist();
    return res.inWishlist;
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
