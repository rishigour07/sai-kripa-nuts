import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// SVG Dry Fruit Particle Component
const DryfrutParticle = ({ size, x, y, delay, duration }) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={size}
      className={`banner-particle pointer-events-none`}
      opacity="0.15"
      fill="#c8a96b"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );
};

// Animated SVG Line Component
const AnimatedLine = () => {
  return (
    <svg width="100%" height="4" viewBox="0 0 400 4" preserveAspectRatio="none" className="w-full mb-8">
      <line
        x1="0"
        y1="2"
        x2="400"
        y2="2"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        className="stroke-animate"
        strokeDasharray="400"
        strokeDashoffset="400"
        style={{
          animation: 'stroke-draw 2s ease-out forwards',
          animationDelay: '0.2s',
        }}
      />
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c8a96b" stopOpacity="0" />
          <stop offset="50%" stopColor="#c8a96b" stopOpacity="1" />
          <stop offset="100%" stopColor="#e8d3a2" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const LuxuryBanner = ({ handleShopCollection }) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const particleCanvasRef = useRef(null);

  // Generate particles on mount
  useEffect(() => {
    // Reduce particle count by 50% on mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 16;

    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 8 + 16,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative px-6 py-20 md:px-12 md:py-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d2818] via-[#0f3226] to-[#111f15]" />

      {/* Particles Container */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        ref={particleCanvasRef}
      >
        {particles.map((particle) => (
          <DryfrutParticle
            key={particle.id}
            size={particle.size}
            x={`${particle.x}%`}
            y={`${particle.y}%`}
            delay={particle.delay}
            duration={particle.duration}
          />
        ))}
      </svg>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-4xl text-center fade-in-on-scroll">
        {/* Animated Line */}
        <AnimatedLine />

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          }}
        >
          From Farms to
          <br />
          <span className="text-brand-gold">Luxury Tables</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-sm md:text-base uppercase tracking-[0.2em] text-brand-mist/80 mb-10"
        >
          Sourced ethically. Delivered with care.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          onClick={handleShopCollection}
          className="inline-flex items-center gap-3 px-8 py-4 border-2 border-brand-gold text-brand-gold uppercase tracking-[0.15em] text-sm font-semibold rounded-full transition-all duration-300 hover:bg-brand-gold hover:text-[#102018] group"
        >
          Shop the Collection
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </section>
  );
};

export default LuxuryBanner;
