import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || 'N/A';

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream pt-28">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-16 md:px-12 text-center">
        <div className="mt-20 rounded-2xl border border-brand-gold/30 bg-white/[0.03] p-10">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-brand-gold" />
          <h1 className="text-3xl font-bold text-white">Order Placed Successfully</h1>
          <p className="mt-3 text-white/70">Thank you for your purchase. We are preparing your order.</p>

          <div className="mt-6 inline-block rounded-lg border border-white/10 bg-black/20 px-6 py-4 text-left">
            <div className="text-sm text-white/70">Order ID</div>
            <div className="mt-1 font-mono text-lg font-bold text-white">{orderId}</div>
          </div>

          <div className="mt-8">
            <Link to="/" className="rounded-full border border-brand-gold bg-brand-gold/10 px-6 py-3 text-sm font-semibold text-brand-gold">Continue Shopping</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
