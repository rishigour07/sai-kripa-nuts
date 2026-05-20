import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '', city: '', pincode: '' });

  const deliveryFee = useMemo(() => (items.length > 0 ? 79 : 0), [items.length]);
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderId = `SKN${Date.now()}`;
    const newOrder = {
      id: orderId,
      items,
      customer,
      subtotal,
      deliveryFee,
      total,
      orderDate: new Date().toISOString(),
      status: 'placed',
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));

    clearCart();
    navigate('/order-success', { state: { orderId } });
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream pt-28">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-16 md:px-12">
        <h1 className="text-4xl text-white md:text-6xl">Checkout</h1>
        <p className="mt-3 text-white/70">Fill in your details and place the order securely.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <form onSubmit={handlePlaceOrder} className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <input required value={customer.name} onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white" />
            <input required value={customer.phone} onChange={(e) => setCustomer((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone number" className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white" />
            <input required value={customer.email} onChange={(e) => setCustomer((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white" />
            <input required value={customer.city} onChange={(e) => setCustomer((p) => ({ ...p, city: e.target.value }))} placeholder="City" className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white" />
            <input required value={customer.pincode} onChange={(e) => setCustomer((p) => ({ ...p, pincode: e.target.value }))} placeholder="Pincode" className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white" />
            <textarea required value={customer.address} onChange={(e) => setCustomer((p) => ({ ...p, address: e.target.value }))} placeholder="Address" rows={4} className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white" />

            <button type="submit" className="w-full rounded-full border border-brand-gold bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#102017] transition">
              Place Order — INR {(total ?? 0).toLocaleString()}
            </button>
          </form>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl text-white">Order Summary</h2>
            <div className="mt-4 space-y-4">
              {items.map((it) => (
                <div key={`${it.id}-${it.variantId || 'default'}`} className="flex items-center gap-4">
                  <img src={it.image} alt={it.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-white">{it.name}</div>
                    <div className="text-sm text-white/60">{it.variant?.weight || it.selectedWeight}</div>
                    <div className="text-sm text-brand-gold">INR {(it.price ?? 0).toLocaleString()} × {it.quantity}</div>
                  </div>
                  <div className="text-white">INR {(((it.price ?? 0) * (Number(it.quantity) || 0)) ?? 0).toLocaleString()}</div>
                </div>
              ))}

              <div className="mt-4 border-t border-white/10 pt-4 text-sm text-white/80">
                <div className="flex justify-between"><span>Subtotal</span><span>INR {(subtotal ?? 0).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>INR {(deliveryFee ?? 0).toLocaleString()}</span></div>
                <div className="mt-2 flex justify-between text-white"><span>Total</span><span>INR {(total ?? 0).toLocaleString()}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
