import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state from URL query
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const sortParam = searchParams.get('sort') || '';
  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({
            category: categoryParam,
            search: searchParam,
            inStock: inStockParam,
            sort: sortParam
          }),
          api.getCategories()
        ]);
        setProducts(prodRes?.products || []);
        setCategories(catRes?.categories || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [categoryParam, searchParam, inStockParam, sortParam]);

  const updateFilter = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', searchInput.trim() || null);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const activeCategory = categories.find(c => c.slug === categoryParam);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {activeCategory ? activeCategory.name : 'All Natural Products'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {activeCategory && activeCategory.local_name ? `${activeCategory.local_name} · ` : ''}
            Showing {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600 shadow-sm"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); updateFilter('search', null); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <select
            value={sortParam}
            onChange={(e) => updateFilter('sort', e.target.value || null)}
            className="w-full sm:w-auto px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-600 shadow-sm"
          >
            <option value="">Sort: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => updateFilter('category', null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
            !categoryParam
              ? 'bg-brand-700 text-white shadow-sm'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateFilter('category', cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              categoryParam === cat.slug
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* In Stock & Reset Filter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50">
            <input
              type="checkbox"
              checked={inStockParam}
              onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
              className="rounded border-stone-300 text-brand-700 focus:ring-brand-600 w-3.5 h-3.5"
            />
            <span className="font-semibold">In-Stock Only</span>
          </label>

          {(categoryParam || searchParam || inStockParam || sortParam) && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold px-2 py-1 rounded hover:bg-rose-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200 space-y-3 animate-pulse">
              <div className="aspect-square bg-stone-200 rounded-xl" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
              <div className="h-8 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3 max-w-md mx-auto my-12">
          <span className="text-4xl">🔍</span>
          <h3 className="font-bold text-lg text-stone-900">No products found</h3>
          <p className="text-xs text-stone-500">
            We couldn't find any items matching your selected criteria. Try adjusting your filters or search keywords.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-2 px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs shadow-sm hover:bg-brand-800 transition-colors"
          >
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
};
