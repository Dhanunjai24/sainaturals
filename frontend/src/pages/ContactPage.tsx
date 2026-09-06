import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle, Send, Check } from 'lucide-react';
import { StoreStatusBadge } from '../components/common/StoreStatusBadge';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Hi Sri Sai Natural Foods! 🌿\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`);
    window.open(`https://wa.me/917799549977?text=${text}`, '_blank');
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase text-brand-700 tracking-wider">Get in Touch</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Visit Us in Hafeezpet, Hyderabad
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Walk in to watch fresh oil pressing or send us your grocery requirements on WhatsApp
        </p>
        <div className="pt-2 flex justify-center">
          <StoreStatusBadge />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact Info Cards & Map */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone & WhatsApp */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Phone & Orders</h3>
              <a href="tel:+917799549977" className="block text-xs font-mono font-bold text-brand-800 hover:underline">
                077995 49977
              </a>
              <p className="text-[11px] text-stone-400">Call anytime during store hours</p>
            </div>

            {/* Timings */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Opening Hours</h3>
              <p className="text-xs font-bold text-stone-800">8:00 AM – 9:30 PM</p>
              <p className="text-[11px] text-emerald-700 font-semibold">Open Every Day (Mon - Sun)</p>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Store Address</h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  Sri Sai Natural Foods, Plot number: 718, Kaman Main Road, beside Gopal Nagar, Shilpa Avenue Colony, Hafeezpet, Hyderabad, Telangana 500085
                </p>
                <a
                  href="https://maps.google.com/?q=Sri+Sai+Natural+Foods+Hafeezpet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline mt-2"
                >
                  <span>Open Directions in Google Maps →</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-sm h-64 bg-stone-100">
            <iframe
              src="https://maps.google.com/maps?q=Sri+Sai+Natural+Foods,+Plot+number:+718,+kaman+Main+road,+beside+Gopal+Nagar,+Gopal+Nagar,+Shilpa+Avenue+Colony,+Hafeezpet,+Hyderabad,+Telangana+500085&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="Store Location"
            />
          </div>
        </div>

        {/* Send Inquiry Form */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Send an Inquiry or Bulk Order</h3>
            <p className="text-xs text-stone-500 mt-1">
              Have questions about fresh mustard oil tin batches, A2 ghee, or bulk monthly groceries? Send a direct message!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Message / Items Required</label>
              <textarea
                rows={4}
                required
                placeholder="e.g. I would like to inquire about 5L mustard oil pressing and 1L A2 cow ghee..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Send Message to Store WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
