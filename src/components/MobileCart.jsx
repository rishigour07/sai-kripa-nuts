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
            className="fixed left-0 right-0 bottom-0 z-50 h-[85vh] w-full bg-white p-4 rounded-t-2xl shadow-xl md:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-dark">Your Cart</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 text-brand-dark">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500">Your cart is empty.</div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.variantId || 'default'}`} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded object-cover" />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-brand-dark truncate">{item.name}</div>
                      <div className="text-xs text-gray-600">INR {item.price}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variantId)} className="px-3 py-1 rounded bg-gray-100">-</button>
                        <div className="w-10 text-center">{item.quantity}</div>
                        <button onClick={() => updateQuantity(item.id, Number(item.quantity) + 1, item.variantId)} className="px-3 py-1 rounded bg-gray-100">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeItem(item.id, item.variantId)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="text-sm font-semibold text-brand-dark">INR {(((item.price ?? 0) * (Number(item.quantity) || 0)) ?? 0).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-lg font-semibold text-brand-dark">INR {(subtotal ?? 0).toLocaleString()}</div>
              </div>

              <div className="mt-4 grid gap-3">
                <button onClick={() => { setOpen(false); window.location.href = '/checkout'; }} className="w-full rounded-lg bg-[#0E4B32] py-3 text-white">Checkout</button>
                <button onClick={() => { clearCart(); }} className="w-full rounded-lg border border-gray-300 py-3">Clear Cart</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
