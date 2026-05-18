import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag, User, X } from 'lucide-react';
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
          <button className="rounded-full border border-white/20 bg-white/5 p-2.5 transition hover:border-brand-gold hover:text-brand-gold">
            <User className="h-4 w-4" />
          </button>

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

        <button
          className="rounded-full border border-white/20 bg-white/5 p-2 text-white md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{
          opacity: mobileOpen ? 1 : 0,
          y: mobileOpen ? 0 : -12,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        className="mx-auto mt-3 w-full max-w-7xl rounded-2xl border border-white/10 bg-[#081b15]/95 p-5 backdrop-blur-2xl md:hidden"
      >
        <div className="space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block rounded-xl border px-4 py-3 text-sm uppercase tracking-[0.18em] transition',
                pathname === link.href
                  ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                  : 'border-white/10 bg-white/[0.02] text-white/80 hover:border-brand-gold hover:text-brand-gold'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
