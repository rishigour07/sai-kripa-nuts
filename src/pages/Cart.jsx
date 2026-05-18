import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkout, setCheckout] = useState({ name: '', phone: '', address: '' });

  const deliveryFee = useMemo(() => (items.length > 0 ? 79 : 0), [items.length]);
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    if (items.length === 0) {
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      items,
      customer: checkout,
      subtotal,
      deliveryFee,
      total,
      orderDate: new Date().toISOString(),
      status: 'placed',
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));

    clearCart();
    setCheckout({ name: '', phone: '', address: '' });
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 2500);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream pt-28">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-16 md:px-12">
        <h1 className="text-4xl text-white md:text-6xl">Your Cart</h1>
        <p className="mt-3 text-white/70">Select multiple products, update quantities, and place one combined order.</p>

        {orderPlaced ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-5 text-brand-mist"
          >
            Order placed successfully. Our team will contact you shortly.
          </motion.div>
        ) : null}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/70">
                Your cart is empty. Add products from the collection page.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl bg-white/10 object-cover" />
                  <div className="min-w-[180px] flex-1">
                    <h3 className="text-lg text-white">{item.name}</h3>
                    <p className="text-sm text-white/60">{item.origin}</p>
                    <p className="mt-1 text-brand-gold">INR {item.price.toLocaleString()}</p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.id, event.target.value)}
                    className="w-20 rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-white focus:border-brand-gold focus:outline-none"
                  />

                  <p className="w-28 text-right text-white">INR {(item.price * item.quantity).toLocaleString()}</p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-full border border-white/20 p-2 text-white/70 transition hover:border-red-300 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 ambient-glow">
            <h2 className="text-2xl text-white">Checkout</h2>
            <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
              <input
                required
                type="text"
                value={checkout.name}
                onChange={(event) => setCheckout((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Full name"
                className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white placeholder:text-white/45 focus:border-brand-gold focus:outline-none"
              />
              <input
                required
                type="tel"
                value={checkout.phone}
                onChange={(event) => setCheckout((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Phone number"
                className="w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white placeholder:text-white/45 focus:border-brand-gold focus:outline-none"
              />
              <textarea
                required
                rows="3"
                value={checkout.address}
                onChange={(event) => setCheckout((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="Delivery address"
                className="w-full resize-none rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white placeholder:text-white/45 focus:border-brand-gold focus:outline-none"
              />

              <div className="space-y-2 border-y border-white/10 py-4 text-sm text-white/75">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>INR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>INR {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base text-white">
                  <span>Total</span>
                  <span>INR {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full rounded-full border border-brand-gold bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#102017] transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Place Combined Order
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
