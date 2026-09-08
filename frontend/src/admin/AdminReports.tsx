import React, { useState, useEffect } from 'react';
import { BarChart3, IndianRupee, ShoppingBag, CreditCard, Banknote } from 'lucide-react';
import { api } from '../services/api';

export const AdminReports: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        setIsLoading(true);
        const res = await api.getAdminSalesReport();
        setReport(res);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, []);

  if (isLoading || !report) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-stone-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-stone-200 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Financial & Sales Analytics</h1>
        <p className="text-xs text-stone-500 mt-0.5">Revenue breakdown, order value, and payment method comparison</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-500">Gross Sales Revenue</span>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-700">₹{(Number(report?.totalRevenue) || 0).toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-stone-400">Total fulfilled grocery volume</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-500">Average Order Value (AOV)</span>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900">₹{report?.averageOrderValue ?? 0}</h3>
          <p className="text-[11px] text-stone-400">Across {report?.totalOrders ?? 0} total completed orders</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-500">Payment Breakdown</span>
          <div className="flex items-center gap-4 pt-1">
            <div>
              <span className="text-xs text-purple-700 font-bold block">UPI / QR</span>
              <span className="text-sm font-black text-stone-900">₹{report?.paymentSplit?.upi ?? 0}</span>
            </div>
            <div className="border-l border-stone-200 pl-4">
              <span className="text-xs text-amber-700 font-bold block">Cash on Delivery</span>
              <span className="text-sm font-black text-stone-900">₹{report?.paymentSplit?.cod ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Sales Table */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-stone-900">Daily Revenue Timeline</h3>
        {Array.isArray(report?.dailySales) && report.dailySales.length > 0 ? (
          <div className="space-y-2">
            {report.dailySales.map((item: any) => (
              <div key={item.date} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 text-xs">
                <span className="font-bold text-stone-800">{item.date}</span>
                <span className="font-black text-emerald-800">₹{(Number(item.amount) || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 text-center py-6">No historical sales data recorded yet.</p>
        )}
      </div>
    </div>
  );
};
