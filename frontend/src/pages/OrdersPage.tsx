import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true);
        const res = await api.getMyOrders();
        setOrders(res?.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Delivered</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 animate-pulse">Out for Delivery</span>;
      case 'packed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">Packed</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Confirmed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">Pending</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-8 bg-stone-200 rounded w-48 mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-stone-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">My Orders</h1>
        <p className="text-xs text-stone-500 mt-1">Review your purchase history and track active deliveries</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-base text-stone-900">No orders placed yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You haven't placed any orders with Sri Sai Natural Foods yet. Browse our wood-pressed oils and organic groceries.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <span className="font-mono font-bold text-xs text-stone-900">{order.order_number}</span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.order_status)}
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-brand-700 transition-colors" />
                </div>
              </div>

              {/* Items summary */}
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-stone-600">
                  <p className="font-medium">
                    {order.items && order.items.length > 0
                      ? order.items.map(i => `${i.product_name} × ${i.quantity}`).join(', ')
                      : 'Grocery Items'}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Slot: {order.delivery_slot}</p>
                </div>

                <div className="sm:text-right">
                  <span className="text-sm font-extrabold text-stone-950">₹{order.total_amount}</span>
                  <p className="text-[10px] text-stone-400 uppercase">{order.payment_method}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
