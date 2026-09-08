import React, { useState, useEffect } from 'react';
import { Search, Package, Phone, CheckCircle, Clock, AlertTriangle, Eye, X } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminOrders({ status: statusFilter, search });
      setOrders(Array.isArray(res?.orders) ? res.orders : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (newStatus === 'cancelled') {
      if (!window.confirm('Cancelling this order will restore all product quantities to stock. Proceed?')) {
        return;
      }
    }
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, order_status: newStatus as any });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    }
  };

  const filteredOrders = (orders || []).filter(o =>
    (o?.order_number && o.order_number.toLowerCase().includes(search.toLowerCase())) ||
    (o?.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())) ||
    (o?.customer_phone && o.customer_phone.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Order Fulfillment & Delivery</h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage incoming grocery orders and update delivery stages</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search order no, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs w-full sm:w-60 flex-1 sm:flex-initial focus:outline-none focus:ring-2 focus:ring-brand-600"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-700"
          >
            <option value="all">All Orders</option>
            <option value="confirmed">Confirmed</option>
            <option value="packed">Packed</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Order No & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total & Pay Method</th>
                <th className="p-4">Status & Action</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50">
                  <td className="p-4">
                    <span className="font-mono font-bold text-stone-900">{o.order_number}</span>
                    <p className="text-[11px] text-stone-400">
                      {new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-stone-900">{o.customer_name}</p>
                    <p className="text-stone-500 text-[11px]">{o.customer_phone}</p>
                    <p className="text-[10px] text-stone-400 truncate max-w-[160px]">{o.area}, Hyderabad</p>
                  </td>
                  <td className="p-4 text-stone-600 max-w-[200px]">
                    <p className="truncate font-medium">
                      {o.items?.map(i => `${i.product_name} (${i.quantity})`).join(', ') || 'Grocery items'}
                    </p>
                    <span className="text-[10px] text-brand-800 font-semibold">{o.delivery_slot}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-stone-950 text-sm">₹{o.total_amount}</span>
                    <span className="text-[10px] text-stone-400 block uppercase">{o.payment_method}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={o.order_status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        o.order_status === 'delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                        o.order_status === 'cancelled' ? 'bg-rose-50 border-rose-300 text-rose-800' :
                        o.order_status === 'out_for_delivery' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                        'bg-amber-50 border-amber-300 text-amber-800'
                      }`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled (Restore Stock)</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                      title="View Invoice & Items"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 font-mono">{selectedOrder.order_number}</h3>
                <p className="text-xs text-stone-400">Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl space-y-1">
                <p className="font-bold text-stone-900">Customer Details:</p>
                <p>{selectedOrder.customer_name} · {selectedOrder.customer_phone}</p>
                <p>{selectedOrder.street_address}</p>
                <p>{selectedOrder.area}, {selectedOrder.city} - {selectedOrder.pincode}</p>
                {selectedOrder.notes && <p className="text-amber-800 font-medium">Notes: {selectedOrder.notes}</p>}
              </div>

              <div>
                <h4 className="font-bold text-stone-800 mb-2">Order Items:</h4>
                <div className="space-y-2 divide-y divide-stone-100">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="pt-2 flex justify-between">
                      <div>
                        <p className="font-semibold text-stone-900">{item.product_name}</p>
                        <p className="text-[11px] text-stone-400">Qty: {item.quantity} × ₹{item.unit_price}</p>
                      </div>
                      <span className="font-bold text-stone-900">₹{item.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-stone-900">₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-bold">{selectedOrder.delivery_fee === 0 ? 'FREE' : `₹${selectedOrder.delivery_fee}`}</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between font-black text-stone-950 text-sm">
                  <span>Total Amount:</span>
                  <span>₹{selectedOrder.total_amount}</span>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href={`tel:${selectedOrder.customer_phone}`}
                  className="w-full py-2.5 rounded-xl bg-brand-700 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Customer</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
