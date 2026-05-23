import React, { Suspense, useEffect, useRef, useState, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight,
  ChevronRight,
  Leaf,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';
import StatsBar from '../components/StatsBar';
import BestSellersShowcase from '../components/BestSellersShowcase';
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerReviews from '../components/CustomerReviews';
import LuxuryBanner from '../components/LuxuryBanner';
import '../styles/luxury-animations.css';
import almonds from '../assets/almonds_product.webp';
import pistachio from '../assets/pistachio_product.webp';
import kaju from '../assets/kaju_product.webp';
import anjir from '../assets/anjir_product.webp';
import walnuts from '../assets/walnuts_product.webp';
import dates from '../assets/dates_product.webp';

gsap.registerPlugin(ScrollTrigger);

// Lazy load the heavy 3D WebGL Canvas to exclude ThreeJS from the initial bundle on mobile
const NutsScene = lazy(() => import('../components/NutsScene'));

const products = [
  {
    id: 1,
    name: 'Royal Kaju W320',
    subtitle: 'Hand selected velvet cashews',
    price: '2,180',
    image: kaju,
    category: 'Signature',
    badge: 'Most Loved',
  },
  {
    id: 2,
    name: 'Californian Gold Almonds',
    subtitle: 'Stone-sort finish with rich oils',
    price: '2,240',
    image: almonds,
    category: 'Raw',
    badge: 'Chef Pick',
  },
  {
    id: 3,
    name: 'Emerald Pistachio Reserve',
    subtitle: 'Roasted shell-on pistachio selection',
    price: '2,980',
    image: pistachio,
    category: 'Roasted',
    badge: 'Limited',
  },
  {
    id: 4,
    name: 'Anatolian Fig Couture',
    subtitle: 'Sun dried figs with honey notes',
    price: '2,610',
    image: anjir,
    category: 'Wellness',
    badge: 'New Harvest',
  },
  {
    id: 5,
    name: 'Velvet Walnut Halves',
    subtitle: 'Cold preserved high omega kernels',
    price: '2,780',
    image: walnuts,
    category: 'Wellness',
    badge: 'Fresh Lot',
  },
  {
    id: 6,
    name: 'Amber Medjool Dates',
    subtitle: 'Caramel-soft Saudi reserve dates',
    price: '2,350',
    image: dates,
    category: 'Signature',
    badge: 'Premium',
  },
];

const heroHeading = 'Sai Kripa Nuts';

const Counter = ({ to, suffix, label }) => {
  const [value, setValue] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          return;
        }

        const startAt = performance.now();
        const duration = 1400;

        const tick = (now) => {
          const progress = Math.min((now - startAt) / duration, 1);
          setValue(Math.floor(progress * to));
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [to]);

  return (
    <div ref={counterRef} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 ambient-glow">
      <p className="text-4xl md:text-5xl font-semibold font-serif text-gradient-gold">
        {value}
        {suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/65">{label}</p>
    </div>
  );
};

const MagneticButton = ({ children, className, onClick }) => {
  const buttonRef = useRef(null);

  const handleMove = (event) => {
    const node = buttonRef.current;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(node, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    const node = buttonRef.current;
    if (!node) {
      return;
    }

    gsap.to(node, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
};

const Home = () => {
  const { addItem, showToast } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const mouseGlowRef = useRef(null);
  const scopeRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 22, mass: 0.2 });

  const handleShopCollection = () => {
    navigate('/products');
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Drastically shorter loading delay on mobile to boost LCP/FCP, slightly shorter on desktop
    const timeout = window.innerWidth < 768 ? 300 : 900;
    const loadTimer = setTimeout(() => setIsLoading(false), timeout);

    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    // Disable Lenis smooth scroll on mobile to avoid scrolling lags on low-end processors
    if (window.innerWidth < 1024) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.3,
    });

    let frameId = 0;

    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Ultra-optimized mouse move listener:
    // 1. Skip on mobile completely
    // 2. Direct DOM update via ref instead of setting React state to avoid full page re-renders
    if (window.innerWidth < 768) {
      return;
    }

    const mouseGlow = mouseGlowRef.current;
    if (!mouseGlow) return;

    let rafId = 0;
    const onMove = (event) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (mouseGlow) {
          mouseGlow.style.transform = `translate(${event.clientX - 190}px, ${event.clientY - 190}px)`;
        }
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      // Direct CSS styles on mobile to prevent ScrollTrigger thread overhead
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        element.style.opacity = 1;
        element.style.transform = 'none';
      });
      return;
    }

    const context = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
            },
          }
        );
      });
    }, scopeRef);

    return () => {
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Intersection Observer for fade-in-on-scroll elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div ref={scopeRef} className="relative min-h-screen text-brand-cream luxury-grain">
      <motion.div className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-gradient-to-r from-brand-mist via-brand-gold to-brand-brass" style={{ scaleX: progress }} />
      {!isMobile && (
        <div ref={mouseGlowRef} className="mouse-glow" style={{ transform: 'translate(-500px, -500px)' }} />
      )}

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#040c09]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm uppercase tracking-[0.55em] text-brand-mist">Sai Kripa Nuts</p>
              <div className="mx-auto mt-6 h-[2px] w-52 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                  className="h-full w-1/2 bg-gradient-to-r from-brand-brass via-brand-gold to-brand-mist"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar isHome />

      <main>
        <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28 md:px-12">
          <div className="absolute inset-0 opacity-90">
            {isMobile ? (
              /* High-performance premium CSS animated background fallback for mobile */
              <div className="absolute inset-0 bg-[#081a14] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-[#1b4a3a] opacity-30 blur-[80px] animate-[pulse_10s_infinite_alternate]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#c8a96b] opacity-[0.08] blur-[100px] animate-[pulse_8s_infinite_alternate_2s]" />
              </div>
            ) : (
              <Suspense fallback={null}>
                <NutsScene />
              </Suspense>
            )}
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,211,162,0.17),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(40,102,78,0.4),transparent_46%)]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050f0c]" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-brand-mist backdrop-blur-md">
                Cinematic Luxury Dry Fruits
              </p>

              <h1 className="text-5xl leading-[0.95] text-white md:text-7xl lg:text-[6.5rem]">
                {heroHeading.split('').map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.03, duration: 0.55 }}
                    className="inline-block"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8 }}
                className="mt-7 max-w-2xl text-base leading-relaxed text-white/78 md:text-xl"
              >
                Elevating heritage harvests into an immersive luxury indulgence. Explore hand-crafted dry fruits with premium freshness, cinematic depth and modern elegance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.7 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <MagneticButton
                  onClick={handleShopCollection}
                  className="group inline-flex items-center rounded-full border border-brand-gold bg-brand-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#102018] transition duration-300 hover:shadow-[0_18px_40px_rgba(200,169,107,0.25)]"
                >
                  Shop Collection
                  <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>

                <Link
                  to="/about"
                  className="group inline-flex items-center rounded-full border border-white/25 bg-white/5 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:border-brand-gold hover:text-brand-gold"
                >
                  Our Story
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4" data-reveal>
              <Counter to={25} suffix="+" label="Global Farms" />
              <Counter to={98} suffix="%" label="Purity Assurance" />
              <Counter to={40} suffix="K" label="Premium Orders" />
              <Counter to={12} suffix="h" label="Dispatch Window" />
            </div>
          </div>
        </section>

        <StatsBar />

        <BestSellersShowcase products={products} hideQuickAdd={true} hidePrice={true} onProductClick={(product) => setSelectedProduct(product)} />

        {/* Products section removed per request */}

        <WhyChooseUs />

        <section id="about" className="relative px-6 py-28 md:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 ambient-glow md:grid-cols-[1.1fr_0.9fr] md:p-12">
            <div data-reveal>
              <p className="text-xs uppercase tracking-[0.32em] text-brand-mist">Harvest Story</p>
              <h2 className="mt-4 text-4xl text-white md:text-6xl">From Orchard Dawn to Luxury Evenings</h2>
              <p className="mt-6 max-w-xl text-white/72">
                Every lot is sourced in small seasonal windows, then slowly graded for texture, aroma and nutrition. Our craftsmanship blends traditional purity with modern food science for premium freshness in every handful.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <span className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80">Cold-Stored</span>
                <span className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80">Lab Tested</span>
                <span className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80">Ethical Farms</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4" data-reveal>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <Leaf className="h-8 w-8 text-brand-gold" />
                <p className="mt-5 text-lg text-white">Traceable sourcing from certified orchards.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <Sparkles className="h-8 w-8 text-brand-gold" />
                <p className="mt-5 text-lg text-white">Premium roast and polish profiles.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <Trophy className="h-8 w-8 text-brand-gold" />
                <p className="mt-5 text-lg text-white">Award-grade curation standards.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <Star className="h-8 w-8 text-brand-gold" />
                <p className="mt-5 text-lg text-white">Loved by families and gifting experts.</p>
              </div>
            </div>
          </div>
        </section>

        <CustomerReviews />

        <LuxuryBanner handleShopCollection={handleShopCollection} />

        <section className="px-6 pb-28 md:px-12" data-reveal>
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-brand-gold/30 bg-gradient-to-r from-[#0b261d] via-[#0f3226] to-[#123a2e] p-8 md:p-12 ambient-glow">
            <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-mist">Luxury Newsletter</p>
                <h3 className="mt-4 text-4xl text-white md:text-5xl">Join the Inner Harvest Circle</h3>
                <p className="mt-4 max-w-xl text-white/75">
                  Receive first access to rare arrivals, festive edit drops and chef inspired pairings from Sai Kripa Nuts.
                </p>
              </div>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-white/20 bg-black/20 px-6 py-4 text-sm text-white placeholder:text-white/45 focus:border-brand-gold focus:outline-none"
                />
                <button className="w-full rounded-full border border-brand-gold bg-brand-gold px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#102017] transition hover:bg-brand-mist">
                  Reserve Membership
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {selectedProduct ? (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(productWithVariant, quantity, variantId) => {
            addItem(productWithVariant, quantity, variantId);
            showToast('Added to cart');
          }}
          hideAddToCart={true}
          hidePricing={true}
        />
      ) : null}

      <Footer />
    </div>
  );
};

export default Home;
