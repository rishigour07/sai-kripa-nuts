import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, Sparkles, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-[#050f0c] px-6 pb-10 pt-20 md:px-12">
      <div className="absolute inset-x-0 top-0 h-px luxury-divider" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-brand-mist">Sai Kripa Nuts</p>
            <h3 className="mt-4 max-w-md text-4xl text-white md:text-5xl">Luxury Dry Fruit Curation for Modern Tables.</h3>
            <p className="mt-5 max-w-md text-white/68">
              Crafted for gifting, wellness and everyday indulgence with elite quality checks and cinematic presentation.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {[Globe, Star, Sparkles].map((Icon, index) => (
                <button
                  key={index}
                  className="rounded-full border border-white/20 bg-white/[0.03] p-3 text-white/75 transition hover:-translate-y-1 hover:border-brand-gold hover:text-brand-gold"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-brand-mist">Explore</p>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Products', path: '/products' },
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="group flex items-center text-white/75 transition hover:text-brand-gold"
                >
                  <span className="mr-3 h-px w-6 bg-white/25 transition group-hover:w-10 group-hover:bg-brand-gold" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-brand-mist">Private Concierge</p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-white/70">Need bulk gifting or wedding hampers?</p>
              <p className="mt-4 flex items-center text-white/90">
                <Phone className="mr-2 h-4 w-4 text-brand-gold" />
                +91 77229 25011
              </p>
              <p className="mt-3 flex items-center text-white/90">
                <Mail className="mr-2 h-4 w-4 text-brand-gold" />
                support@saikripanuts.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-sm text-white/45 md:flex md:items-center md:justify-between">
          <p>Copyright {new Date().getFullYear()} Sai Kripa Nuts. All rights reserved.</p>
          <p className="mt-3 md:mt-0">Premium freshness sealed with secure checkout.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
