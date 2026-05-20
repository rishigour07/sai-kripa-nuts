import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { safeReadJSON, safeReadString } from '../utils/storage';

const PHONE_WA = '917722925011';
const WA_BASE = `https://wa.me/${PHONE_WA}`;

const WhatsAppButton = () => {
  const { items, subtotal } = useCart();

  const buildItemsFromOrder = (order) => {
    if (!order || !Array.isArray(order.items)) {
      return [];
    }

    return order.items;
  };

  const buildMessage = () => {
    const fallbackOrder = safeReadJSON('lastOrder', null);
    const fallbackCustomer = safeReadJSON('lastCustomer', null);
    const messageItems = items && items.length > 0 ? items : buildItemsFromOrder(fallbackOrder);

    if (!messageItems || messageItems.length === 0) return '';

    let lines = [];
    lines.push('Hello Sai Kripa Nuts,');
    lines.push('');
    lines.push('I want to place an order:');
    lines.push('');
    lines.push('Product Details:');

    messageItems.forEach((it) => {
      const name = it.name || 'Product';
      const weight = (it.variant && it.variant.weight) || it.selectedWeight || 'Standard Pack';
      const qty = it.quantity || 1;
      const price = it.price || 0;

      lines.push('');
      lines.push(`Product: ${name}`);
      lines.push(`Weight: ${weight}`);
      lines.push(`Quantity: ${qty}`);
      lines.push(`Price: ₹${price}`);
    });

    const messageTotal = items && items.length > 0
      ? subtotal
      : Number(fallbackOrder?.total ?? fallbackOrder?.subtotal ?? 0);

    lines.push('');
    lines.push(`Total Amount: ₹${(messageTotal ?? 0).toLocaleString()}`);

    const storedName = safeReadString('customerName', fallbackCustomer?.name || '');
    const storedPhone = safeReadString('customerPhone', fallbackCustomer?.phone || '');
    const storedEmail = safeReadString('customerEmail', fallbackCustomer?.email || '');
    lines.push('');
    lines.push(`Customer Name: ${storedName}`);
    if (storedPhone) {
      lines.push(`Phone: ${storedPhone}`);
    }
    if (storedEmail) {
      lines.push(`Email: ${storedEmail}`);
    }
    lines.push('');
    lines.push('Please confirm my order.');

    return lines.join('\n');
  };

  const handleClick = (e) => {
    e.preventDefault();
    const message = buildMessage();
    if (!message) {
      // open plain chat
      window.open(WA_BASE, '_blank');
      return;
    }

    const encoded = encodeURIComponent(message);
    const url = `${WA_BASE}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.05 }}
      className="fixed z-50 bottom-6 right-6"
      aria-label="Contact via WhatsApp"
    >
        <div className="flex items-center justify-center h-14 w-14 rounded-full shadow-lg" style={{ background: '#071b16', border: '2px solid rgba(212,175,55,0.95)' }}>
          <MessageSquare className="text-brand-gold" style={{ color: '#d4af37', width: 26, height: 26 }} />
        </div>
    </motion.button>
  );
};

export default WhatsAppButton;
