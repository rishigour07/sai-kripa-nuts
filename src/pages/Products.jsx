import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

import almonds from '../assets/almonds_product.png';
import pistachio from '../assets/pistachio_product.png';
import kaju from '../assets/kaju_product.png';
import anjir from '../assets/anjir_product.png';

gsap.registerPlugin(ScrollTrigger);

export const allProducts = [
  { id: 1, name: 'Kaju W320', origin: 'Premium W320 Grade Cashews', price: '210', image: kaju, isNew: true },
  { id: 2, name: 'Kaju W240', origin: 'Premium W240 Grade Cashews', price: '220', image: kaju },
  { id: 3, name: 'Badam American', origin: 'American Almonds', price: '220', image: almonds },
  { id: 4, name: 'Badam Independent', origin: 'Independent Almonds', price: '210', image: almonds },
  { id: 5, name: 'Pista', origin: 'Roasted Pistachios', price: '310', image: pistachio },
  { id: 6, name: 'Anjir', origin: 'Dried Figs', price: '260', image: anjir },
];

const Products = () => {
  const [displayProducts, setDisplayProducts] = useState(allProducts);

  useEffect(() => {
    // Load from local storage
    const savedProducts = JSON.parse(localStorage.getItem('addedProducts')) || [];
    const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts')) || [];
    
    let combinedProducts = [...allProducts];
    if (savedProducts.length > 0) {
      combinedProducts = [...combinedProducts, ...savedProducts];
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
