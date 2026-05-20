import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const parsePrice = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  return Number(String(value).replace(/,/g, '')) || 0;
};

const normalizeProduct = (product) => ({
  ...product,
  id: product?._id || product?.id,
  name: product?.name || 'Unnamed Product',
  description: product?.description || product?.shortDescription || product?.shortDesc || 'No description available',
  image: product?.image || product?.images?.[0] || '/placeholder-product.jpg',
  prices: {
    price250: product?.prices?.price250 || product?.price250 || 0,
    price500: product?.prices?.price500 || product?.price500 || 0,
    price1000: product?.prices?.price1000 || product?.price1000 || 0,
  },
  stock: product?.stock || 0,
});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartItems')) || [];
    } catch (_error) {
      return [];
    }
  });

  // Simple toast state for global notifications
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message, duration = 1800) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), duration);
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, variantId = null) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const normalizedProduct = normalizeProduct(product);

    const derivedPrice = parsePrice(
      normalizedProduct.selectedPrice ||
      normalizedProduct.price ||
      normalizedProduct.prices?.price500 ||
      normalizedProduct.prices?.price250 ||
      normalizedProduct.prices?.price1000 ||
      0
    );

    setItems((prev) => {
      // For variant products, use variantId to create unique cart items
      const existingIndex = prev.findIndex((item) => {
        if (variantId) {
          return item.variantId === variantId && item.id === normalizedProduct.id;
        }
        return item.id === normalizedProduct.id && !item.variantId;
      });

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }

      const newItem = {
        id: normalizedProduct.id,
        name: normalizedProduct.name,
        image: normalizedProduct.image,
        price: derivedPrice,
        origin: normalizedProduct.origin || normalizedProduct.category || normalizedProduct.subtitle || '',
        description: normalizedProduct.description,
        prices: normalizedProduct.prices,
        quantity: qty,
      };

      // Add variant info if present
      if (variantId) {
        newItem.variantId = variantId;
        newItem.variant = normalizedProduct.variant || normalizedProduct.variants?.find((variant) => variant.id === variantId) || null; // Store variant details (weight, price, etc)
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
      // Toast helper
      toast,
      showToast,
    }),
    [items, totals.totalItems, totals.subtotal, toast]
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
