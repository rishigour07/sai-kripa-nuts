import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import logoImg from '../../assets/PHOTO-2026-05-15-21-40-51.jpg';
import { safeReadJSON } from '../../utils/storage';

const InvoiceView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const savedOrders = safeReadJSON('orders', []);
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
    // Open a new window with only the invoice content so print previews don't include the dashboard
    const invoiceEl = document.getElementById('invoice-document');
    if (!invoiceEl) return window.print();
    const newWin = window.open('', '_blank', 'width=900,height=800');
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map((n) => n.outerHTML).join('\n');
    newWin.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          ${styles}
          <style>body{margin:0;padding:20px;background:#fff}</style>
        </head>
        <body>
          ${invoiceEl.outerHTML}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    // Give browser a moment to render styles
    setTimeout(() => {
      newWin.print();
    }, 500);
  };


  const handleDownloadPdf = async () => {
    const el = document.getElementById('invoice-document');
    if (!el) return alert('Invoice content not found');

    // Load html2pdf bundle if not already loaded
    if (typeof window.html2pdf === 'undefined') {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      }).catch(() => {
        return alert('Failed to load PDF generator. Please try printing instead.');
      });
    }

    try {
      const opt = {
        margin:       10,
        filename:     `invoice-${order.id}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
      };

      // html2pdf expects an element
      window.html2pdf().set(opt).from(el).save();
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try printing and saving as PDF.');
    }
  };

  // compute subtotal and total with graceful fallbacks
  const computeSubtotal = () => {
    if (order.subtotal != null) return Number(order.subtotal || 0);
    if (order.totalAmount != null) return Number(order.totalAmount || 0);
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items.reduce((s, it) => {
        const price = Number(it.price ?? it.pricePerKg ?? 0);
        const qty = Number(it.quantity ?? 0);
        return s + price * qty;
      }, 0);
    }
    return 0;
  };

  const subtotal = computeSubtotal();
  const total = Number((order.total ?? subtotal) || 0);

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
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-[#0E4B32] text-white rounded-xl shadow-sm hover:bg-[#0A3624] transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2 bg-white text-[#0E4B32] rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div id="invoice-document" ref={invoiceRef} className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-md print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div className="flex items-start gap-4">
            <img src={logoImg} alt="Sai Kripa Nuts" className="h-16 w-16 rounded-md object-cover shadow-sm" />
            <div>
              <h1 className="text-4xl font-bold text-[#0E4B32] mb-2 tracking-tight">M/S SAI KRIPA NUTS</h1>
              <p className="text-gray-500">Premium Quality Dry Fruits</p>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>Ward no 5, Shri Siddhivinayak Shridhar Rao Market,</p>
                <p>Timarni Harda, MADHYA PRADESH, 461228</p>
                <p>Phone: +91 7722925011</p>
                <p>GSTIN: 23DTWPG8951C1ZD</p>
                <p>Email: contact@saikripanuts.com</p>
              </div>
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
            {(() => {
              const customer = order.customer || { name: order.name, address: order.address, phone: order.phone };
              // compose address from available fields for better display
              const addrParts = [];
              if (customer.addressLine) addrParts.push(customer.addressLine);
              if (customer.address) addrParts.push(customer.address);
              if (customer.city) addrParts.push(customer.city);
              if (customer.state) addrParts.push(customer.state);
              if (customer.pin) addrParts.push(customer.pin);
              if (customer.country) addrParts.push(customer.country);
              const fullAddress = addrParts.length > 0 ? addrParts.join(', ') : (customer.address || '');

              return (
                <>
                  <p className="text-lg font-medium">{customer.name}</p>
                  <p className="text-gray-600">{fullAddress}</p>
                  <p className="text-gray-600">Phone: {customer.phone}</p>
                </>
              );
            })()}
          </div>
        </div>

        {/* Product Table */}
        <div className="mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                <th className="py-3 px-4 font-semibold w-1/2">Description</th>
                <th className="py-3 px-4 font-semibold text-center">Weight</th>
                <th className="py-3 px-4 font-semibold text-right">Quantity</th>
                <th className="py-3 px-4 font-semibold text-right">Price</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((it, idx) => {
                  const price = Number(it.price ?? it.pricePerKg ?? 0);
                  const qty = Number(it.quantity ?? 0);
                  const lineTotal = price * qty;
                  const weight = it.variant?.weight || it.weight || '1 Unit';
                  return (
                    <tr key={idx}>
                      <td className="py-4 px-4 text-gray-800 font-medium">{it.name}</td>
                      <td className="py-4 px-4 text-gray-600 text-center">{weight}</td>
                      <td className="py-4 px-4 text-gray-600 text-right">{qty}</td>
                      <td className="py-4 px-4 text-gray-600 text-right">₹{price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-gray-800 font-semibold text-right">₹{lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-4 px-4 text-gray-800 font-medium">{order.productName}</td>
                  <td className="py-4 px-4 text-gray-600 text-center">1 Unit</td>
                  <td className="py-4 px-4 text-gray-600 text-right">{Number(order.quantity || 0)}</td>
                  <td className="py-4 px-4 text-gray-600 text-right">₹{Number(order.price || 0).toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-800 font-semibold text-right">₹{Number(order.totalAmount || 0).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="flex justify-end mb-16">
          <div className="w-1/2 sm:w-1/3">
            <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
              <span>Tax (0%):</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between py-4 text-xl font-bold text-[#0E4B32]">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
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
