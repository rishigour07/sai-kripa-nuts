import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from './ProductDetailModal';

const ProductCard = ({ product, index }) => {
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem, showToast } = useCart();

  const normalizedProduct = {
    ...product,
    id: product?._id || product?.id,
    name: product?.name || 'Unnamed Product',
    description: product?.description || product?.shortDescription || product?.shortDesc || 'No description available',
    image: product?.image || product?.images?.[0] || '/placeholder-product.jpg',
    prices: {
      price250: product?.prices?.price250 || product?.price250 || 0,
      price500: product?.prices?.price500 || product?.price500 || 0,
      price1000: product?.prices?.price1000 || product?.price1000 || 0,
    },
    stock: product?.stock || 0,
  };

  const getDefaultPrice = () => {
    const defaultVariant = normalizedProduct.variants?.[0];
    if (defaultVariant) return defaultVariant.price || 0;

    return normalizedProduct.prices.price500 || normalizedProduct.prices.price250 || normalizedProduct.prices.price1000 || 0;
  };

  const handleAddToCart = (productWithVariant, quantity, variantId) => {
    addItem(productWithVariant, quantity, variantId);
    showToast('Added to cart');
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleQuickAdd = () => {
    // If product has variants, open modal
    if (normalizedProduct.variants && normalizedProduct.variants.length > 0) {
      setIsModalOpen(true);
    } else {
      // For simple products, add directly
      addItem(normalizedProduct, 1);
      showToast('Added to cart');
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
        className="group w-full"
      >
        <div className="relative mb-4 w-full overflow-visible rounded-2xl bg-white/3 shadow-sm transition-transform duration-500 hover:shadow-2xl hover:-translate-y-1">
          {normalizedProduct.isNew && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-brand-dark px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              New
            </div>
          )}

          <div 
            className="relative h-60 w-full overflow-hidden bg-[#f4ece1] cursor-pointer"
            onClick={handleViewDetails}
          >
            <img
              src={normalizedProduct.image}
              alt={normalizedProduct.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center space-x-3 p-3 md:p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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

        <div className="px-3 md:px-4 text-left">
          <h3 
            className="mb-2 text-base md:text-xl font-semibold text-[#1F1F1F] transition-colors duration-300 group-hover:text-brand-gold cursor-pointer"
            onClick={handleViewDetails}
          >
            {normalizedProduct.name}
          </h3>
          <p className="mb-3 text-xs md:text-sm font-light text-[#4A4A4A]">{normalizedProduct.origin || normalizedProduct.category || ''}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-brand-gold">INR {getDefaultPrice()}</span>
            {normalizedProduct.oldPrice ? <span className="text-sm text-brand-dark/40 line-through">INR {normalizedProduct.oldPrice}</span> : null}
          </div>

          <button
            onClick={handleQuickAdd}
            className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#1F1F1F] transition hover:border-brand-gold hover:text-brand-gold min-h-[50px]"
          >
            {added ? 'Added' : 'Add To Cart'}
          </button>
        </div>
      </motion.div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={normalizedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductCard;
