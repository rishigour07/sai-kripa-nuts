import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
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
import almonds from '../assets/almonds_product.png';
import pistachio from '../assets/pistachio_product.png';
import kaju from '../assets/kaju_product.png';
import anjir from '../assets/anjir_product.png';
import walnuts from '../assets/walnuts_product.png';
import dates from '../assets/dates_product.png';

gsap.registerPlugin(ScrollTrigger);

const nutBodies = [
  { kind: 'almond', color: '#a57641', position: [-3.1, 1.6, -1], speed: 0.36, scale: 0.62 },
  { kind: 'cashew', color: '#d3bc8f', position: [2.7, 0.9, -0.4], speed: 0.29, scale: 0.7 },
  { kind: 'walnut', color: '#7b5336', position: [1.4, -1.8, -1.8], speed: 0.25, scale: 0.58 },
  { kind: 'pistachio', color: '#b9b280', position: [-1.8, -1.5, -0.25], speed: 0.34, scale: 0.66 },
  { kind: 'almond', color: '#986436', position: [0.25, 2.2, -2.4], speed: 0.22, scale: 0.5 },
];

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

const filters = ['All', 'Signature', 'Raw', 'Roasted', 'Wellness'];
const heroHeading = 'Sai Kripa Nuts';

const NutMesh = ({ kind, color, position, scale, speed }) => {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const t = clock.getElapsedTime() * speed;
    mesh.rotation.y = t;
    mesh.rotation.x = t * 0.7;
    mesh.position.y = position[1] + Math.sin(t * 1.2) * 0.2;
  });

  let geometry;
  if (kind === 'cashew') {
    geometry = <torusGeometry args={[0.48, 0.16, 24, 48, Math.PI * 1.3]} />;
  } else if (kind === 'walnut') {
    geometry = <icosahedronGeometry args={[0.45, 1]} />;
  } else if (kind === 'pistachio') {
    geometry = <sphereGeometry args={[0.42, 32, 28]} />;
  } else {
    geometry = <sphereGeometry args={[0.45, 32, 28]} />;
  }

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.55}>
      <mesh ref={meshRef} position={position} scale={scale} castShadow>
        {geometry}
        <meshStandardMaterial
          color={color}
          metalness={0.18}
          roughness={0.46}
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
};

const NutsScene = () => (
  <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }} dpr={[1, 1.5]}>
    <color attach="background" args={['#081a14']} />
    <fog attach="fog" args={['#081a14', 4.8, 13]} />
    <ambientLight intensity={0.7} />
    <directionalLight position={[2, 5, 4]} intensity={1.6} color="#f2dfb2" />
    <pointLight position={[-3, 1.5, 3]} intensity={1} color="#ffe1a5" />
    <pointLight position={[3, -2, 1]} intensity={0.7} color="#4aa084" />
    <Suspense fallback={null}>
      {nutBodies.map((nut) => (
        <NutMesh key={`${nut.kind}-${nut.position.join('-')}`} {...nut} />
      ))}
    </Suspense>
  </Canvas>
);

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
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const scopeRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 22, mass: 0.2 });

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') {
      return products;
    }

    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  const handleShopCollection = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoading(false), 1900);

    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
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
    const onMove = (event) => {
      setMouse({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
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
      <div className="mouse-glow" style={{ transform: `translate(${mouse.x - 190}px, ${mouse.y - 190}px)` }} />

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
            <NutsScene />
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

        <BestSellersShowcase products={products} hideQuickAdd={true} />

        <section id="products" className="relative overflow-hidden px-4 py-16 sm:px-6 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between" data-reveal>
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.34em] text-brand-mist">Curated Harvest</p>
                <h2 className="mt-3 text-3xl leading-tight text-white sm:text-4xl md:text-6xl">Luxury Bento Selection</h2>
              </div>

              <div className="flex max-w-full gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition md:px-5 md:text-xs ${
                      activeFilter === filter
                        ? 'border-brand-gold bg-brand-gold text-[#102017]'
                        : 'border-white/20 bg-white/[0.03] text-white/80 hover:border-brand-gold hover:text-brand-gold'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5" data-reveal>
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleProductClick(product);
                    }
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-4 sm:p-5 md:p-6 ambient-glow"
                >
                  <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                    <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-brand-gold/25 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-emerald-300/20 blur-3xl" />
                  </div>

                  <div className="relative flex h-full min-h-[320px] flex-col justify-between gap-4 sm:min-h-[340px]">
                    <div>
                      <span className="inline-flex rounded-full border border-brand-gold/50 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-mist">
                        {product.badge}
                      </span>
                      <h3 className="mt-4 text-xl leading-tight text-white sm:text-2xl lg:text-3xl">{product.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-[0.95rem]">{product.subtitle}</p>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="h-24 w-24 rounded-2xl border border-white/20 bg-white/10 object-contain p-2 sm:h-28 sm:w-28 md:mx-0"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/55">From</p>
                        <p className="mt-1 text-2xl font-semibold text-brand-gold">INR {product.price}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-brand-gold/80" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

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
        />
      ) : null}

      <Footer />
    </div>
  );
};

export default Home;
