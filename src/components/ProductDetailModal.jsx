import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';
import ProductVariants from './ProductVariants';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const defaultVariantId = product.defaultVariantId || product.variants?.[0]?.id || null;
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = Array.isArray(product.variants)
    ? product.variants.find((v) => v.id === selectedVariantId)
    : null;
  const basePrice = Number(product.price || 0);
  const price = selectedVariant?.discountPrice || selectedVariant?.price || basePrice;

  const handleAddToCart = () => {
    setIsAdding(true);
    const productWithVariant = selectedVariant
      ? {
          ...product,
          variant: selectedVariant,
          price,
        }
      : {
          ...product,
          price,
        };

    onAddToCart(productWithVariant, quantity, selectedVariantId);
    
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
      onClose();
    }, 600);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariantId(variant.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-brand-dark" />
            </button>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center bg-gradient-to-br from-[#f4ece1] to-[#f0e5d8] rounded-xl overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover max-h-96"
                />
              </motion.div>

              {/* Details Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col justify-between"
              >
                {/* Product Info */}
                <div>
                  {product.isNew && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-block mb-3 bg-brand-dark text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    >
                      New
                    </motion.span>
                  )}

                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-2">
                    {product.name}
                  </h1>
                  <p className="text-lg text-brand-dark/60 mb-6 font-light">
                    {product.origin}
                  </p>

                  {/* Description */}
                  <p className="text-brand-dark/70 mb-8 leading-relaxed">
                    Premium quality {product.name.toLowerCase()} sourced directly from the finest farms. Perfect for gifting, wellness, and everyday indulgence with elite quality checks.
                  </p>
                </div>

                {/* Variants Section */}
                {Array.isArray(product.variants) && product.variants.length > 0 ? (
                  <div className="mb-8">
                    <ProductVariants
                      product={product}
                      onVariantChange={handleVariantChange}
                      selectedVariantId={selectedVariantId}
                    />
                  </div>
                ) : (
                  <div className="mb-8 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-4">
                    <p className="text-sm uppercase tracking-[0.15em] text-brand-dark/60">Single Pack</p>
                    <p className="mt-2 text-lg font-semibold text-brand-dark">₹{price.toLocaleString()}</p>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-dark/70 block mb-4">
                    Quantity (Units)
                  </label>
                  <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-2 w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4 text-brand-dark" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                      className="w-12 text-center text-lg font-bold bg-transparent border-none text-brand-dark"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-brand-dark" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-brand-gold to-brand-brass text-white font-bold py-4 rounded-xl uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:shadow-lg transition-all disabled:opacity-70"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isAdding ? 'Adding...' : `Add To Cart — ₹${(price * quantity).toLocaleString()}`}
                </motion.button>

                {/* Total Price Info */}
                <div className="text-center text-sm text-brand-dark/60 mt-3">
                  {quantity > 1 && <p>₹{price} × {quantity} units</p>}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
