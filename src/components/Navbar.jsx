import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import logoImg from '../assets/PHOTO-2026-05-15-21-40-51.webp';
import { cn } from '../utils/cn';
import { useCart } from '../context/CartContext';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Cart', href: '/cart' },
];

const Navbar = ({ isHome = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navTone = useMemo(() => {
    if (isHome && !scrolled) {
      return 'bg-transparent border-transparent';
    }

    return 'bg-[#081b15]/65 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]';
  }, [isHome, scrolled]);

  return (
    <header className="fixed inset-x-0 top-0 z-[70] px-4 pt-4 md:px-8">
      <nav
        className={cn(
          'mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl px-4 py-3 text-white transition-all duration-500 md:px-6',
          navTone
        )}
      >
        {/* Left: Hamburger (mobile) */}
        <div className="flex items-center md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-full border border-white/20 bg-white/5 p-2 text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Center: Logo */}
        <Link to="/" className="mx-auto flex items-center justify-center gap-3 md:mx-0">
          <img
            src={logoImg}
            alt="Sai Kripa Nuts"
            className="h-10 w-10 rounded-full border border-brand-gold/60 object-cover shadow-[0_8px_24px_rgba(200,169,107,0.3)] md:h-12 md:w-12"
          />
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-mist">Luxury Reserve</p>
            <p className="font-serif text-lg leading-tight">Sai Kripa Nuts</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="group relative py-2 text-xs uppercase tracking-[0.2em] text-white/85 transition hover:text-brand-gold"
              >
                {link.name}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-gold transition-transform duration-300 group-hover:scale-x-100" />
                {active ? (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-brand-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Right: Cart (always visible on mobile) */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Open cart"
            onClick={() => {
              // On small screens open mobile bottom sheet; on larger screens navigate to cart page
              if (window.innerWidth < 768) {
                window.dispatchEvent(new Event('openMobileCart'));
              } else {
                navigate('/cart');
              }
            }}
            className="relative rounded-full border border-white/20 bg-white/5 p-2 text-white"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-[#102017]">
              {totalItems}
            </span>
            <span className="sr-only">Open Cart</span>
          </button>
        </div>
      </nav>

      {/* Mobile slide menu + overlay */}
      { /* Overlay */ }
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-40 md:hidden"
        style={{ backdropFilter: mobileOpen ? 'blur(8px)' : 'none' }}
        onClick={() => setMobileOpen(false)}
      />

      <motion.aside
        initial={{ y: '100%' }}
        animate={{ y: mobileOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center md:hidden"
        aria-hidden={!mobileOpen}
      >
        <div className="relative mx-4 w-[95%] max-w-lg rounded-3xl bg-[#071a14] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div />
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <img src={logoImg} alt="Sai Kripa" className="h-10 w-10 rounded-full object-cover" />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="rounded-full p-2 text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-8 grid gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl px-4 py-4 text-center text-lg font-medium text-white/95 hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </motion.aside>
    </header>
  );
};

export default Navbar;
