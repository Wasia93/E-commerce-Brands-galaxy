'use client';

import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    in_stock: false,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Filter out empty strings and false values
      const params = {
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        ...(filters.min_price !== '' && { min_price: filters.min_price }),
        ...(filters.max_price !== '' && { max_price: filters.max_price }),
        ...(filters.in_stock && { in_stock: true }),
        ...(searchTerm && { search: searchTerm }),
      };
      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-gold mb-4">Products</h1>
          <p className="text-gray-400">Discover our curated collection of luxury cosmetics and skincare</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-luxury-darkGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
              className="px-4 py-2 bg-luxury-darkGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
            >
              <option value="created_at">Newest</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>

            <select
              value={filters.sort_order}
              onChange={(e) => setFilters({ ...filters, sort_order: e.target.value })}
              className="px-4 py-2 bg-luxury-darkGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-2 bg-luxury-darkGray border border-gold/20 rounded-lg text-white">
              <input
                type="checkbox"
                checked={filters.in_stock}
                onChange={(e) => setFilters({ ...filters, in_stock: e.target.checked })}
                className="accent-gold"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
