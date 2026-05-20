import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BestSellersShowcase = ({ products = [], hideQuickAdd = false }) => {
  const { addItem, showToast } = useCart();
  const [hoveredId, setHoveredId] = useState(null);

  // Default best sellers if not provided
  const bestSellers = products.length > 0 
    ? products.slice(0, 4) 
    : [];

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    if (product.id) {
      addItem({ ...product, quantity: 1 });
      showToast(`Added ${product.name} to cart!`);
    }
  };

  if (bestSellers.length === 0) return null;

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 fade-in-on-scroll" data-reveal>
          <p className="text-xs uppercase tracking-[0.34em] text-brand-mist mb-2">Most Loved</p>
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-serif text-white relative inline-block md:text-5xl lg:text-6xl">
              Best Sellers
              <div className="absolute bottom-0 left-0 h-1 w-24 bg-gradient-to-r from-brand-gold to-brand-brass rounded-full" />
            </h2>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {bestSellers.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="group relative overflow-hidden rounded-[24px] bg-[#1a3a24] shadow-[0_24px_60px_rgba(0,0,0,0.24)] transition-all duration-300"
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Product Image Section */}
                  <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] p-4 sm:p-5">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="h-44 w-full max-w-[220px] object-contain sm:h-48"
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex rounded-full bg-brand-gold px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#102018] font-semibold">
                        {product.badge || 'Premium'}
                      </span>
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a3a24] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Product Info Section */}
                  <div className="relative flex flex-col justify-between gap-4 p-4 sm:p-5 bg-[#1a3a24] min-h-[180px]">
                    {/* Product Details */}
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-white sm:text-[1.35rem]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        {product.subtitle || product.origin}
                      </p>
                    </div>

                    {/* Price and Meta */}
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <p className="text-sm uppercase tracking-[0.22em] text-white/55">
                        From <span className="ml-1 block text-2xl font-serif tracking-normal text-brand-gold not-italic">₹{product.price}</span>
                      </p>
                    </div>
                  </div>

                  {/* Quick Add Button - Hidden on homepage via hideQuickAdd */}
                  {!hideQuickAdd && hoveredId === product.id && (
                    <motion.button
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="glass-button quick-add-button absolute bottom-0 left-0 right-0 w-full py-3 md:py-4 flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-[0.15em] font-semibold border-t border-t-brand-gold/30"
                    >
                      <Plus className="w-4 h-4" />
                      Quick Add
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Scroll Indicator */}
        </div>
      </div>
    </section>
  );
};

export default BestSellersShowcase;
