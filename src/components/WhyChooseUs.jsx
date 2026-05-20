import React, { useEffect, useRef } from 'react';
import { Leaf, Package, Hand, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`stagger-item group p-7 md:p-8 rounded-[16px] border border-white/10 bg-[#152a1e] transition-all duration-300 hover:border-brand-gold/40 hover:bg-[#1a3426] ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Icon */}
      <div className="relative inline-block">
        <Icon className="w-10 h-10 text-brand-gold transition-transform duration-300 group-hover:rotate-[5deg]" />
      </div>

      {/* Title */}
      <h3 className="mt-6 text-lg md:text-xl font-serif font-semibold text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
        {description}
      </p>

      {/* Hover Border Animation */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-gold via-brand-mist to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[16px]" />
    </div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Farm Fresh Selection',
      description: 'Direct sourced from certified farms across premium global regions.',
    },
    {
      icon: Package,
      title: 'Premium Packaging',
      description: 'Airtight sealed for maximum freshness and preserved nutrition.',
    },
    {
      icon: Hand,
      title: 'Hand Picked Quality',
      description: 'Every nut selected by expert hands for perfect texture and taste.',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Dispatched within 12 hours of order to your doorstep.',
    },
  ];

  return (
    <section className="relative px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 fade-in-on-scroll" data-reveal>
          <p className="text-xs uppercase tracking-[0.34em] text-brand-mist mb-4">Why Sai Kripa</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
            Why Choose
            <br />
            <span className="text-brand-gold">Sai Kripa Nuts</span>
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
