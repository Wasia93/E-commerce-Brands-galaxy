'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, lowStockRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getLowStock(10)
      ]);
      setStats(dashboardRes.data.stats);
      setLowStock(lowStockRes.data.products || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 14,
        totalUsers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
      icon: DollarSign,
      color: 'bg-green-500/20 text-green-500'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500/20 text-blue-500'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-500/20 text-purple-500'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-gold/20 text-gold'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-luxury-darkGray rounded-lg p-6 border border-gold/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-luxury-darkGray rounded-lg border border-gold/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-gold/20 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            <h2 className="text-xl font-semibold text-gold">Low Stock Alert</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-luxury-lightGray rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.brand}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm">
                    {product.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-luxury-darkGray rounded-lg border border-gold/20 p-6">
        <h2 className="text-xl font-semibold text-gold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="flex items-center gap-3 p-4 bg-luxury-lightGray rounded-lg hover:bg-gold/10 transition-colors"
          >
            <Package className="text-gold" size={20} />
            <span className="text-white">Manage Products</span>
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-3 p-4 bg-luxury-lightGray rounded-lg hover:bg-gold/10 transition-colors"
          >
            <ShoppingCart className="text-gold" size={20} />
            <span className="text-white">View Orders</span>
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-4 bg-luxury-lightGray rounded-lg hover:bg-gold/10 transition-colors"
          >
            <Users className="text-gold" size={20} />
            <span className="text-white">Manage Users</span>
          </a>
          <a
            href="/"
            className="flex items-center gap-3 p-4 bg-luxury-lightGray rounded-lg hover:bg-gold/10 transition-colors"
          >
            <TrendingUp className="text-gold" size={20} />
            <span className="text-white">View Store</span>
          </a>
        </div>
      </div>
    </div>
  );
}
