import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const StoreStatusBadge: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkOpen = () => {
      // Store opens 8:00 AM and closes 9:30 PM (21:30) IST
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const totalMinutes = currentHours * 60 + currentMinutes;

      const openMinutes = 8 * 60; // 8:00 AM
      const closeMinutes = 21 * 60 + 30; // 9:30 PM

      setIsOpen(totalMinutes >= openMinutes && totalMinutes <= closeMinutes);
    };
    checkOpen();
    const interval = setInterval(checkOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        {isOpen ? 'Open Now' : 'Closed'}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
      isOpen 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
        : 'bg-stone-100 border-stone-300 text-stone-700'
    }`}>
      <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
      <span className="font-semibold">{isOpen ? 'Open Today' : 'Closed Now'}</span>
      <span className="text-stone-500 text-[11px]">·</span>
      <span className="text-stone-600 text-[11px]">{isOpen ? 'Closes 9:30 PM' : 'Opens tomorrow 8:00 AM'}</span>
    </div>
  );
};
