import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

import heroBg from '../assets/hero_bg.png';
import almonds from '../assets/almonds_product.png';
import pistachio from '../assets/pistachio_product.png';
import kaju from '../assets/kaju_product.png';
import anjir from '../assets/anjir_product.png';

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: 1, name: 'Kaju W320', origin: 'Premium W320 Grade Cashews', price: '210', image: kaju, isNew: true },
  { id: 2, name: 'Badam American', origin: 'American Almonds', price: '220', image: almonds },
  { id: 3, name: 'Pista', origin: 'Roasted Pistachios', price: '310', image: pistachio },
  { id: 4, name: 'Anjir', origin: 'Dried Figs', price: '260', image: anjir },
];

const features = [
  { icon: Leaf, title: '100% Organic', desc: 'Sourced from natural farms' },
  { icon: ShieldCheck, title: 'Premium Quality', desc: 'Handpicked and sorted' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Secure & hygienic packaging' },
];

const Home = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
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
    <div className="bg-brand-cream min-h-screen">
      <Navbar isHome={true} />

      {/* 1. Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: yParallax }}
        >
          <img 
            src={heroBg} 
            alt="Premium Dry Fruits" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-dark/40"></div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-xl"
          >
            Nature's <span className="text-brand-gold italic font-light">Finest</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/90 mb-10 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md"
          >
            Experience the rich taste of premium, hand-picked dry fruits and nuts sourced from the best farms around the world.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button className="px-8 py-4 bg-brand-gold text-white font-medium uppercase tracking-widest text-sm hover:bg-white hover:text-brand-dark transition-colors duration-500 w-full sm:w-auto">
              Shop Collection
            </button>
            <button className="px-8 py-4 bg-transparent border border-white text-white font-medium uppercase tracking-widest text-sm hover:bg-white/10 transition-colors duration-500 w-full sm:w-auto">
              Explore Our Story
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Products */}
      <section className="py-24 px-6 md:px-12 bg-white" id="shop">
        <div className="container mx-auto">
          <div className="text-center mb-16 gsap-reveal">
            <span className="text-brand-gold uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">Our Collection</span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-dark font-bold">Featured Products</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <div className="text-center mt-16 gsap-reveal">
            <Link to="/products" className="inline-flex items-center text-brand-dark hover:text-brand-gold font-serif text-lg italic transition-colors">
              View All Products <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-24 bg-brand-dark text-brand-cream relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {features.map((feature, index) => (
              <div key={index} className="gsap-reveal flex flex-col items-center p-8 rounded-2xl glass-dark">
                <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-10 h-10 text-brand-gold" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-white/70 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Newsletter / CTA */}
      <section className="py-32 relative flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-brand-dark"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto gsap-reveal">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Join the Sai Kripa Family</h2>
          <p className="text-white/80 font-light mb-10 text-lg">
            Subscribe to receive updates on new harvests, exclusive offers, and healthy lifestyle tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-brand-gold min-w-[300px]"
            />
            <button 
              type="submit"
              className="px-8 py-4 bg-brand-gold text-white font-medium uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
