import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const parsePrice = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  return Number(String(value).replace(/,/g, '')) || 0;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartItems')) || [];
    } catch (_error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);

    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + qty } : item));
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: parsePrice(product.price),
          origin: product.origin || product.subtitle || '',
          quantity: qty,
        },
      ];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totals = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItems, subtotal };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems: totals.totalItems,
      subtotal: totals.subtotal,
    }),
    [items, totals.totalItems, totals.subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};
