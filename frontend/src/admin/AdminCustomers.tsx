import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        const res = await api.getAdminCustomers();
        setCustomers(Array.isArray(res?.customers) ? res.customers : []);
      } catch (err) {
        console.error('Failed to load customers:', err);
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Customer Directory</h1>
        <p className="text-xs text-stone-500 mt-0.5">List of registered supermarket shoppers and purchasing metrics</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4 text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(customers || []).map((c) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs">
                        {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <span className="font-bold text-stone-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-stone-600 font-mono text-[11px]">{c.email}</td>
                  <td className="p-4 text-stone-600 font-mono text-[11px]">{c.phone || '—'}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-100 font-bold text-stone-800">
                      {c.total_orders} orders
                    </span>
                  </td>
                  <td className="p-4 text-right font-black text-stone-950 text-sm">
                    ₹{c.total_spend.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
