import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MapPin, Phone, Mail } from 'lucide-react';
import logoImg from '../assets/PHOTO-2026-05-15-21-40-51.jpg';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-cream pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <img src={logoImg} alt="Sai Kripa Nuts" className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border-2 border-brand-gold shadow-lg mb-6" />
            <p className="text-white/70 mb-6 font-light leading-relaxed">
              Premium quality dry fruits and nuts sourced from the finest farms around the globe. Pure, natural, and rich in taste.
            </p>
            <div className="flex space-x-4">
              <a href="/" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-colors duration-300">
                <Globe className="w-4 h-4" />
              </a>
              <a href="/" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-colors duration-300">
                <Globe className="w-4 h-4" />
              </a>
              <a href="/" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-colors duration-300">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-brand-gold">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Shop All', href: '/products' },
                { name: 'Our Story', href: '/about' },
                { name: 'Contact Us', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/70 hover:text-white transition-colors duration-300 flex items-center">
                    <span className="w-2 h-[1px] bg-brand-gold mr-3"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-brand-gold">Customer Service</h3>
            <ul className="space-y-4">
              {['Shipping Policy', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href="/" className="text-white/70 hover:text-white transition-colors duration-300 flex items-center">
                    <span className="w-2 h-[1px] bg-brand-gold mr-3"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif mb-6 text-brand-gold">Contact Us</h3>
            <ul className="space-y-4 text-white/70 font-light">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                <span>Shree Dhar Rao Gadre, Market New Market, Timarni, District - Harda (M.P.)</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-brand-gold mr-3 flex-shrink-0" />
                <span>+91 77229 25011</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-brand-gold mr-3 flex-shrink-0" />
                <span>Gurjarpritam443@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Sai Kripa Nuts. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <span className="mr-4 text-white/50">100% Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

