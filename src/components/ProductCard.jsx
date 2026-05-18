import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Eye, X, CheckCircle2 } from 'lucide-react';

const ProductCard = ({ product, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: '1',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      price: product.price,
      ...formData,
      totalAmount: parseFloat(product.price) * parseFloat(formData.quantity || 0),
      orderDate: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', address: '', quantity: '1' });
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 mb-6 aspect-square">
        {/* Badges */}
        {product.isNew && (
          <div className="absolute top-4 left-4 z-10 bg-brand-dark text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            New
          </div>
        )}
        
        {/* Image */}
        <div className="w-full h-full relative overflow-hidden bg-[#f4ece1]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-brand-dark p-3 rounded-full shadow-lg hover:bg-brand-gold hover:text-white transition-colors duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button className="bg-white text-brand-dark p-3 rounded-full shadow-lg hover:bg-brand-gold hover:text-white transition-colors duration-300">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="text-center px-4">
        <h3 className="text-xl font-serif font-semibold text-brand-dark mb-2 group-hover:text-brand-gold transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-brand-dark/60 text-sm mb-3 font-light">{product.origin}</p>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-lg font-bold text-brand-dark">₹{product.price}</span>
          {product.oldPrice && (
            <span className="text-sm line-through text-brand-dark/40">₹{product.oldPrice}</span>
          )}
        </div>
      </div>
      {/* Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {isSuccess ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
                  <p className="text-gray-500">Thank you for your purchase.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-brand-dark mb-6">Book Order</h3>
                  
                  <div className="flex items-center gap-4 mb-6 p-4 bg-[#FAF8F3] rounded-2xl">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl bg-white" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-brand-gold font-bold">₹{product.price} / kg</p>
                    </div>
                  </div>

                  <form onSubmit={handleOrderSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                      <input
                        type="number"
                        name="quantity"
                        min="0.1"
                        step="0.1"
                        required
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                      <textarea
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors resize-none"
                        placeholder="Enter full address"
                      ></textarea>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <div className="text-gray-500">
                        Total: <span className="text-xl font-bold text-brand-dark">₹{(parseFloat(product.price) * parseFloat(formData.quantity || 0)).toFixed(2)}</span>
                      </div>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-[#0E4B32] text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors shadow-lg shadow-[#0E4B32]/30"
                      >
                        Confirm Order
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
