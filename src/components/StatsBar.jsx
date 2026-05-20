import React, { useRef, useEffect, useState } from 'react';

const StatCard = ({ value, suffix, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const startAt = performance.now();
          const duration = 1400;

          const tick = (now) => {
            const progress = Math.min((now - startAt) / duration, 1);
            setDisplayValue(Math.floor(progress * value));
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={cardRef}
      className="stat-card fade-in-on-scroll group"
    >
      <p className="text-3xl md:text-4xl font-serif font-semibold text-brand-gold">
        {displayValue}
        <span className="ml-1">{suffix}</span>
      </p>
      <p className="mt-3 text-xs md:text-sm uppercase tracking-[0.2em] text-white/70 group-hover:text-white/90">
        {label}
      </p>
    </div>
  );
};

const StatsBar = () => {
  return (
    <section className="relative px-6 py-16 md:py-24 md:px-12 -mt-12 md:-mt-16 z-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <StatCard value={25} suffix="+" label="Global Farms" />
          <StatCard value={40} suffix="K+" label="Premium Orders" />
          <StatCard value={98} suffix="%" label="Purity Assurance" />
          <StatCard value={12} suffix="h" label="Dispatch Window" />
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
