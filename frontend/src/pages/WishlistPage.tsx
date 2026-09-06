import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (item: any) => {
    const productMock: Product = {
      id: item.product_id,
      name: item.name,
      local_name: item.local_name,
      slug: '',
      price: item.price,
      discount_price: item.discount_price,
      stock_quantity: item.stock_quantity,
      unit: item.unit,
      image_url: item.image_url,
      rating: item.rating,
      review_count: 0
    };
    await addToCart(productMock, 1);
    await toggleWishlist(item.product_id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">My Wishlist</h1>
        <p className="text-xs text-stone-500 mt-1">{wishlist.length} saved products</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-base text-stone-900">Your wishlist is empty</h3>
          <p className="text-xs text-stone-500">
            Click the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs"
          >
            Explore Groceries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="relative aspect-square bg-stone-50 flex items-center justify-center p-2">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                <button
                  onClick={() => toggleWishlist(item.product_id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-2">{item.name}</h4>
                  <span className="text-[11px] text-stone-400 font-mono">{item.unit}</span>
                  <div className="mt-1">
                    <span className="font-extrabold text-sm text-stone-950">₹{item.discount_price || item.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-2 px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
