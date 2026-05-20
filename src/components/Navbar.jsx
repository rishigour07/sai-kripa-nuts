import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import logoImg from '../assets/PHOTO-2026-05-15-21-40-51.jpg';
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
        <Link to="/" className="group flex items-center gap-3">
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

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart">
            <motion.button
              whileHover={{ rotate: -6, scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="relative rounded-full border border-white/20 bg-white/5 p-2.5 transition hover:border-brand-gold hover:text-brand-gold"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-[#102017]">
                {totalItems}
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Mobile controls: cart + menu */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            aria-label="Open cart"
            onClick={() => window.dispatchEvent(new Event('openMobileCart'))}
            className="rounded-full border border-white/20 bg-white/5 p-2 text-white"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Open Cart</span>
          </button>

          <button
            className="rounded-full border border-white/20 bg-white/5 p-2 text-white"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile slide menu + overlay */}
      { /* Overlay */ }
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={() => setMobileOpen(false)}
      />

      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: mobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="fixed left-0 top-0 z-50 h-full w-72 bg-[#081b15] p-6 md:hidden shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
            <img src={logoImg} alt="Sai Kripa" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-sm font-semibold text-white">Sai Kripa</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="rounded-full p-2 text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-md px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/5"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </motion.aside>
    </header>
  );
};

export default Navbar;
