import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';

const InvoiceView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const foundOrder = savedOrders.find((o) => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      // Handle order not found
      navigate('/admin/orders');
    }
  }, [orderId, navigate]);

  if (!order) {
    return <div className="p-8 text-center">Loading Invoice...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Controls - Hidden in print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-[#0E4B32] text-white rounded-xl shadow-sm hover:bg-[#0A3624] transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-md print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#0E4B32] mb-2 tracking-tight">Sai Kripa Nuts</h1>
            <p className="text-gray-500">Premium Quality Dry Fruits</p>
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p>123 Main Market Road,</p>
              <p>Nagpur, Maharashtra 440001</p>
              <p>Phone: +91 98765 43210</p>
              <p>Email: contact@saikripanuts.com</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-light text-gray-400 mb-4">INVOICE</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold">Invoice No:</span> INV-{order.id.slice(-6).toUpperCase()}</p>
              <p><span className="font-semibold">Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Bill To:</h3>
          <div className="text-gray-800 space-y-1">
            <p className="text-lg font-medium">{order.name}</p>
            <p className="text-gray-600">{order.address}</p>
            <p className="text-gray-600">Phone: {order.phone}</p>
          </div>
        </div>

        {/* Product Table */}
        <div className="mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                <th className="py-3 px-4 font-semibold w-1/2">Description</th>
                <th className="py-3 px-4 font-semibold text-right">Quantity</th>
                <th className="py-3 px-4 font-semibold text-right">Price/Kg</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-4 px-4 text-gray-800 font-medium">{order.productName}</td>
                <td className="py-4 px-4 text-gray-600 text-right">{order.quantity} kg</td>
                <td className="py-4 px-4 text-gray-600 text-right">₹{order.price?.toFixed(2)}</td>
                <td className="py-4 px-4 text-gray-800 font-semibold text-right">₹{order.totalAmount?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2 sm:w-1/3">
            <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
              <span>Subtotal:</span>
              <span>₹{order.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
              <span>Tax (0%):</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between py-4 text-xl font-bold text-[#0E4B32]">
              <span>Total:</span>
              <span>₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-100 pt-8 mt-auto">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Thank you for your business!</h4>
              <p className="text-sm text-gray-500">If you have any questions about this invoice, please contact us.</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-gray-400 mb-2"></div>
              <p className="text-sm text-gray-500">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS to handle print mode styling */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white;
          }
          @page {
            margin: 0; /* Remove default browser margins */
            size: auto;
          }
        }
      `}} />
    </div>
  );
};

export default InvoiceView;
