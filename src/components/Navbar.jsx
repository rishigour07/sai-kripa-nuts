import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { cn } from '../utils/cn';
import logoImg from '../assets/PHOTO-2026-05-15-21-40-51.jpg';

const Navbar = ({ isHome = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const navBackground = (isHome && !scrolled) 
    ? 'bg-transparent text-white py-6' 
    : 'glass-dark text-white py-4 shadow-lg';

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500',
        navBackground
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center">
          <img src={logoImg} alt="Sai Kripa Nuts" className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover border-2 border-brand-gold shadow-lg" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="font-medium text-sm uppercase tracking-widest relative group transition-colors duration-300 hover:text-brand-gold"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="hover:text-brand-gold transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="hover:text-brand-gold transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-current focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 w-full bg-brand-dark text-white overflow-hidden transition-all duration-500 ease-in-out',
          mobileMenuOpen ? 'max-h-screen py-6 border-t border-white/10' : 'max-h-0 py-0'
        )}
      >
        <div className="flex flex-col items-center space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-lg font-serif tracking-widest hover:text-brand-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
