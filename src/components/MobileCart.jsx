import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileCart() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('openMobileCart', onOpen);
    return () => window.removeEventListener('openMobileCart', onOpen);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed left-0 right-0 bottom-0 z-50 h-[85vh] w-full md:hidden"
          >
            <div className="relative mx-auto h-full w-full max-w-3xl rounded-t-3xl bg-[#071a14] p-4 shadow-xl flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Your Cart</h3>
                <button onClick={() => setOpen(false)} className="rounded-full p-2 text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex-1 overflow-y-auto space-y-3 px-1">
                {items.length === 0 ? (
                  <div className="py-12 text-center text-sm text-white/60">Your cart is empty.</div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.variantId || 'default'}`} className="flex items-center justify-between gap-3 rounded-lg border border-white/6 p-3 bg-white/2">
                      <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="h-14 w-14 rounded object-cover" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-white truncate">{item.name}</div>
                        <div className="text-xs text-white/60">INR {item.price}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variantId)} className="px-3 py-1 rounded bg-white/5">-</button>
                          <div className="w-10 text-center text-white">{item.quantity}</div>
                          <button onClick={() => updateQuantity(item.id, Number(item.quantity) + 1, item.variantId)} className="px-3 py-1 rounded bg-white/5">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => removeItem(item.id, item.variantId)} className="text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="text-sm font-semibold text-white">INR {(((item.price ?? 0) * (Number(item.quantity) || 0)) ?? 0).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="sticky bottom-0 z-20 w-full border-t border-white/8 bg-gradient-to-b from-[#071a14]/80 to-[#071a14] p-4">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="text-sm text-white/70">Subtotal</div>
                    <div className="text-lg font-semibold">INR {(subtotal ?? 0).toLocaleString()}</div>
                  </div>
                  <div className="w-1/2">
                    <button onClick={() => { setOpen(false); window.location.href = '/checkout'; }} className="w-full rounded-2xl bg-brand-gold py-3 text-[#102017]">Checkout</button>
                  </div>
                </div>
                <div className="mt-3">
                  <button onClick={() => { clearCart(); }} className="w-full rounded-2xl border border-white/10 py-3 text-white/80">Clear Cart</button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
