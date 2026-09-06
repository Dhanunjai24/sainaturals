import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check, Sparkles, Percent } from 'lucide-react';
import { Coupon } from '../types';
import { api } from '../services/api';

export const OffersPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await api.getCoupons();
        setCoupons(res.coupons);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      }
    }
    loadCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
          <span>🏷️ Store Offers & Discount Coupons</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Apply these verified discount codes at checkout to save on your natural groceries
        </p>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-dashed border-amber-300 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  {coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>

              <div className="font-mono font-black text-xl text-stone-950 tracking-wider">
                {coupon.code}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {coupon.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Min spend: ₹{coupon.min_order_amount}
              </span>
              <button
                onClick={() => handleCopy(coupon.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  copiedCode === coupon.code
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Combo Packs Callout */}
      <div className="bg-gradient-to-r from-brand-900 to-emerald-950 rounded-3xl p-5 sm:p-8 text-white space-y-3 shadow-xl">
        <span className="bg-amber-500 text-stone-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
          Super Saver Combos
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight">Monthly Family Kitchen Oil Saver</h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
          Need regular monthly deliveries of 5L wood-pressed groundnut oil, 2L mustard oil, and 1L A2 bilona cow ghee?
          Call our store manager directly to set up scheduled monthly dispatch with extra 10% wholesale discount!
        </p>
        <div className="pt-2">
          <a
            href="tel:+917799549977"
            className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-md transition-colors"
          >
            Call Store: 077995 49977
          </a>
        </div>
      </div>
    </div>
  );
};
