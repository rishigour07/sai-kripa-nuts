import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from './ProductDetailModal';

const ProductCard = ({ product, index }) => {
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();

  const getDefaultPrice = () => {
    const defaultVariant = product.variants?.[0];
    return defaultVariant ? defaultVariant.price : product.price;
  };

  const handleAddToCart = (productWithVariant, quantity, variantId) => {
    addItem(productWithVariant, quantity, variantId);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleQuickAdd = () => {
    // If product has variants, open modal
    if (product.variants && product.variants.length > 0) {
      setIsModalOpen(true);
    } else {
      // For simple products, add directly
      addItem(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group"
      >
        <div className="relative mb-6 aspect-square overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:shadow-2xl">
          {product.isNew && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-brand-dark px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              New
            </div>
          )}

          <div className="relative h-full w-full overflow-hidden bg-[#f4ece1]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center space-x-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleQuickAdd}
              className="rounded-full bg-white p-3 text-brand-dark shadow-lg transition-colors duration-300 hover:bg-brand-gold hover:text-white"
              title="Quick Add / Open Details"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
            <button
              onClick={handleViewDetails}
              className="rounded-full bg-white p-3 text-brand-dark shadow-lg transition-colors duration-300 hover:bg-brand-gold hover:text-white"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-4 text-center">
          <h3 className="mb-2 text-xl font-semibold text-brand-dark transition-colors duration-300 group-hover:text-brand-gold">
            {product.name}
          </h3>
          <p className="mb-3 text-sm font-light text-brand-dark/60">{product.origin}</p>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-lg font-bold text-brand-dark">INR {getDefaultPrice()}</span>
            {product.oldPrice ? <span className="text-sm text-brand-dark/40 line-through">INR {product.oldPrice}</span> : null}
          </div>

          <button
            onClick={handleQuickAdd}
            className="mt-4 w-full rounded-xl border border-brand-dark/20 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark transition hover:border-brand-gold hover:text-brand-gold"
          >
            {added ? 'Added' : 'Add To Cart'}
          </button>
        </div>
      </motion.div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductCard;
