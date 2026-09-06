import React, { useState, useEffect } from 'react';
import { Image, Plus } from 'lucide-react';
import { Banner } from '../types';
import { api } from '../services/api';

export const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const res = await api.getBanners();
      setBanners(res.banners);
    } catch (err) {
      console.error('Failed to load banners:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Homepage Banners</h1>
        <p className="text-xs text-stone-500 mt-0.5">Control promotional slides and banners on the storefront</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-44 bg-stone-100 relative">
              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
              {b.badge && (
                <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-md">
                  {b.badge}
                </span>
              )}
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">{b.title}</h3>
                <p className="text-xs text-stone-500 mt-1">{b.subtitle}</p>
                <p className="text-[10px] text-brand-700 font-mono mt-1">Link: {b.link_url}</p>
              </div>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400">Order: {b.display_order}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
