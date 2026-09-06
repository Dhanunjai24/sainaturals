import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Plus, Trash2, ShieldCheck, LogOut } from 'lucide-react';
import { Address } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GpsLocationButton } from '../components/common/GpsLocationButton';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);

  // New address form
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('Hafeezpet');
  const [pincode, setPincode] = useState('500085');
  const [addressType, setAddressType] = useState('Home');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    try {
      const res = await api.getAddresses();
      setAddresses(res.addresses);
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
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
        is_default: addresses.length === 0
      });
      setAddresses([res.address, ...addresses]);
      setShowForm(false);
      setStreetAddress('');
      setLandmark('');
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

  const handleDeleteAddress = async (id: number) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Account & Addresses</h1>
        <p className="text-xs text-stone-500 mt-1">Manage personal contact details and saved delivery locations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-800 font-black text-2xl flex items-center justify-center mx-auto">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-base text-stone-900">{user?.name}</h3>
            <p className="text-xs text-stone-500 truncate">{user?.email}</p>
            {user?.phone && <p className="text-xs text-stone-600 font-mono">{user?.phone}</p>}
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
              {user?.role}
            </span>
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
            <Link to="/orders" className="block w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-center">
              View Order History
            </Link>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-center flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Address Book */}
        <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-700 flex-shrink-0" />
              <span>Saved Delivery Addresses</span>
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showForm ? 'Cancel' : 'Add New'}</span>
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAddAddress} className="bg-stone-50 p-3.5 sm:p-4 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-800">Add New Address</h4>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  GPS Auto-Fill Available
                </span>
              </div>

              {/* GPS Auto-Fill Button */}
              <GpsLocationButton onLocationFound={handleGpsFound} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                />
              </div>
              <input
                type="text"
                placeholder="Street Address / Flat No"
                required
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Area"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-700 text-white font-bold"
              >
                Save Address
              </button>
            </form>
          )}

          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-3.5 sm:p-4 rounded-2xl border border-stone-200 flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 truncate">{addr.full_name}</span>
                    <span className="text-[10px] font-bold uppercase bg-stone-100 px-2 py-0.5 rounded text-stone-600 flex-shrink-0">
                      {addr.address_type}
                    </span>
                  </div>
                  <p className="text-stone-600 mt-1 break-words">{addr.street_address}</p>
                  <p className="text-stone-700 font-medium">{addr.area}, {addr.city} - {addr.pincode}</p>
                  <p className="text-stone-500 mt-0.5">Phone: {addr.phone}</p>
                </div>

                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
