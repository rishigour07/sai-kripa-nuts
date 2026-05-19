import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';
import ProductVariants from './ProductVariants';

const parsePrice = (value) => Number(String(value ?? 0).replace(/,/g, '')) || 0;

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const defaultVariantId = product.defaultVariantId || product.variants?.[0]?.id || null;
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = Array.isArray(product.variants)
    ? product.variants.find((v) => v.id === selectedVariantId)
    : null;
  const basePrice = parsePrice(product.price);
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
            className="fixed left-3 right-3 top-3 z-50 mx-auto max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-2xl bg-white shadow-2xl sm:left-4 sm:right-4 md:left-1/2 md:top-1/2 md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-2 transition-colors hover:bg-gray-100 sm:right-6 sm:top-6"
            >
              <X className="w-6 h-6 text-brand-dark" />
            </button>

            {/* Content */}
            <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-2 md:gap-8 md:p-8">
              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#f4ece1] to-[#f0e5d8] sm:min-h-[280px] md:min-h-[420px]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full max-h-[42vh] w-full object-cover md:max-h-96"
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

                  <h1 className="text-2xl font-serif font-bold text-brand-dark mb-2 sm:text-3xl md:text-4xl">
                    {product.name}
                  </h1>
                  <p className="mb-4 text-base font-light text-brand-dark/60 sm:mb-6 sm:text-lg">
                    {product.origin}
                  </p>

                  {/* Description */}
                  <p className="mb-6 leading-relaxed text-brand-dark/70 sm:mb-8">
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
                <div className="mb-6 sm:mb-8">
                  <label className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-dark/70 block mb-4">
                    Quantity (Units)
                  </label>
                  <div className="flex w-full items-center gap-4 rounded-xl bg-gray-100 p-2 sm:w-fit">
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
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-brass py-4 font-bold uppercase tracking-[0.15em] text-white transition-all hover:shadow-lg disabled:opacity-70"
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
