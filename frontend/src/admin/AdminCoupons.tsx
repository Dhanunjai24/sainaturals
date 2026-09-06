import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check } from 'lucide-react';
import { Coupon } from '../types';
import { api } from '../services/api';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await api.getCoupons(true);
      setCoupons(res.coupons);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Coupon & Promotions Management</h1>
        <p className="text-xs text-stone-500 mt-0.5">Control discounts and active promotional codes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-brand-900">{c.code}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                {c.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-stone-600">{c.description}</p>
            <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex justify-between">
              <span>Type: {c.discount_type} ({c.discount_value})</span>
              <span>Min Spend: ₹{c.min_order_amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
