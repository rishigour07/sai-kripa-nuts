import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, FileText, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { safeReadJSON, safeWriteJSON } from '../../utils/storage';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingOrderId, setDeletingOrderId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = safeReadJSON('orders', []);
    // Sort by order date descending
    savedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    setOrders(savedOrders);
  };

  const handleConfirmOrder = (orderId) => {
    const savedOrders = safeReadJSON('orders', []);
    const updatedOrders = savedOrders.map(order => 
      order.id === orderId ? { ...order, status: 'confirmed' } : order
    );
    safeWriteJSON('orders', updatedOrders);
    loadOrders();
  };

  const handleInitiateDelete = (orderId) => {
    setDeletingOrderId(orderId);
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setDeletingOrderId(null);
    setConfirmOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingOrderId) return;
    setIsDeleting(true);
    try {
      // Attempt API delete (will fail in CRA if no server) but try
      await fetch(`/api/orders/${deletingOrderId}`, { method: 'DELETE' }).catch(() => {});

      // Remove from localStorage fallback
      const savedOrders = safeReadJSON('orders', []);
      const updated = savedOrders.filter((o) => o.id !== deletingOrderId);
      safeWriteJSON('orders', updated);
      // Update state
      setOrders(() => {
        updated.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        return updated;
      });

      showToast('Order deleted successfully');
      setConfirmOpen(false);
      setDeletingOrderId(null);
    } catch (err) {
      console.error('Failed to delete order', err);
      showToast('Failed to delete order');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.phone?.includes(searchTerm) ||
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone?.includes(searchTerm) ||
    order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search orders by customer, phone or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0E4B32]/20 focus:border-[#0E4B32] transition-all"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-[#DDE7D8] rounded-lg">
              <Package className="w-5 h-5 text-[#0E4B32]" />
            </div>
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="py-4 px-6 font-medium">Order ID</th>
                <th className="py-4 px-6 font-medium">Customer Info</th>
                <th className="py-4 px-6 font-medium">Product Details</th>
                <th className="py-4 px-6 font-medium">Amount</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium text-right">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{order.id.slice(-6)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                        {(() => {
                          const customer = order.customer || { name: order.name, phone: order.phone, address: order.address };
                          return (
                            <>
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.phone}</div>
                              <div className="text-xs text-gray-400 max-w-[200px] truncate" title={customer.address}>
                                {customer.address}
                              </div>
                            </>
                          );
                        })()}
                    </td>
                    <td className="py-4 px-6">
                        {order.items && order.items.length > 0 ? (
                          <div>
                            <div className="font-medium text-gray-900">{order.items.length} item(s)</div>
                            <div className="text-sm text-gray-500">
                              {order.items.slice(0,3).map((it) => `${it.name} (${it.quantity})`).join(', ')}{order.items.length>3? '...' : ''}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-gray-900">{order.productName}</div>
                            <div className="text-sm text-gray-500">{order.quantity} kg @ ₹{order.price}/kg</div>
                          </>
                        )}
                    </td>
                    <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">₹{Number(order.total ?? order.totalAmount ?? order.subtotal ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {order.status === 'confirmed' ? (
                          <>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Confirmed
                            </span>
                            <button
                              onClick={() => navigate(`/admin/invoice/${order.id}`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#0E4B32] text-white hover:bg-[#0A3624] transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Invoice
                            </button>
                            {/* Delete button for admins */}
                            <button
                              onClick={() => handleInitiateDelete(order.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transform hover:scale-105 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#DDE7D8] text-[#0E4B32]">New</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleConfirmOrder(order.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-[#0E4B32] text-[#0E4B32] hover:bg-[#0E4B32] hover:text-white transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Confirm
                              </button>

                              <button
                                onClick={() => navigate(`/admin/invoice/${order.id}`)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#0E4B32] text-white hover:bg-[#0A3624] transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View Invoice
                              </button>

                              <button
                                onClick={() => handleInitiateDelete(order.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transform hover:scale-105 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        {/* Confirmation Modal */}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleCancelDelete} />
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">Delete Order?</h3>
              <p className="mt-3 text-sm text-gray-600">Are you sure you want to delete this order? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={handleCancelDelete} className="px-4 py-2 rounded-md border">Cancel</button>
                <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
