import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, ShoppingCart, Heart, User, MapPin, Phone, 
  X, ChevronDown, LogOut, LayoutDashboard, MessageCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { StoreStatusBadge } from '../common/StoreStatusBadge';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open and support Escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Close mobile drawer and profile dropdown on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Transparent only on Homepage when user has not scrolled down
  const isTransparent = location.pathname === '/' && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-[72px] z-50 flex items-center transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent text-white border-b border-transparent'
          : 'bg-[#FDF8F0]/95 backdrop-blur-md shadow-sm border-b border-[#2C1A05]/10 text-[#1A0F00]'
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0 text-lg transition-colors ${
              isTransparent
                ? 'bg-[#2D5016]/90 border border-white/20 text-white'
                : 'bg-[#2D5016] text-white shadow-sm'
            }`}
          >
            🌿
          </div>
          <div className="leading-tight">
            <span
              className={`block font-serif font-bold text-lg sm:text-[1.35rem] tracking-tight leading-none transition-colors ${
                isTransparent ? 'text-white' : 'text-[#2D5016]'
              }`}
            >
              Sri Sai Natural Foods
            </span>
            <span
              className={`block text-[10px] sm:text-[11px] font-sans font-semibold tracking-wider uppercase mt-1 transition-colors ${
                isTransparent ? 'text-[#E09B1A]' : 'text-[#B07A0D]'
              }`}
            >
              Hafeezpet · Hyderabad
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 flex-shrink-0">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[0.95rem] font-medium transition-colors relative py-1 ${
                  isTransparent
                    ? isActive
                      ? 'text-white font-semibold'
                      : 'text-white/90 hover:text-white'
                    : isActive
                    ? 'text-[#2D5016] font-semibold'
                    : 'text-[#5C3D15] hover:text-[#2D5016]'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                      isTransparent ? 'bg-[#E09B1A]' : 'bg-[#2D5016]'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Auth + Order Now + Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
          {/* Auth: User Profile Avatar if authenticated, else Login / Register Button */}
          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all shadow-sm ${
                  isTransparent
                    ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                    : 'bg-[#2D5016] text-white hover:bg-[#3A6420]'
                }`}
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-[#1A0F00]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-bold text-sm text-stone-900 truncate">{user.name}</p>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>

                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 font-medium">
                    <User className="w-4 h-4 text-stone-400" />
                    <span>My Profile & Addresses</span>
                  </Link>
                  <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 font-medium">
                    <ShoppingCart className="w-4 h-4 text-stone-400" />
                    <span>My Orders</span>
                  </Link>

                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-xs text-amber-800 bg-amber-50/50 hover:bg-amber-100 font-bold">
                      <LayoutDashboard className="w-4 h-4 text-amber-600" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t border-stone-100 mt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              {/* Desktop / Tablet Login or Register Pill */}
              <div
                className={`hidden sm:inline-flex items-center rounded-full p-0.5 text-xs font-bold transition-all ${
                  isTransparent
                    ? 'border border-white/30 bg-white/10 backdrop-blur-sm text-white'
                    : 'border border-[#2D5016]/20 bg-white text-[#2D5016] shadow-sm hover:border-[#2D5016]/40'
                }`}
              >
                <Link
                  to="/login"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    isTransparent
                      ? 'hover:bg-white/20 text-white'
                      : 'hover:bg-[#2D5016] hover:text-white text-[#2D5016]'
                  }`}
                  aria-label="Login to account"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <span className={`text-[11px] select-none ${isTransparent ? 'text-white/40' : 'text-[#2D5016]/30'}`}>
                  /
                </span>
                <Link
                  to="/register"
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    isTransparent
                      ? 'hover:bg-white/20 text-white'
                      : 'hover:bg-[#2D5016] hover:text-white text-[#2D5016]'
                  }`}
                  aria-label="Register new account"
                >
                  <span>Register</span>
                </Link>
              </div>

              {/* Mobile circular User icon button */}
              <Link
                to="/login"
                className={`sm:hidden w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  isTransparent
                    ? 'border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white'
                    : 'border-2 border-[#E8D5BC] bg-white text-[#2C1A05] hover:border-[#3A6420] shadow-sm'
                }`}
                aria-label="Login or Register"
                title="Login or Register"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Order Now (Reference Amber Pill Button with WhatsApp SVG) */}
          <a
            href="https://wa.me/917799549977?text=Hi%20Sri%20Sai%20Natural%20Foods,%20I%20would%20like%20to%20place%20an%20order!"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8860A] hover:bg-[#B07A0D] text-white text-sm font-bold shadow-md shadow-amber-950/20 transition-transform active:scale-95"
            aria-label="Order on WhatsApp"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span>Order Now</span>
          </a>

          {/* Cart Button (Circular Glass Pill Matching Reference) */}
          <Link
            to="/cart"
            className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isTransparent
                ? 'border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:border-white/50 hover:bg-white/20'
                : 'border-2 border-[#E8D5BC] bg-white text-[#2C1A05] hover:border-[#3A6420] hover:text-[#3A6420] hover:bg-[#F2F7EC] shadow-sm'
            }`}
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8860A] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <div className="w-6 flex flex-col gap-1.5 justify-center items-center">
              <span
                className={`block w-6 h-0.5 rounded-full transition-colors ${
                  isTransparent ? 'bg-white' : 'bg-[#1A0F00]'
                }`}
              />
              <span
                className={`block w-6 h-0.5 rounded-full transition-colors ${
                  isTransparent ? 'bg-white' : 'bg-[#1A0F00]'
                }`}
              />
              <span
                className={`block w-6 h-0.5 rounded-full transition-colors ${
                  isTransparent ? 'bg-white' : 'bg-[#1A0F00]'
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </header>

    {/* SLIDE-OUT MOBILE DRAWER (Rendered outside <header> to prevent height clipping) */}
    {/* Fullscreen Backdrop */}
    {isMobileMenuOpen && (
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[998] md:hidden transition-opacity"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )}

    {/* Side Menu Bar Drawer (Full-Height 100vh) */}
    <div
      className={`fixed inset-y-0 left-0 h-full h-dvh w-80 max-w-[85vw] bg-[#141d16] text-white z-[999] md:hidden shadow-2xl p-5 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out border-r border-white/10 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
        <div className="space-y-5">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white">
                🌿
              </div>
              <div>
                <h3 className="font-bold text-sm text-white leading-tight">Sri Sai Natural Foods</h3>
                <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">Hafeezpet</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-1">
            <StoreStatusBadge compact />
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search oils, dals, ghee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Side Menu Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-stone-200 transition-colors"
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-stone-200 transition-colors"
            >
              <span>🛒</span>
              <span>All Products</span>
            </Link>
            <Link
              to="/products?category=wood-pressed-oils"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-stone-200 transition-colors"
            >
              <span>🪵</span>
              <span>Wood-Pressed Oils</span>
            </Link>
            <Link
              to="/products?category=desi-ghee"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-stone-200 transition-colors"
            >
              <span>🥛</span>
              <span>Desi Cow Ghee</span>
            </Link>
            <Link
              to="/offers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
            >
              <span>🏷️</span>
              <span>Special Offers & Coupons</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-stone-200 transition-colors"
            >
              <span>🌿</span>
              <span>About Us</span>
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-stone-200 transition-colors"
            >
              <span>📍</span>
              <span>Contact Store</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-stone-200 transition-colors"
            >
              <span>❤️</span>
              <span>My Wishlist ({wishlistCount})</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/30 transition-colors font-bold"
              >
                <span>⚙️</span>
                <span>Admin Portal</span>
              </Link>
            )}
            {!user ? (
              <div className="pt-2 border-t border-white/10 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 transition-colors font-bold"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Login / Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/20 transition-colors font-semibold"
                >
                  <span>✨</span>
                  <span>Register / Create Account</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 transition-colors"
              >
                <span>👤</span>
                <span>My Profile ({user.name})</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2.5">
          <a
            href="https://wa.me/917799549977?text=Hi%20Sri%20Sai%20Natural%20Foods,%20I%20would%20like%20to%20place%20an%20order!"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-[#C8860A] hover:bg-[#b07406] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Order on WhatsApp</span>
          </a>

          <a
            href="tel:+917799549977"
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Call: 077995 49977</span>
          </a>
        </div>
      </div>
    </>
  );
};
