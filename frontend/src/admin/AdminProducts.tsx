import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Package } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    local_name: '',
    category_id: 1,
    price: 100,
    discount_price: 90,
    stock_quantity: 20,
    unit: '1 Litre Bottle',
    image_url: '/images/sesame-oil-1l.jpeg',
    description: '',
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pRes, cRes] = await Promise.all([
        api.getProducts({}),
        api.getCategories()
      ]);
      setProducts(Array.isArray(pRes?.products) ? pRes.products : []);
      setCategories(Array.isArray(cRes?.categories) ? cRes.categories : []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      local_name: '',
      category_id: categories[0]?.id || 1,
      price: 100,
      discount_price: 90,
      stock_quantity: 20,
      unit: '1 Litre Bottle',
      image_url: '/images/sesame-oil-1l.jpeg',
      description: '',
      is_featured: false,
      is_active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateProduct(editingId, formData);
      } else {
        await api.createProduct(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleQuickStock = async (id: number, delta: number) => {
    try {
      const res = await api.adjustStock(id, delta, 'Quick Admin Adjustment');
      setProducts(products.map(p => p.id === id ? { ...p, stock_quantity: res.newStock } : p));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = (products || []).filter(p =>
    (p?.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
    (p?.local_name && p.local_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-stone-500 mt-0.5">Add, edit, or adjust pricing & stock for Sri Sai Natural Foods</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-48 md:w-64 pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / Discount</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-xl object-contain bg-white border border-stone-100 p-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-stone-900">{p.name}</p>
                        {p.local_name && <p className="text-[11px] text-amber-700">{p.local_name}</p>}
                        <span className="text-[10px] text-stone-400 font-mono">{p.unit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-stone-600 font-medium">
                    {p.category_name || 'Groceries'}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-stone-900">₹{p.discount_price || p.price}</span>
                    {p.discount_price && p.discount_price < p.price && (
                      <span className="text-[10px] text-stone-400 line-through ml-1.5">₹{p.price}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.stock_quantity <= 5 ? 'bg-rose-100 text-rose-800' :
                        p.stock_quantity <= 10 ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock_quantity} units
                      </span>
                      <button
                        onClick={() => handleQuickStock(p.id, 5)}
                        className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-[10px]"
                        title="Add 5 units"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    {p.is_featured ? (
                      <span className="bg-brand-100 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Yes
                      </span>
                    ) : (
                      <span className="text-stone-400 text-[10px]">No</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-base text-stone-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wood-Pressed Mustard Oil"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Telugu / Local Name</label>
                  <input
                    type="text"
                    placeholder="e.g. ఆవ నూనె (Aava Nune)"
                    value={formData.local_name || ''}
                    onChange={(e) => setFormData({ ...formData, local_name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category_id || 1}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={formData.discount_price || 0}
                    onChange={(e) => setFormData({ ...formData, discount_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity || 0}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Litre Tin or 1 kg Pack"
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Health benefits, extraction process, and usage details..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-stone-300 text-brand-700 focus:ring-brand-600"
                  />
                  <span className="font-semibold">Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
