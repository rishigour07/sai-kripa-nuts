import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { allProductsWithVariants } from '../data/productsWithVariants';
import { safeReadJSON } from '../utils/storage';

gsap.registerPlugin(ScrollTrigger);

// Legacy allProducts export for backwards compatibility
export const allProducts = allProductsWithVariants.map(p => ({
  id: p.id,
  name: p.name,
  origin: p.origin,
  price: p.variants[0]?.price || '0',
  image: p.image,
  isNew: p.isNew,
}));

const normalizeProduct = (product) => ({
  ...product,
  id: product?._id || product?.id,
  name: product?.name || '',
  description: product?.description || product?.shortDescription || product?.shortDesc || 'No description available',
  image: product?.image || product?.images?.[0] || '/placeholder-product.jpg',
  prices: {
    price250: product?.prices?.price250 || product?.price250 || 0,
    price500: product?.prices?.price500 || product?.price500 || 0,
    price1000: product?.prices?.price1000 || product?.price1000 || 0,
  },
  stock: product?.stock || 0,
});

const Products = () => {
  const [displayProducts, setDisplayProducts] = useState(allProductsWithVariants);

  useEffect(() => {
    // Load from local storage for admin-added products
    const savedProducts = safeReadJSON('addedProducts', []);
    const deletedProducts = safeReadJSON('deletedProducts', []);
    
    let combinedProducts = [...allProductsWithVariants];
    if (savedProducts.length > 0) {
      // Convert saved products to the same shape as existing products
      const convertedSaved = savedProducts.map((p) => ({
        ...normalizeProduct(p),
        variants: p.variants || [
          {
            id: `v1-${p.id}`,
            weight: '250g',
            price: p.prices?.price250 || p.price250 || p.price || 0,
            discountPrice: null,
            stock: p.stock || 100,
          },
          {
            id: `v2-${p.id}`,
            weight: '500g',
            price: p.prices?.price500 || p.price500 || p.price || 0,
            discountPrice: null,
            stock: p.stock || 100,
          },
          {
            id: `v3-${p.id}`,
            weight: '1kg',
            price: p.prices?.price1000 || p.price1000 || p.price || 0,
            discountPrice: null,
            stock: p.stock || 100,
          },
        ],
        defaultVariantId: `v2-${p.id}`,
      }));
      combinedProducts = [...combinedProducts, ...convertedSaved];
    }
    
    // Filter out deleted products
    combinedProducts = combinedProducts.filter(p => !deletedProducts.includes(p.id));
    
    setDisplayProducts(combinedProducts);

    // GSAP Scroll Animations
    const elements = document.querySelectorAll('.gsap-reveal');
    elements.forEach((el) => {
      gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-brand-cream min-h-screen pt-32">
      <Navbar />

      {/* Page Header */}
      <section className="py-20 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark mb-6">Our <span className="text-brand-gold italic font-light">Collection</span></h1>
        <p className="text-lg md:text-xl text-brand-dark/70 max-w-2xl mx-auto font-light">
          Explore our wide range of premium, organic, and hand-picked dry fruits. Sourced from the finest farms worldwide.
        </p>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6 md:px-12 bg-white min-h-[50vh]">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12 gsap-reveal">
            <span className="text-brand-dark/60 text-sm font-medium">Showing {displayProducts.length} products</span>
            <select className="border border-brand-dark/20 bg-transparent text-brand-dark py-2 px-4 rounded focus:outline-none focus:border-brand-gold">
              <option>Sort by Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
