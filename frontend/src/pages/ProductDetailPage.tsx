import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingBag, Heart, ShieldCheck, Truck, Check, 
  ArrowLeft, Plus, Minus, MessageCircle, Sparkles 
} from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      try {
        setIsLoading(true);
        const res = await api.getProductBySlug(slug);
        setProduct(res.product);
        setReviews(res.reviews);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 bg-stone-200 rounded w-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-stone-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/4" />
            <div className="h-20 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-sm text-stone-500">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs">
          Back to Products
        </Link>
      </div>
    );
  }

  const inWish = isInWishlist(product.id);
  const discountPercent = product.discount_price && product.price > product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review.');
      navigate('/login');
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await api.addReview({
        productId: product.id,
        rating: newRating,
        title: newTitle,
        comment: newComment
      });
      setReviews([res.review, ...reviews]);
      setReviewMessage('Thank you! Your review has been submitted.');
      setNewTitle('');
      setNewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Sri Sai Natural Foods! 🌿\n\nI'm interested in ordering:\n*${product.name}* (${product.unit})\nPrice: ₹${product.discount_price || product.price}\nQuantity: ${quantity}\n\nPlease confirm availability and home delivery details.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back link */}
      <div>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Products</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="relative rounded-3xl overflow-hidden bg-stone-50 border border-stone-200/80 shadow-md aspect-square flex items-center justify-center p-4 sm:p-6">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          />
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-4 right-4 p-3 rounded-full transition-colors ${
              inWish ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-stone-400 hover:text-rose-500 shadow-md'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 mb-1.5">
              <span>{product.category_name || 'Groceries'}</span>
              <span>·</span>
              <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">{product.unit}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.local_name && (
              <p className="text-sm font-semibold text-amber-700 mt-1">
                {product.local_name}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-800">{product.rating} / 5</span>
              <span className="text-xs text-stone-400">({product.review_count} verified reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-wrap items-baseline gap-2.5 sm:gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-950">
              ₹{product.discount_price || product.price}
            </span>
            {product.discount_price && product.discount_price < product.price && (
              <span className="text-xs sm:text-sm text-stone-400 line-through">
                ₹{product.price}
              </span>
            )}
            <span className="text-[11px] sm:text-xs text-emerald-700 font-bold sm:ml-auto">
              {product.stock_quantity > 0 ? '✓ Available in Store' : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-2">
            <p>{product.description}</p>
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock_quantity > 0 ? (
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 sm:px-4 text-sm font-bold text-stone-900 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-2 text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-stone-400">
                  (Max {product.stock_quantity} available)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-sm shadow-md transition-all active:scale-95"
                >
                  Buy Now
                </button>
              </div>

              {/* WhatsApp direct order button */}
              <a
                href={`https://wa.me/917799549977?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Instant Order on WhatsApp</span>
              </a>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold text-center">
              Currently Out of Stock. Please check back soon or call store at 077995 49977.
            </div>
          )}

          {/* Delivery & Purity Highlights */}
          <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Truck className="w-4 h-4 text-brand-700 flex-shrink-0" />
              <span>Free Delivery in Hafeezpet (₹500+)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <ShieldCheck className="w-4 h-4 text-brand-700 flex-shrink-0" />
              <span>100% Guaranteed Purity</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS & RATINGS SECTION */}
      <section className="pt-8 border-t border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Write a Review */}
          <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">Write a Customer Review</h3>
            {reviewMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium border border-emerald-200">
                {reviewMessage}
              </div>
            )}
            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-stone-700">{newRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Review Title</label>
                <input
                  type="text"
                  placeholder="e.g. Pure authentic aroma"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Comments</label>
                <textarea
                  placeholder="Tell other shoppers about your experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition-colors"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">
              Customer Reviews ({reviews.length})
            </h3>
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                          {(rev.user_name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-xs text-stone-900">{rev.user_name || 'Verified Customer'}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h4 className="text-xs font-bold text-stone-900">{rev.title}</h4>}
                    <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 bg-white p-6 rounded-2xl border border-stone-200 text-center">
                No reviews yet. Be the first customer to review this product!
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
