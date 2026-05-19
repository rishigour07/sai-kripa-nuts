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

  const addItem = (product, quantity = 1, variantId = null) => {
    const qty = Math.max(1, Number(quantity) || 1);

    setItems((prev) => {
      // For variant products, use variantId to create unique cart items
      const existingIndex = prev.findIndex((item) => {
        if (variantId) {
          return item.variantId === variantId && item.id === product.id;
        }
        return item.id === product.id && !item.variantId;
      });

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }

      const newItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: parsePrice(product.price),
        origin: product.origin || product.subtitle || '',
        quantity: qty,
      };

      // Add variant info if present
      if (variantId) {
        newItem.variantId = variantId;
        newItem.variant = product.variant; // Store variant details (weight, price, etc)
      }

      return [...prev, newItem];
    });
  };

  const removeItem = (productId, variantId = null) => {
    setItems((prev) => {
      if (variantId) {
        return prev.filter((item) => !(item.id === productId && item.variantId === variantId));
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId, quantity, variantId = null) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setItems((prev) => {
      if (variantId) {
        return prev.map((item) =>
          item.id === productId && item.variantId === variantId
            ? { ...item, quantity: qty }
            : item
        );
      }
      return prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item));
    });
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
