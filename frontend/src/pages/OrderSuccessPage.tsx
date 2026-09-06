import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Order Placed Successfully! 🌿
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Thank you for ordering with Sri Sai Natural Foods. We are preparing your fresh natural groceries.
        </p>
      </div>

      {order && (
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm text-xs text-left space-y-3">
          <div className="flex justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">Order Number:</span>
            <span className="font-mono font-bold text-brand-800">{order.order_number}</span>
          </div>
          <div className="flex justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">Delivery Slot:</span>
            <span className="font-semibold text-stone-800">{order.delivery_slot}</span>
          </div>
          <div className="flex justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-500">Payment:</span>
            <span className="font-semibold text-stone-800 uppercase">{order.payment_method}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold">
            <span className="text-stone-900">Total Amount:</span>
            <span className="text-brand-900 font-extrabold">₹{order.total_amount}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to={`/orders/${id}`}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Track My Order</span>
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="pt-4 text-xs text-stone-500 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <a href="tel:+917799549977" className="flex items-center gap-1 hover:text-stone-800">
          <Phone className="w-3.5 h-3.5 text-amber-500" />
          <span>Call 077995 49977</span>
        </a>
        <span className="hidden xs:inline">·</span>
        <a href="https://wa.me/917799549977" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-700 font-bold">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Store</span>
        </a>
      </div>
    </div>
  );
};
