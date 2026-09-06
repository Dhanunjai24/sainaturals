import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, MessageCircle, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="font-extrabold text-lg text-white tracking-tight">Sri Sai Natural Foods</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Your neighbourhood store in Hafeezpet, Hyderabad, specializing in traditional cold & wood-pressed edible oils, A2 bilona ghee, and pesticide-free organic groceries.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>4.9 / 5 Rating on Google Reviews</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Our Specialties</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=wood-pressed-oils" className="hover:text-amber-400 transition-colors">
                  Wood-Pressed Mustard Oil (Kachi Ghani)
                </Link>
              </li>
              <li>
                <Link to="/products?category=wood-pressed-oils" className="hover:text-amber-400 transition-colors">
                  Wood-Pressed Groundnut & Sesame Oils
                </Link>
              </li>
              <li>
                <Link to="/products?category=desi-ghee" className="hover:text-amber-400 transition-colors">
                  A2 Vedic Gir Cow Bilona Ghee
                </Link>
              </li>
              <li>
                <Link to="/products?category=organic-pulses" className="hover:text-amber-400 transition-colors">
                  Unpolished Toor, Moong & Chana Dals
                </Link>
              </li>
              <li>
                <Link to="/products?category=raw-honey-jaggery" className="hover:text-amber-400 transition-colors">
                  Wild Forest Raw Honey & Natu Bellam
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Hours & Delivery */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Store Timings</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Monday to Sunday</p>
                  <p className="text-stone-400">8:00 AM – 9:30 PM (Everyday)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Live Oil Pressing</p>
                  <p className="text-stone-400">Watch fresh mustard oil pressed right in front of you</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Map */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Visit Our Store</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-stone-300">
                  Plot 718, Kaman Main Road, beside Gopal Nagar, Shilpa Avenue Colony, Hafeezpet, Hyderabad 500085
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <a href="tel:+917799549977" className="text-white hover:text-amber-300 font-mono font-bold">
                  077995 49977
                </a>
              </div>
              <a
                href="https://wa.me/917799549977"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Sri Sai Natural Foods. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/products" className="hover:text-stone-300">Catalog</Link>
            <Link to="/offers" className="hover:text-stone-300">Coupons</Link>
            <Link to="/admin" className="hover:text-amber-400">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
