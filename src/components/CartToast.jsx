import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CartToast = () => {
  const { toast } = useCart();

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed left-1/2 top-20 z-[9999] w-auto -translate-x-1/2 rounded-full bg-black/80 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm"
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;
