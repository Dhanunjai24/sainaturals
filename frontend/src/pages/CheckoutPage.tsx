import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, CreditCard, QrCode, Banknote, ShieldCheck, 
  Plus, Check, ArrowRight, AlertCircle, Sparkles 
} from 'lucide-react';
import { Address } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GpsLocationButton } from '../components/common/GpsLocationButton';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, deliveryFee, discountAmount, totalAmount, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [deliverySlot, setDeliverySlot] = useState('Morning (8:00 AM - 11:00 AM)');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('upi');
  const [notes, setNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState('');

  // New address modal / in-place form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('Hafeezpet');
  const [pincode, setPincode] = useState('500085');
  const [addressType, setAddressType] = useState('Home');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await api.getAddresses();
      setAddresses(res.addresses);
      const defaultAddr = res.addresses.find(a => a.is_default) || res.addresses[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else setShowAddressForm(true);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.addAddress({
        full_name: fullName,
        phone,
        street_address: streetAddress,
        landmark,
        area,
        city: 'Hyderabad',
        state: 'Telangana',
        pincode,
        address_type: addressType,
        is_default: true
      });
      setAddresses([res.address, ...addresses]);
      setSelectedAddressId(res.address.id);
      setShowAddressForm(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save address.');
    }
  };

  const handleGpsFound = (loc: {
    streetAddress: string;
    landmark?: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    if (loc.streetAddress) setStreetAddress(loc.streetAddress);
    if (loc.landmark) setLandmark(loc.landmark);
    if (loc.area) setArea(loc.area);
    if (loc.pincode) setPincode(loc.pincode);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }
    setError('');
    setIsPlacing(true);

    try {
      const res = await api.checkout({
        addressId: selectedAddressId,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        deliverySlot,
        notes
      });
      await clearCart();
      navigate(`/order-success/${res.order.id}`, { state: { order: res.order } });
    } catch (err: any) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setIsPlacing(false);
    }
  };

  // Generate UPI payment string for PhonePe / Google Pay / Paytm QR code
  const upiVpa = '7799549977@ybl';
  const upiPayLink = `upi://pay?pa=${upiVpa}&pn=Sri%20Sai%20Natural%20Foods&am=${totalAmount}&cu=INR&tn=Grocery%20Order`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiPayLink)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-stone-500 mt-1">Review delivery address, schedule time slot, and confirm payment</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-800 text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Address, Slot, Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. DELIVERY ADDRESS */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-700 flex-shrink-0" />
                <span>1. Select Delivery Address</span>
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddressForm ? 'Cancel' : 'Add New'}</span>
              </button>
            </div>

            {/* Address List */}
            {!showAddressForm && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-xs font-bold text-stone-900 truncate">{addr.full_name}</span>
                      <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded flex-shrink-0">
                        {addr.address_type}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-snug break-words">{addr.street_address}</p>
                    {addr.landmark && <p className="text-[11px] text-stone-400 truncate">Landmark: {addr.landmark}</p>}
                    <p className="text-xs text-stone-700 font-medium mt-1">{addr.area}, Hyderabad - {addr.pincode}</p>
                    <p className="text-[11px] text-stone-500 mt-1">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Address Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="bg-stone-50 p-3.5 sm:p-4 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-800">Add New Delivery Address</h3>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                    GPS Auto-Fill Available
                  </span>
                </div>

                {/* GPS Auto-Fill Button */}
                <GpsLocationButton onLocationFound={handleGpsFound} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Flat / House / Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 302, Sri Sai Enclave, Kaman Main Road"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Gopal Nagar"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Area / Colony</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hafeezpet"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      placeholder="500085"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs shadow-sm hover:bg-brand-800"
                  >
                    Save & Use Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. DELIVERY TIME SLOT */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-700 flex-shrink-0" />
              <span>2. Delivery Time Slot</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { slot: 'Morning (8:00 AM - 11:00 AM)', desc: 'Fast morning breakfast delivery' },
                { slot: 'Afternoon (1:00 PM - 4:00 PM)', desc: 'Midday standard slot' },
                { slot: 'Evening (6:00 PM - 9:00 PM)', desc: 'Post-work evening slot' },
              ].map(({ slot, desc }) => (
                <div
                  key={slot}
                  onClick={() => setDeliverySlot(slot)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    deliverySlot === slot
                      ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-xs font-bold text-stone-900">{slot}</span>
                  <span className="text-[11px] text-stone-500">{desc}</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Please call on arrival or leave with security"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          {/* 3. PAYMENT METHOD */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-700 flex-shrink-0" />
              <span>3. Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-stone-900 truncate sm:whitespace-normal">
                        Pay via UPI (PhonePe / Google Pay / Paytm)
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        Scan QR Code or pay directly to store UPI ID
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 sm:py-1 rounded-full self-start sm:self-auto flex-shrink-0">
                    Recommended
                  </span>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-4 pt-4 border-t border-brand-200/60 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <img
                      src={qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-white p-2 border border-stone-200 shadow-sm flex-shrink-0"
                    />
                    <div className="space-y-1 text-center sm:text-left text-xs min-w-0">
                      <p className="font-bold text-stone-900">Scan & Pay ₹{totalAmount}</p>
                      <p className="text-stone-500 break-all">UPI ID: <span className="font-mono font-bold text-stone-800">{upiVpa}</span></p>
                      <p className="text-[11px] text-stone-400">Pay using any UPI app. Our team will verify and dispatch!</p>
                      <a
                        href={upiPayLink}
                        className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors"
                      >
                        Open UPI App
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Cash On Delivery Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-stone-900">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-stone-500 block">Pay cash or UPI to delivery agent at your doorstep</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Button */}
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base text-stone-900">Order Summary</h3>

            {/* Items Mini List */}
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1 text-xs">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 py-1 border-b border-stone-100">
                  <div className="truncate">
                    <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-stone-400">{item.unit} × {item.quantity}</p>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{(Number(item.discount_price || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing details */}
            <div className="space-y-2 text-xs text-stone-600 pt-2">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-stone-900">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? <span className="text-emerald-700 uppercase text-[11px]">Free</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-stone-900">Final Total</span>
                <span className="text-2xl font-black text-stone-950">₹{totalAmount}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing || !selectedAddressId}
              className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-sm shadow-lg shadow-brand-700/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isPlacing ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <span>Confirm & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure Local Supermarket Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
