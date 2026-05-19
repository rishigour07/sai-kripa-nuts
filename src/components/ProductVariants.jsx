import React from 'react';
import { motion } from 'framer-motion';

const ProductVariants = ({ product, onVariantChange, selectedVariantId }) => {
  const handleVariantClick = (variant) => {
    onVariantChange(variant);
  };

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const hasDiscount = selectedVariant?.discountPrice && selectedVariant.discountPrice < selectedVariant.price;

  return (
    <div className="w-full">
      {/* Variant Selection Header */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-brand-dark/70 mb-4">
          Select Weight
        </h3>

        {/* Variant Buttons */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {product.variants.map((variant, idx) => {
            const isSelected = selectedVariantId === variant.id;
            const variantHasDiscount = variant.discountPrice && variant.discountPrice < variant.price;
            const variantDiscount = variantHasDiscount 
              ? Math.round((1 - variant.discountPrice / variant.price) * 100)
              : 0;

            return (
              <motion.button
                key={variant.id}
                onClick={() => handleVariantClick(variant)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group px-3 sm:px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-brand-dark/15 bg-white hover:border-brand-gold/60'
                }`}
              >
                {/* Discount Badge */}
                {variantDiscount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{variantDiscount}%
                  </div>
                )}

                {/* Weight Label */}
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-dark/70">
                  {variant.weight}
                </div>

                {/* Price */}
                <div className="flex flex-col items-center gap-1">
                  {variantHasDiscount ? (
                    <>
                      <div className="text-sm text-brand-dark/40 line-through">
                        ₹{variant.price}
                      </div>
                      <div className="text-lg font-bold text-brand-gold">
                        ₹{variant.discountPrice}
                      </div>
                    </>
                  ) : (
                    <div className="text-lg font-bold text-brand-dark">
                      ₹{variant.price}
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="variant-indicator"
                    className="absolute inset-0 rounded-xl border-2 border-brand-gold"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Checkmark for Selected */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-3 -left-3 bg-brand-gold rounded-full p-1"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Price Summary Card */}
      <motion.div
        key={selectedVariantId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-brand-gold/10 to-brand-mist/10 rounded-xl p-4 border border-brand-gold/20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-brand-dark/70">Selected Weight:</span>
          <span className="text-lg font-bold text-brand-dark">{selectedVariant?.weight}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-brand-dark/70">Price:</span>
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-sm text-brand-dark/40 line-through">
                  ₹{selectedVariant?.price}
                </span>
                <span className="text-2xl font-bold text-brand-gold">
                  ₹{selectedVariant?.discountPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-brand-dark">
                ₹{selectedVariant?.price}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        {selectedVariant?.stock !== undefined && (
          <div className="mt-3 pt-3 border-t border-brand-gold/20">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              selectedVariant.stock > 10 ? 'text-green-600' : 
              selectedVariant.stock > 0 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductVariants;
