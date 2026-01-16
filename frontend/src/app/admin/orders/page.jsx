'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Eye, Truck, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  paid: 'bg-blue-500/20 text-blue-500',
  processing: 'bg-purple-500/20 text-purple-500',
  shipped: 'bg-indigo-500/20 text-indigo-500',
  delivered: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
  refunded: 'bg-gray-500/20 text-gray-500'
};

const statusIcons = {
  pending: Clock,
  paid: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: XCircle
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await adminAPI.getOrders(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <h1 className="text-3xl font-heading font-bold text-gold">Orders</h1>
          <p className="text-gray-400 mt-1">Manage customer orders</p>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-luxury-darkGray border border-gold/20 rounded-lg text-white focus:border-gold outline-none"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="bg-luxury-darkGray rounded-lg border border-gold/20 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">No orders found</p>
          <p className="text-gray-500 text-sm mt-1">Orders will appear here when customers make purchases</p>
        </div>
      ) : (
        <div className="bg-luxury-darkGray rounded-lg overflow-hidden border border-gold/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-luxury-lightGray">
                <tr>
                  <th className="px-6 py-3 text-left text-gold">Order #</th>
                  <th className="px-6 py-3 text-left text-gold">Customer</th>
                  <th className="px-6 py-3 text-left text-gold">Date</th>
                  <th className="px-6 py-3 text-left text-gold">Total</th>
                  <th className="px-6 py-3 text-left text-gold">Status</th>
                  <th className="px-6 py-3 text-left text-gold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || Clock;
                  return (
                    <tr key={order.id} className="border-t border-gold/10">
                      <td className="px-6 py-4">
                        <span className="text-white font-mono">{order.order_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white">{order.shipping_address?.name || 'N/A'}</p>
                          <p className="text-gray-400 text-sm">{order.shipping_address?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                          <StatusIcon size={14} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-gold hover:text-gold-light"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-2 py-1 bg-luxury-lightGray border border-gold/20 rounded text-sm text-white focus:border-gold outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-luxury-darkGray rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gold/20">
              <h2 className="text-xl font-semibold text-gold">
                Order #{selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p className="text-white">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Method</p>
                  <p className="text-white">{selectedOrder.payment_method || 'Card'}</p>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Shipping Address</p>
                  <div className="bg-luxury-lightGray p-4 rounded-lg">
                    <p className="text-white">{selectedOrder.shipping_address.name}</p>
                    <p className="text-gray-300">{selectedOrder.shipping_address.address}</p>
                    <p className="text-gray-300">
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-luxury-lightGray p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="text-white">{item.product_name}</p>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-white">${parseFloat(item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Totals */}
              <div className="border-t border-gold/20 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-${parseFloat(selectedOrder.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>${parseFloat(selectedOrder.shipping_cost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gold/20">
                  <span>Total</span>
                  <span className="text-gold">${parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
