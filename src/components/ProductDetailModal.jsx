import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const parsePrice = (value) => Number(String(value ?? 0).replace(/,/g, '')) || 0;

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const defaultVariantId = product?.defaultVariantId || product?.variants?.[0]?.id || null;
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [isAdding, setIsAdding] = useState(false);

  const normalizedProduct = useMemo(() => {
    if (!product) {
      return null;
    }

    const normalizedPrices = {
      price250: product?.prices?.price250 || product?.price250 || 0,
      price500: product?.prices?.price500 || product?.price500 || 0,
      price1000: product?.prices?.price1000 || product?.price1000 || 0,
    };

    return {
      ...product,
      id: product._id || product.id,
      name: product.name || 'Unnamed Product',
      description: product.description || product.shortDesc || 'No description available',
      prices: normalizedPrices,
      image: product?.image || product?.images?.[0] || '/placeholder-product.jpg',
      stock: product.stock || 0,
    };
  }, [product]);

  const selectedVariant = Array.isArray(normalizedProduct?.variants)
    ? normalizedProduct.variants.find((v) => v.id === selectedVariantId)
    : null;
  const selectedPrice =
    selectedVariant?.discountPrice ||
    selectedVariant?.price ||
    (selectedVariant?.weight === '250g'
      ? normalizedProduct?.prices?.price250
      : selectedVariant?.weight === '500g'
      ? normalizedProduct?.prices?.price500
      : selectedVariant?.weight === '1kg'
      ? normalizedProduct?.prices?.price1000
      : normalizedProduct?.prices?.price500) || 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    const payload = {
      id: normalizedProduct?.id,
      name: normalizedProduct?.name,
      image: normalizedProduct?.image,
      selectedWeight: selectedVariant?.weight || 'Single Pack',
      selectedPrice,
      price: selectedPrice,
      quantity,
      variantId: selectedVariantId || null,
      variant: selectedVariant || null,
    };

    onAddToCart(payload, quantity, selectedVariantId);

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
      onClose();
    }, 600);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariantId(variant.id);
  };

  // Reset selection when opening a new product
  useEffect(() => {
    if (isOpen) {
      setSelectedVariantId(defaultVariantId);
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, defaultVariantId]);

  if (!normalizedProduct && isOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="rounded-2xl bg-white p-6 text-[#102017] shadow-2xl">Loading product...</div>
        </motion.div>
      </AnimatePresence>
    );
  }

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
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            className="fixed inset-0 z-40"
          />

          {/* Centered Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-[95%] sm:w-[90%] md:w-[750px] max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full p-2 transition-colors hover:bg-gray-100 sm:right-6 sm:top-6"
              >
                <X className="w-5 h-5 text-brand-dark" />
              </button>

              {/* Compact Content */}
              <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-6 p-6 items-start">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className="overflow-hidden rounded-xl bg-[#f4ece1]"
                  style={{ height: 320 }}
                >
                  <img
                    src={normalizedProduct.image}
                    alt={normalizedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.08 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    {normalizedProduct.isNew && (
                      <span className="inline-block mb-2 bg-brand-dark text-white px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">New</span>
                    )}

                    <h1 className="text-[28px] font-bold text-brand-dark leading-tight">{normalizedProduct.name}</h1>
                    <p className="mt-2 text-sm text-brand-dark/60">{normalizedProduct.origin || normalizedProduct.category || 'Dry fruits'}</p>
                    <p className="mt-3 text-sm text-brand-dark/70">{normalizedProduct.description}</p>
                  </div>

                  {/* Weight Options - compact */}
                  {Array.isArray(normalizedProduct.variants) && normalizedProduct.variants.length > 0 ? (
                    <div className="flex items-center gap-3">
                      {normalizedProduct.variants.map((variant) => {
                        const isSelected = selectedVariantId === variant.id;
                        const priceLabel = variant.discountPrice || variant.price;
                        return (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantChange(variant)}
                            className={`px-3 py-2 rounded-lg border transition text-sm ${isSelected ? 'border-brand-gold bg-brand-gold/10' : 'border-white/10 bg-white/[0.02] hover:border-brand-gold'}`}
                          >
                            <div className="font-semibold text-brand-dark">{variant.weight}</div>
                            <div className="text-xs text-brand-dark/60">₹{(priceLabel ?? 0).toLocaleString()}</div>
                          </button>
                        );
                      })}
                    </div>
                    ) : (
                    <div className="text-sm text-brand-dark/70">Single Pack — ₹{(selectedPrice ?? 0).toLocaleString()}</div>
                  )}

                  {/* Price + Quantity + CTA */}
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-brand-dark/60">Price</div>
                        <div className="text-2xl font-bold text-brand-gold">₹{(((selectedPrice ?? 0) * (Number(quantity) || 0)) ?? 0).toLocaleString()}</div>
                      </div>

                      {/* Quantity compact */}
                      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 text-lg text-brand-dark">-</button>
                        <div className="w-10 text-center font-bold text-brand-dark">{quantity}</div>
                        <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-lg text-brand-dark">+</button>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.12 }}
                      style={{ height: 52 }}
                      className="w-full rounded-xl bg-gradient-to-r from-brand-gold to-brand-brass text-[#102017] font-semibold text-base"
                    >
                      {isAdding ? 'Adding…' : `Add to Cart • ₹${(((selectedPrice ?? 0) * (Number(quantity) || 0)) ?? 0).toLocaleString()}`}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
