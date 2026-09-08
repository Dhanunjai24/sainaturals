import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, ShoppingBag, Users, AlertTriangle, 
  ArrowUpRight, Package, Clock, ChevronRight 
} from 'lucide-react';
import { AdminStats } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const data = await api.getAdminDashboard();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-stone-200 rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-stone-200 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Revenue',
      value: `₹${(Number(stats?.totalRevenue) || 0).toLocaleString('en-IN')}`,
      sub: 'Excluding cancellations',
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      sub: 'All-time grocery orders',
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      label: 'Registered Customers',
      value: stats?.totalCustomers ?? 0,
      sub: 'Local retail shoppers',
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      label: 'Low Stock Alerts',
      value: stats?.lowStockCount ?? 0,
      sub: 'Items with ≤ 10 units',
      icon: AlertTriangle,
      color: (stats?.lowStockCount || 0) > 0 ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' : 'bg-stone-50 text-stone-700 border-stone-200'
    },
  ];

  const recentOrders = Array.isArray(stats?.recentOrders) ? stats.recentOrders : [];
  const topProducts = Array.isArray(stats?.topProducts) ? stats.topProducts : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Supermarket Operations Dashboard</h1>
        <p className="text-xs text-stone-500 mt-0.5">Overview of Sri Sai Natural Foods sales, orders, and stock levels</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-3xl border ${kpi.color} bg-white shadow-sm flex items-center justify-between`}
            >
              <div>
                <p className="text-xs font-bold text-stone-500">{kpi.label}</p>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">{kpi.value}</h3>
                <p className="text-[10px] text-stone-400 mt-0.5">{kpi.sub}</p>
              </div>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${kpi.color}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-stone-900">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-brand-700 hover:text-brand-800">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Order No.</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-stone-400">No recent orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50">
                      <td className="py-3 font-mono font-bold text-stone-900">{o.order_number}</td>
                      <td className="py-3 text-stone-700 font-medium">{o.customer_name || 'Customer'}</td>
                      <td className="py-3 font-bold text-stone-950">₹{o.total_amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          o.order_status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {o.order_status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-stone-400">
                        {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-stone-900">Top Selling Products</h3>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs text-stone-400 py-4 text-center">No sales data available yet.</p>
            ) : (
              topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-1.5 border-b border-stone-100 last:border-0 text-xs">
                  <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-xl object-contain bg-white border border-stone-100 p-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-stone-400">₹{p.discount_price || p.price} · Stock: {p.stock_quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-brand-800">{p.total_sold}</span>
                    <span className="text-[10px] text-stone-400 block">sold</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
