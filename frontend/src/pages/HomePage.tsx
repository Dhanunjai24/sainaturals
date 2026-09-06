import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Heart, Star, 
  Clock, Truck, Award, CheckCircle2, ChevronRight, MessageCircle 
} from 'lucide-react';
import { Product, Category, Banner } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';

export const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setIsLoading(true);
        const [bannerRes, catRes, featRes] = await Promise.all([
          api.getBanners(),
          api.getCategories(),
          api.getProducts({ featured: true })
        ]);
        setBanners(bannerRes.banners);
        setCategories(catRes.categories);
        setFeaturedProducts(featRes.products);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Auto rotate banners if any
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[activeBannerIdx];

  return (
    <div className="w-full">
      {/* ======= HERO SECTION (EXACT MATCH TO sainaturals.vercel.app) ======= */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#1A0F00] pt-[72px]">
        {/* Full-Bleed Background Image with Reference Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Sri Sai Natural Foods — Wood pressed oils, pure ghee and natural groceries"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Reference overlay: linear-gradient(135deg, rgba(26,15,0,.72) 0%, rgba(45,80,22,.55) 50%, rgba(26,15,0,.4) 100%) */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(26,15,0,0.72) 0%, rgba(45,80,22,0.55) 50%, rgba(26,15,0,0.4) 100%)'
            }}
          />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-[700px]">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8860A]/25 border border-[#C8860A]/40 backdrop-blur-md text-[#FEF3DC] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
              <span>⭐ 4.9 · 47 Google Reviews</span>
              <span className="w-px h-3.5 bg-white/30" />
              <span>Hafeezpet, Hyderabad</span>
            </div>

            {/* Playfair Display Title */}
            <h1 className="font-serif text-4xl xs:text-5xl sm:text-6xl lg:text-[4rem] font-bold text-white leading-[1.14] mb-6 tracking-tight">
              Nature's best,<br />
              <em className="text-[#E09B1A] italic font-serif">pressed fresh</em><br />
              for your family.
            </h1>

            {/* Subtitle */}
            <p className="text-white/85 text-base sm:text-lg sm:leading-relaxed max-w-[520px] mb-8 font-sans">
              Wood-pressed oils, pure ghee, fresh pulses and natural groceries — prepared the traditional way on Kaman Main Road, Hafeezpet.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                to="/products"
                id="hero-shop-btn"
                className="px-8 py-3.5 rounded-full bg-[#C8860A] hover:bg-[#B07A0D] text-white font-bold text-base shadow-lg shadow-amber-950/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Shop All Products
              </Link>
              <a
                href="https://wa.me/917799549977?text=Hi%20Sri%20Sai%20Natural%20Foods,%20I%20would%20like%20to%20place%20an%20order!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full bg-transparent border-2 border-white/60 hover:bg-white hover:text-[#2D5016] text-white font-bold text-base backdrop-blur-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Rating Pill below Buttons */}
            <div className="inline-flex items-center gap-3 bg-white/12 border border-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl text-white text-sm">
              <span className="text-[#E09B1A] tracking-tighter text-base">★★★★★</span>
              <p className="text-white/90 text-xs sm:text-sm">
                <strong className="text-white font-bold">4.9</strong> · 47 Google reviews · Hafeezpet's most trusted natural store
              </p>
            </div>
          </div>
        </div>

        {/* Bouncing Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 text-[11px] font-semibold tracking-widest uppercase pointer-events-none animate-bounce">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
          <span>Scroll</span>
        </div>
      </section>

      {/* ======= TRUST BAR (EXACT MATCH TO sainaturals.vercel.app) ======= */}
      <div className="bg-[#2D5016] py-5 text-white w-full border-b border-[#1A2E0A]/20" role="complementary" aria-label="Store highlights">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between sm:justify-around flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/12 flex items-center justify-center text-lg flex-shrink-0">
                ⭐
              </div>
              <div>
                <strong className="block text-sm sm:text-base font-bold text-white leading-tight">4.9 / 5</strong>
                <span className="text-xs text-[#E4F0D0]">47 Google Reviews</span>
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-white/20" aria-hidden="true" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/12 flex items-center justify-center text-lg flex-shrink-0">
                🫙
              </div>
              <div>
                <strong className="block text-sm sm:text-base font-bold text-white leading-tight">Fresh Pressed Daily</strong>
                <span className="text-xs text-[#E4F0D0]">Watch your oil being pressed</span>
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-white/20" aria-hidden="true" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/12 flex items-center justify-center text-lg flex-shrink-0">
                🕙
              </div>
              <div>
                <strong className="block text-sm sm:text-base font-bold text-white leading-tight">Open Daily</strong>
                <span className="text-xs text-[#E4F0D0]">Closes 9:30 PM</span>
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-white/20" aria-hidden="true" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/12 flex items-center justify-center text-lg flex-shrink-0">
                💚
              </div>
              <div>
                <strong className="block text-sm sm:text-base font-bold text-white leading-tight">100% Natural</strong>
                <span className="text-xs text-[#E4F0D0]">No additives or chemicals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROMO TICKER (IF ACTIVE BANNERS EXIST) */}
      {banners.length > 0 && currentBanner && (
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8">
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase flex-shrink-0">
                {currentBanner.badge || 'OFFER'}
              </span>
              <p className="text-xs sm:text-sm font-semibold truncate">
                {currentBanner.title} — <span className="text-amber-200 font-normal">{currentBanner.subtitle}</span>
              </p>
            </div>
            <Link
              to={currentBanner.link_url || '/offers'}
              className="inline-flex items-center gap-1 text-xs font-extrabold bg-[#1A0F00] text-white px-4 py-2 rounded-full hover:bg-black transition-colors ml-auto sm:ml-0 flex-shrink-0"
            >
              <span>View Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* ======= FEATURED PRODUCTS (CUSTOMER FAVOURITES) ======= */}
      <section className="py-16 sm:py-20 w-full" aria-labelledby="featured-heading">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B07A0D] mb-2">From the shelves</p>
            <h2 id="featured-heading" className="font-serif text-3xl sm:text-4xl font-bold text-[#1A0F00] mb-3">
              Customer favourites
            </h2>
            <p className="text-sm sm:text-base text-[#5C3D15] max-w-xl mx-auto leading-relaxed">
              The products our regulars keep coming back for — naturally sourced, traditionally prepared.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#2D5016] text-[#2D5016] font-bold hover:bg-[#2D5016] hover:text-white transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
            >
              <span>View All Products →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ======= ABOUT SNIPPET (A NEIGHBOURHOOD STORE FOR NATURAL LIVING) ======= */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#E8D5BC]/60" aria-labelledby="about-snippet-heading">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] group">
              <img
                src="/images/store.jpg"
                alt="Sri Sai Natural Foods store interior with oil press machine"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#1A0F00]/85 backdrop-blur-md text-white p-4 rounded-2xl">
                <strong className="block text-sm font-bold">Est. Hafeezpet, Hyderabad</strong>
                <span className="text-xs text-[#E4F0D0]">Your neighbourhood natural store</span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#B07A0D]">Our story</p>
              <h2 id="about-snippet-heading" className="font-serif text-3xl sm:text-4xl font-bold text-[#1A0F00] leading-tight">
                A neighbourhood store for natural living
              </h2>
              <p className="text-sm sm:text-base text-[#5C3D15] leading-relaxed">
                Sri Sai Natural Foods is a general store on Kaman Main Road in Hafeezpet, built around one simple idea: natural food, prepared and sold the way it should be.
              </p>
              <p className="text-sm sm:text-base text-[#5C3D15] leading-relaxed">
                What customers notice most is the care — mustard oil pressed on clean machines, sometimes right in front of them, and staff who take the time to explain the health benefits of every product at honest, reasonable prices.
              </p>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#E8D5BC]/60">
                <div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2D5016]">47+</div>
                  <div className="text-xs text-[#8B6240] font-medium mt-1">Google Reviews</div>
                </div>
                <div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-[#C8860A]">4.9</div>
                  <div className="text-xs text-[#8B6240] font-medium mt-1">Star Rating</div>
                </div>
                <div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2D5016]">18+</div>
                  <div className="text-xs text-[#8B6240] font-medium mt-1">Natural Products</div>
                </div>
              </div>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D5016] text-white font-bold hover:bg-[#3A6420] transition-all shadow-md text-sm sm:text-base"
                >
                  <span>Learn Our Story →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= WHAT MAKES US DIFFERENT ======= */}
      <section className="py-16 sm:py-20 bg-[#FDF8F0]" aria-labelledby="features-heading">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B07A0D] mb-2">What makes us different</p>
            <h2 id="features-heading" className="font-serif text-3xl sm:text-4xl font-bold text-[#1A0F00] mb-3">
              The little things, done right
            </h2>
            <p className="text-sm sm:text-base text-[#5C3D15] max-w-xl mx-auto leading-relaxed">
              The habits that earned the store a 4.9-star rating from our community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8D5BC]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#F2F7EC] flex items-center justify-center text-2xl mb-5">
                🪵
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A0F00] mb-2">
                Oils pressed the traditional way
              </h3>
              <p className="text-xs sm:text-sm text-[#8B6240] leading-relaxed">
                Wood-pressed mustard and other oils prepared on clean machines — customers often watch their 5-litre tin being pressed fresh.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8D5BC]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#F2F7EC] flex items-center justify-center text-2xl mb-5">
                🌿
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A0F00] mb-2">
                Everything natural
              </h3>
              <p className="text-xs sm:text-sm text-[#8B6240] leading-relaxed">
                A wide variety of natural products and raw food items, kept fresh, clean and well organised with no hidden additives.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8D5BC]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#F2F7EC] flex items-center justify-center text-2xl mb-5">
                👨‍💼
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A0F00] mb-2">
                Staff who guide you
              </h3>
              <p className="text-xs sm:text-sm text-[#8B6240] leading-relaxed">
                The team explains the health benefits of each product, so you can pick what truly suits your family's needs.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8D5BC]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#F2F7EC] flex items-center justify-center text-2xl mb-5">
                💰
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A0F00] mb-2">
                Honest, reasonable prices
              </h3>
              <p className="text-xs sm:text-sm text-[#8B6240] leading-relaxed">
                Quality you can compare, and prices that keep customers coming back from all around the area every week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======= TESTIMONIALS SECTION ======= */}
      <section className="py-16 sm:py-20 bg-[#1A2E0A] text-white" aria-labelledby="reviews-heading">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E09B1A] mb-2">Straight from the reviews</p>
            <h2 id="reviews-heading" className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
              What customers keep mentioning
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="text-[#E09B1A] text-base mb-4 tracking-tighter">★★★★★</div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic mb-6">
                  "Best mustard oil for cooking. I got 5 litres of oil which was just prepared in front of my eyes, and a very neat and clean machine. I purchased ghee also and it is very good quality."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/15">
                <div className="w-10 h-10 rounded-full bg-[#C8860A] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                  VN
                </div>
                <div>
                  <strong className="block text-sm font-bold text-white">Viveka Nand</strong>
                  <span className="text-xs text-white/70">6 reviews · 4 months ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="text-[#E09B1A] text-base mb-4 tracking-tighter">★★★★★</div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic mb-6">
                  "Very neat and clean store. Wide variety of natural oils, pulses and raw food items. Staff are very helpful and explain health benefits of each product. Prices are very reasonable!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/15">
                <div className="w-10 h-10 rounded-full bg-[#3A6420] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                  SR
                </div>
                <div>
                  <strong className="block text-sm font-bold text-white">Suresh Reddy</strong>
                  <span className="text-xs text-white/70">12 reviews · 2 months ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="text-[#E09B1A] text-base mb-4 tracking-tighter">★★★★★</div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic mb-6">
                  "Genuine wood-pressed oils at a great price. The mustard oil aroma is exactly what I remember from my grandmother's kitchen. Highly recommended for health-conscious families."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/15">
                <div className="w-10 h-10 rounded-full bg-[#92630A] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                  PK
                </div>
                <div>
                  <strong className="block text-sm font-bold text-white">Priya Kumari</strong>
                  <span className="text-xs text-white/70">8 reviews · 1 month ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.google.com/search?q=Sri+Sai+Natural+Foods+Hafeezpet+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 border border-white/30 text-white hover:bg-white/25 transition-colors text-xs sm:text-sm font-medium"
            >
              <span>Read all 47 reviews on Google →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ======= CTA BANNER ======= */}
      <section className="py-16 sm:py-20 bg-[#2D5016] text-white" aria-label="Call to action">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E09B1A] mb-2">Come see us</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Open daily till 9:30 PM on Kaman Main Road
          </h2>
          <p className="text-sm sm:text-base text-[#E4F0D0] max-w-xl mx-auto mb-8 leading-relaxed">
            Browse the range, ask questions, or send your order ahead on WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full border-2 border-white/80 text-white font-bold hover:bg-white hover:text-[#2D5016] transition-all text-sm sm:text-base"
            >
              Visit the Store
            </Link>
            <a
              href="https://wa.me/917799549977?text=Hi%20Sri%20Sai%20Natural%20Foods,%20I%20would%20like%20to%20place%20an%20order!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1DAE54] text-white font-bold shadow-lg shadow-green-950/30 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
