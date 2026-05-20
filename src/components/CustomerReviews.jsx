import React, { useRef, useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const ReviewCard = ({ name, quote, initials, index }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
      className={`stagger-item fade-in-on-scroll ${isVisible ? 'is-visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col items-center text-center">
        {/* 5 Stars */}
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-brand-gold text-brand-gold"
            />
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm md:text-base leading-relaxed text-white/80 italic mb-6 max-w-xs">
          "{quote}"
        </p>

        {/* Divider */}
        <div className="hidden md:block w-12 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent mb-6" />
        <div className="md:hidden w-8 h-px bg-brand-gold/30 mb-6" />

        {/* Avatar & Name */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1a3a24] border border-brand-gold/50 flex items-center justify-center">
            <span className="text-xs font-serif font-semibold text-brand-gold">
              {initials}
            </span>
          </div>
          <p className="text-sm font-serif font-semibold text-white">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
};

const CustomerReviews = () => {
  const reviews = [
    {
      name: 'Riya M.',
      initials: 'RM',
      quote: 'The cashews are absolutely divine. Never going back to supermarket nuts!',
    },
    {
      name: 'Arjun S.',
      initials: 'AS',
      quote: 'Packaging is gorgeous. Gifted it to my family, they loved every bite.',
    },
    {
      name: 'Priya K.',
      initials: 'PK',
      quote: 'Pistachios arrived fresh and crunchy. Premium quality, fast shipping.',
    },
  ];

  const trustRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (trustRef.current) {
      observer.observe(trustRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 fade-in-on-scroll text-center" data-reveal>
          <p className="text-xs uppercase tracking-[0.34em] text-brand-mist mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
            Loved by Our
            <br />
            <span className="text-brand-gold">Community</span>
          </h2>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-16 md:mb-20">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              name={review.name}
              initials={review.initials}
              quote={review.quote}
              index={index}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent mb-12" />

        {/* Trust Statement */}
        <div
          ref={trustRef}
          className={`text-center fade-in-on-scroll ${isVisible ? 'is-visible' : ''}`}
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.15em] text-brand-gold font-semibold">
            Trusted by 40,000+ Happy Customers
          </p>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
