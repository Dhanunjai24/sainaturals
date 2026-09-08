import React, { useState, useEffect } from 'react';
import { Warehouse, AlertTriangle, CheckCircle2, ArrowUpDown, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [filterLow, setFilterLow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, [filterLow]);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminInventory(filterLow);
      setInventory(Array.isArray(res?.inventory) ? res.inventory : []);
      setLowStockCount(typeof res?.lowStockCount === 'number' ? res.lowStockCount : 0);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      setInventory([]);
      setLowStockCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockChange = async (id: number, delta: number) => {
    try {
      const res = await api.adjustStock(id, delta, 'Inventory Replenishment');
      setInventory(inventory.map(p => p.id === id ? { ...p, stock_quantity: res.newStock } : p));
    } catch (err: any) {
      alert(err.message || 'Failed to update stock.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Store Stock & Inventory</h1>
          <p className="text-xs text-stone-500 mt-0.5">Real-time inventory levels and reorder warnings</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterLow(!filterLow)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              filterLow
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Show Low Stock Only ({lowStockCount})</span>
          </button>
        </div>
      </div>

      {/* Stock Cards / Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Packaging</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="p-4 font-bold text-stone-900">
                    <div className="flex items-center gap-3">
                      <img src={item.image_url} alt={item.name} className="w-9 h-9 rounded-xl object-contain bg-white border border-stone-100 p-0.5" />
                      <div>
                        <span>{item.name}</span>
                        {item.local_name && <p className="text-[10px] text-amber-700 font-normal">{item.local_name}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-stone-600 font-medium">{item.category_name}</td>
                  <td className="p-4 font-mono text-stone-500">{item.unit}</td>
                  <td className="p-4 font-black text-sm text-stone-900">{item.stock_quantity}</td>
                  <td className="p-4">
                    {item.stock_quantity <= 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Out of Stock
                      </span>
                    ) : item.stock_quantity <= 10 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                        Low Stock Alert
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Well Stocked
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleStockChange(item.id, -1)}
                        className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
                        title="Deduct 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStockChange(item.id, 5)}
                        className="px-2 py-1 rounded bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold text-[10px]"
                        title="Add 5"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleStockChange(item.id, 10)}
                        className="px-2 py-1 rounded bg-brand-700 hover:bg-brand-800 text-white font-bold text-[10px]"
                        title="Add 10"
                      >
                        +10
                      </button>
                    </div>
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
