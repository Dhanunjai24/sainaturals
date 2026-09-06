import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, Plus, Minus, ArrowRight, ShoppingBag, 
  MessageCircle, Tag, Check, AlertCircle, Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartPage: React.FC = () => {
  const { 
    items, itemCount, subtotal, deliveryFee, discountAmount, 
    totalAmount, appliedCoupon, updateQuantity, removeFromCart, 
    clearCart, applyCoupon, removeCoupon 
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    const res = await applyCoupon(couponCode.trim());
    setIsApplying(false);
    if (res.success) {
      setCouponFeedback({ type: 'success', text: res.message });
      setCouponCode('');
    } else {
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  const freeDeliveryThreshold = 500;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  // WhatsApp order builder
  const buildWhatsAppUrl = () => {
    let msg = `Hello Sri Sai Natural Foods! 🌿\n\nI would like to place an order:\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* (${item.unit}) × ${item.quantity} = ₹${(Number(item.discount_price || item.price) * item.quantity)}\n`;
    });
    msg += `\n─────────────────\n`;
    msg += `Subtotal: ₹${subtotal}\n`;
    if (discountAmount > 0) msg += `Coupon (${appliedCoupon?.code}): -₹${discountAmount}\n`;
    msg += `Delivery Fee: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\n`;
    msg += `*Total Amount: ₹${totalAmount}*\n\n`;
    msg += `Please confirm order availability and dispatch timing. Thank you! 🙏`;
    return `https://wa.me/917799549977?text=${encodeURIComponent(msg)}`;
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto text-2xl">
          🛒
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500">
          Looks like you haven't added any fresh oils or natural groceries yet.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs shadow-md transition-colors"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-stone-500 mt-1">{itemCount} items in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-brand-800">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            {amountNeededForFreeDelivery === 0 ? (
              <span className="text-emerald-700">🎉 Congratulations! You unlocked FREE Delivery in Hafeezpet!</span>
            ) : (
              <span>Add ₹{amountNeededForFreeDelivery} more to get FREE Local Delivery!</span>
            )}
          </span>
          <span className="text-stone-500">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:border-brand-200 transition-colors"
            >
              {/* Item Top on mobile / Left on desktop */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain bg-stone-50 border border-stone-100 p-1 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/products`} className="font-bold text-sm text-stone-900 line-clamp-2 hover:text-brand-700">
                      {item.name}
                    </Link>
                    {/* Remove button on mobile top-right */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors sm:hidden flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.local_name && (
                    <p className="text-[11px] text-amber-700 font-medium truncate">{item.local_name}</p>
                  )}
                  <span className="text-[11px] text-stone-400 font-mono">{item.unit}</span>

                  <div className="hidden sm:flex items-center gap-2 mt-2">
                    <span className="text-sm font-extrabold text-stone-900">
                      ₹{item.discount_price || item.price}
                    </span>
                    {item.discount_price && item.discount_price < item.price && (
                      <span className="text-xs text-stone-400 line-through">₹{item.price}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Item Bottom on mobile / Right on desktop */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-stone-100 sm:border-0">
                {/* Mobile price display */}
                <div className="flex items-center gap-1.5 sm:hidden">
                  <span className="text-sm font-extrabold text-stone-900">
                    ₹{item.discount_price || item.price}
                  </span>
                  {item.discount_price && item.discount_price < item.price && (
                    <span className="text-xs text-stone-400 line-through">₹{item.price}</span>
                  )}
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 px-2 text-stone-600 hover:bg-stone-200 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 sm:px-3 text-xs font-bold text-stone-900 min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock_quantity}
                    className="p-1.5 px-2 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Desktop Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="hidden sm:block p-2 text-stone-400 hover:text-rose-600 transition-colors flex-shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          {/* Coupon Box */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Apply Coupon Code</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-emerald-900 font-mono">{appliedCoupon.code}</span>
                  <p className="text-[11px] text-emerald-700">Saved ₹{appliedCoupon.discount_amount} with coupon</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME50 or SAI10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs uppercase font-mono focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
                <button
                  type="submit"
                  disabled={isApplying || !couponCode.trim()}
                  className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                >
                  {isApplying ? '...' : 'Apply'}
                </button>
              </form>
            )}

            {couponFeedback && (
              <p className={`text-[11px] font-medium ${
                couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {couponFeedback.text}
              </p>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-stone-900">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 uppercase tracking-wider text-[11px]">Free</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-stone-900">Total Amount</span>
                <span className="text-2xl font-black text-stone-950">₹{totalAmount}</span>
              </div>
            </div>

            {/* Standard Checkout Button */}
            <button
              onClick={() => {
                if (!user) {
                  navigate('/login?redirect=checkout');
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Instant WhatsApp Order Option */}
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Instant Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
