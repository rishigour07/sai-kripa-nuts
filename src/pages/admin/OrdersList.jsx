import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    // Sort by order date descending
    savedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    setOrders(savedOrders);
  };

  const handleConfirmOrder = (orderId) => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const updatedOrders = savedOrders.map(order => 
      order.id === orderId ? { ...order, status: 'confirmed' } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    loadOrders();
  };

  const filteredOrders = orders.filter((order) =>
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
                      <div className="font-medium text-gray-900">{order.name}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                      <div className="text-xs text-gray-400 max-w-[200px] truncate" title={order.address}>
                        {order.address}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{order.productName}</div>
                      <div className="text-sm text-gray-500">{order.quantity} kg @ ₹{order.price}/kg</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">₹{order.totalAmount?.toFixed(2)}</div>
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
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#DDE7D8] text-[#0E4B32]">
                              New
                            </span>
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-[#0E4B32] text-[#0E4B32] hover:bg-[#0E4B32] hover:text-white transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Confirm
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
