import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Plus, Minus, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = items.find(i => i.product_id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const inWish = isInWishlist(product.id);

  const discountPercent = product.discount_price && product.price > product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && qtyInCart < product.stock_quantity) {
      await updateQuantity(cartItem.id, qtyInCart + 1);
    }
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      await updateQuantity(cartItem.id, qtyInCart - 1);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col overflow-hidden w-full min-w-0">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 max-w-[70%]">
        {discountPercent > 0 && (
          <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.is_featured && (
          <span className="bg-brand-700 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-xs truncate">
            Bestseller
          </span>
        )}
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <span className="bg-rose-500 text-white text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs animate-pulse truncate">
            Only {product.stock_quantity} left
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-2 right-2 z-10 p-1.5 sm:p-2 rounded-full transition-colors ${
          inWish ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-stone-400 hover:text-rose-500 shadow-sm'
        }`}
        aria-label="Add to wishlist"
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWish ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square bg-stone-50/80 overflow-hidden flex items-center justify-center p-2">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock_quantity <= 0 && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
            <span className="bg-white text-stone-900 font-bold px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Category & Unit */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-stone-500 mb-1 gap-1">
            <span className="font-semibold text-brand-700 truncate">{product.category_name || 'Groceries'}</span>
            <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono text-[9px] sm:text-[10px] flex-shrink-0">{product.unit}</span>
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
              {product.name}
            </h3>
            {product.local_name && (
              <p className="text-[10px] sm:text-xs text-amber-700 font-medium mt-0.5 truncate">
                {product.local_name}
              </p>
            )}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
            <div className="flex items-center text-amber-400 text-xs">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span className="font-bold text-stone-800 ml-1 text-[11px] sm:text-xs">{product.rating}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-stone-400">({product.review_count})</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-base sm:text-lg font-black text-stone-900">
                ₹{product.discount_price || product.price}
              </span>
              {product.discount_price && product.discount_price < product.price && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-stone-400">Incl. all taxes</p>
          </div>

          {/* Stepper or Add Button */}
          <div className="w-full sm:w-auto">
            {product.stock_quantity <= 0 ? (
              <button disabled className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-400 text-[11px] font-semibold cursor-not-allowed text-center">
                Sold Out
              </button>
            ) : qtyInCart > 0 ? (
              <div className="flex items-center justify-between sm:justify-start bg-brand-50 border border-brand-300 rounded-xl overflow-hidden shadow-xs w-full sm:w-auto">
                <button
                  onClick={handleDecrement}
                  className="p-2 text-brand-800 hover:bg-brand-200 transition-colors flex-1 sm:flex-none flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold text-brand-900 min-w-[20px] text-center">
                  {qtyInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={qtyInCart >= product.stock_quantity}
                  className="p-2 text-brand-800 hover:bg-brand-200 transition-colors disabled:opacity-40 flex-1 sm:flex-none flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                disabled={isAdding}
                className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-xs transition-all duration-200 min-h-[34px] ${
                  isAdding
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-700 hover:bg-brand-800 text-white active:scale-95'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-3.5 h-3.5 animate-bounce" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
