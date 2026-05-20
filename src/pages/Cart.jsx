import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [checkout, setCheckout] = useState({ name: '', phone: '', address: '' });

  const navigate = useNavigate();
  const deliveryFee = useMemo(() => (items.length > 0 ? 79 : 0), [items.length]);
  const total = subtotal + deliveryFee;

  const normalizeCartItem = (item) => ({
    ...item,
    name: item?.name || 'Unnamed Product',
    image: item?.image || item?.images?.[0] || '/placeholder-product.jpg',
    price: item?.price || item?.prices?.price500 || item?.prices?.price250 || item?.prices?.price1000 || 0,
    quantity: Number(item?.quantity) || 0,
  });

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    if (items.length === 0) {
      return;
    }
    const orderId = `SKN${Date.now()}`;

    const newOrder = {
      id: orderId,
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

    // Update inventory: subtract ordered quantities from stored inventory
    try {
      const savedInventory = JSON.parse(localStorage.getItem('inventory')) || {};
      items.forEach((it) => {
        const current = parseFloat(savedInventory[it.id] || 0) || 0;
        const deduct = parseFloat(it.quantity) || 0;
        const newVal = Math.max(0, current - deduct);
        savedInventory[it.id] = Number.isFinite(newVal) ? newVal : 0;
      });
      localStorage.setItem('inventory', JSON.stringify(savedInventory));
      // Notify other parts of the app (same-tab) that inventory changed
      window.dispatchEvent(new Event('inventoryUpdated'));
    } catch (err) {
      console.error('Error updating inventory after order:', err);
    }

    clearCart();
    setCheckout({ name: '', phone: '', address: '' });

    // Navigate to success screen
    navigate('/order-success', { state: { orderId } });
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream pt-28">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-16 md:px-12">
        <h1 className="text-4xl text-white md:text-6xl">Your Cart</h1>
        <p className="mt-3 text-white/70">Select multiple products, update quantities, and place one combined order.</p>
        <div className="mt-6 flex items-center justify-end">
          <Link to="/checkout" className="rounded-full border border-brand-gold bg-brand-gold/10 px-5 py-2 text-sm font-semibold text-brand-gold hover:bg-brand-gold/20">
            Proceed to Checkout
          </Link>
        </div>

        

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/70">
                Your cart is empty. Add products from the collection page.
              </div>
            ) : (
              items.map((item) => {
                const safeItem = normalizeCartItem(item);
                return (
                <div key={`${safeItem.id}-${safeItem.variantId || 'default'}`} className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <img src={safeItem.image} alt={safeItem.name} loading="lazy" decoding="async" className="h-20 w-20 rounded-2xl bg-white/10 object-cover" />
                  <div className="min-w-[180px] flex-1">
                    <h3 className="text-lg text-white">{safeItem.name}</h3>
                    <p className="text-sm text-white/60">{safeItem.origin || safeItem.category || ''}</p>
                    {safeItem.variant && (
                      <p className="text-xs text-brand-gold mt-1">Weight: {safeItem.variant.weight}</p>
                    )}
                    <p className="mt-1 text-brand-gold">INR {(safeItem.price ?? 0).toLocaleString()}</p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={safeItem.quantity}
                    onChange={(event) => updateQuantity(safeItem.id, event.target.value, safeItem.variantId)}
                    className="w-20 rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-white focus:border-brand-gold focus:outline-none"
                  />

                  <p className="w-28 text-right text-white">INR {(((safeItem.price ?? 0) * (Number(safeItem.quantity) || 0)) ?? 0).toLocaleString()}</p>

                  <button
                    onClick={() => removeItem(safeItem.id, safeItem.variantId)}
                    className="rounded-full border border-white/20 p-2 text-white/70 transition hover:border-red-300 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                );
              })
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
                  <span>INR {(subtotal ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>INR {(deliveryFee ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base text-white">
                  <span>Total</span>
                  <span>INR {(total ?? 0).toLocaleString()}</span>
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
