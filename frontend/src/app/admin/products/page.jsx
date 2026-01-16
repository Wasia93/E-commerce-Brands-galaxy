'use client';

import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    brand: '',
    category_id: '',
    price: '',
    discount_price: '',
    stock_quantity: '',
    images: '',
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        categoriesAPI.getAll()
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        brand: product.brand || '',
        category_id: product.category_id || '',
        price: product.price,
        discount_price: product.discount_price || '',
        stock_quantity: product.stock_quantity,
        images: product.images?.join(', ') || '',
        is_featured: product.is_featured,
        is_active: product.is_active
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        brand: '',
        category_id: '',
        price: '',
        discount_price: '',
        stock_quantity: '',
        images: '',
        is_featured: false,
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: editingProduct ? formData.slug : generateSlug(name)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      stock_quantity: parseInt(formData.stock_quantity),
      images: formData.images.split(',').map(url => url.trim()).filter(Boolean),
      category_id: formData.category_id || null
    };

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(productData);
        toast.success('Product created successfully');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.delete(productId);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gold">Products</h1>
          <p className="text-gray-400 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold-light transition-colors"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

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

      {/* Products Table */}
      <div className="bg-luxury-darkGray rounded-lg overflow-hidden border border-gold/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-luxury-lightGray">
              <tr>
                <th className="px-6 py-3 text-left text-gold">Image</th>
                <th className="px-6 py-3 text-left text-gold">Name</th>
                <th className="px-6 py-3 text-left text-gold">Brand</th>
                <th className="px-6 py-3 text-left text-gold">Price</th>
                <th className="px-6 py-3 text-left text-gold">Stock</th>
                <th className="px-6 py-3 text-left text-gold">Status</th>
                <th className="px-6 py-3 text-left text-gold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-gold/10">
                  <td className="px-6 py-4">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/48'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      {product.is_featured && (
                        <span className="text-xs text-gold">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{product.brand}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white">${product.price}</p>
                      {product.discount_price && (
                        <p className="text-sm text-green-500">${product.discount_price}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${product.stock_quantity < 10 ? 'text-red-500' : 'text-white'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-gold hover:text-gold-light"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No products found
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-luxury-darkGray rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gold/20">
              <h2 className="text-xl font-semibold text-gold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="w-full px-4 py-2 bg-luxury-lightGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="accent-gold"
                  />
                  Featured Product
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="accent-gold"
                  />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gold/20 text-gray-300 rounded-lg hover:bg-luxury-lightGray transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold text-black rounded-lg hover:bg-gold-light transition-colors"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
