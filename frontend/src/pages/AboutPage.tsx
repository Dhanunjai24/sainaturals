import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, ArrowRight, Star } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <header className="bg-brand-950 text-white py-16 px-4 text-center space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="/images/hero-bg.jpg" alt="About Sri Sai Natural Foods" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Our Story</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            A neighbourhood store<br />for natural living
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg mx-auto">
            Sri Sai Natural Foods — built around one simple idea: natural food, prepared and sold the traditional way in Hafeezpet, Hyderabad.
          </p>
        </div>
      </header>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
            <img
              src="/images/store.jpg"
              alt="Sri Sai Natural Foods store in Hafeezpet"
              className="w-full h-full object-cover aspect-[4/3]"
            />
          </div>

          <div className="space-y-5">
            <span className="text-xs font-bold uppercase text-brand-700 tracking-wider">Who We Are</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              More than a general store
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Sri Sai Natural Foods is a neighborhood organic grocer on Kaman Main Road in Hafeezpet, Hyderabad. Our shelves carry a wide variety of wood-pressed and cold-pressed oils, fresh pulses and dals, Vedic cow ghee, and raw natural items.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              What customers notice most is our care: yellow and black mustard oil pressed on clean wooden kolhu machines right in front of them, and staff who take the time to explain the health benefits of every product at honest, reasonable prices.
            </p>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <h4 className="font-bold text-sm text-stone-900">4.9 / 5 on Google Reviews</h4>
                <p className="text-[11px] text-stone-500">From 47 verified local families in Hafeezpet</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wood-Pressed Oil Specialty */}
      <section className="bg-amber-50/50 py-16 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-amber-700 tracking-wider">Traditional Method</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Wood-pressed oils, pressed fresh
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Our wooden oil press machine is at the heart of what we do. Customers can come in and watch their 5-litre tin of mustard, groundnut, or sesame oil pressed live — on clean, well-maintained wooden machines.
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                This traditional kachi ghani method uses no heat or chemical solvents, which means the oil retains its natural omega-3 fatty acids, vitamins, aroma, and pungency.
              </p>
              <div className="pt-2">
                <Link
                  to="/products?category=wood-pressed-oils"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <span>Explore Our Oils</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl border border-amber-200">
              <img
                src="/images/sesame-oil-shelf-1l.jpeg"
                alt="Wood-pressed oil bottles fresh at Sri Sai Natural Foods Hafeezpet store"
                className="w-full h-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase text-brand-700 tracking-wider">What We Stand For</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Our Core Promises</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2.5">
            <span className="text-2xl">🌿</span>
            <h3 className="font-bold text-sm text-stone-900">Purity Above All</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Zero chemicals, artificial bleaches, or mineral oil mixing. Everything is 100% natural and food-grade.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2.5">
            <span className="text-2xl">🪵</span>
            <h3 className="font-bold text-sm text-stone-900">Authentic Cold-Pressing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We extract oil at low RPM to ensure the temperature never rises, locking in natural nutrients.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2.5">
            <span className="text-2xl">💰</span>
            <h3 className="font-bold text-sm text-stone-900">Honest Fair Pricing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Direct from our machines and farmer collectives, giving you wholesale quality without middleman markups.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
