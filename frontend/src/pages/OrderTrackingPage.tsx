import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Package, CheckCircle2, Clock, Truck, Home, 
  ArrowLeft, Phone, AlertTriangle, XCircle 
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await api.getOrderDetails(id);
      setOrder(res.order);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be automatically restored.')) {
      return;
    }
    try {
      setIsCancelling(true);
      await api.cancelOrder(id!, 'Cancelled by customer');
      await loadOrder();
      alert('Order cancelled successfully.');
    } catch (err: any) {
      alert(err.message || 'Could not cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 bg-stone-200 rounded w-24" />
        <div className="h-40 bg-stone-200 rounded-3xl" />
        <div className="h-64 bg-stone-200 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Order Not Found</h2>
        <Link to="/orders" className="inline-block px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs">
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2, desc: 'Store received your order' },
    { key: 'packed', label: 'Packed with Care', icon: Package, desc: 'Clean bottles & sealed tins ready' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, desc: 'Rider on the way in Hafeezpet' },
    { key: 'delivered', label: 'Delivered', icon: Home, desc: 'Handed over at doorstep' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'packed': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.order_status);
  const isCancelled = order.order_status === 'cancelled';
  const canCancel = ['pending', 'confirmed'].includes(order.order_status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div>
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order History</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Tracking Order</span>
          <h1 className="text-lg sm:text-2xl font-black text-stone-950 font-mono mt-0.5 break-all">
            {order.order_number}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors text-center"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
          <a
            href="tel:+917799549977"
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>Call Store</span>
          </a>
        </div>
      </div>

      {/* Visual Tracking Progress */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">Delivery Progress</h2>

        {isCancelled ? (
          <div className="p-4 sm:p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Order Cancelled</h3>
              <p className="text-xs text-rose-600 mt-0.5">This order has been cancelled and products have been returned to store stock.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Vertical Connected Stepper (< sm) */}
            <div className="sm:hidden space-y-0 pl-1">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = currentStep >= idx;
                const isCurrent = currentStep === idx;
                const isLast = idx === steps.length - 1;

                return (
                  <div key={step.key} className="flex items-start gap-3 relative pb-6 last:pb-0">
                    {/* Connecting line */}
                    {!isLast && (
                      <div
                        className={`absolute left-5 top-10 bottom-0 w-0.5 ${
                          currentStep > idx ? 'bg-brand-600' : 'bg-stone-200'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                        isCompleted
                          ? 'bg-brand-700 text-white shadow-sm'
                          : 'bg-stone-100 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-brand-100 animate-pulse' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Step Details */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold ${isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Horizontal Stepper (>= sm) */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = currentStep >= idx;
                const isCurrent = currentStep === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-brand-700 text-white shadow-md'
                          : 'bg-stone-100 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-brand-100 animate-pulse' : ''}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className={`text-xs font-bold ${isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-tight">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Assigned Delivery Driver */}
        {order.delivery && (
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0">
                🏍️
              </div>
              <div className="min-w-0">
                <p className="font-bold text-stone-900 truncate">{order.delivery.driver_name}</p>
                <p className="text-stone-500 text-[11px]">Assigned Delivery Partner</p>
              </div>
            </div>
            <a
              href={`tel:${order.delivery.driver_phone}`}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs"
            >
              {order.delivery.driver_phone}
            </a>
          </div>
        )}
      </div>

      {/* Order Items & Shipping Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-stone-900">Ordered Items</h3>
          <div className="space-y-3 text-xs">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-stone-100">
                <div>
                  <p className="font-bold text-stone-900">{item.product_name}</p>
                  <p className="text-stone-400 text-[11px]">₹{item.unit_price} × {item.quantity}</p>
                </div>
                <span className="font-bold text-stone-900">₹{item.total_price}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">₹{order.subtotal}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount:</span>
                <span>-₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-bold">{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
            </div>
            <div className="pt-2 border-t border-stone-100 flex justify-between font-black text-stone-950 text-sm">
              <span>Total Paid/Payable:</span>
              <span className="text-base">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Address & Slot */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-extrabold text-sm text-stone-900">Delivery Information</h3>

          <div className="space-y-2 text-stone-600">
            <div>
              <p className="font-bold text-stone-900">{order.shipping_name || order.customer_name}</p>
              <p className="text-stone-500">{order.shipping_phone || order.customer_phone}</p>
            </div>
            <p>{order.street_address}</p>
            {order.landmark && <p className="text-stone-400">Landmark: {order.landmark}</p>}
            <p className="font-semibold text-stone-800">{order.area}, {order.city} - {order.pincode}</p>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-1">
            <p className="font-bold text-stone-900">Selected Slot:</p>
            <p className="text-brand-800 font-medium">{order.delivery_slot}</p>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-1">
            <p className="font-bold text-stone-900">Payment Method:</p>
            <p className="uppercase font-mono font-bold text-stone-700">{order.payment_method}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
