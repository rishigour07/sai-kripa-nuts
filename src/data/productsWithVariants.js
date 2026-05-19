import almonds from '../assets/almonds_product.png';
import pistachio from '../assets/pistachio_product.png';
import kaju from '../assets/kaju_product.png';
import anjir from '../assets/anjir_product.png';

export const allProductsWithVariants = [
  {
    id: 1,
    name: 'Kaju W320',
    origin: 'Premium W320 Grade Cashews',
    image: kaju,
    isNew: true,
    variants: [
      { id: '1-200', weight: '200gm', price: 220, discountPrice: null, stock: 50 },
      { id: '1-500', weight: '500gm', price: 520, discountPrice: null, stock: 50 },
      { id: '1-1kg', weight: '1kg', price: 999, discountPrice: 949, stock: 50 },
    ],
    defaultVariantId: '1-1kg',
  },
  {
    id: 2,
    name: 'Kaju W240',
    origin: 'Premium W240 Grade Cashews',
    image: kaju,
    variants: [
      { id: '2-200', weight: '200gm', price: 210, discountPrice: null, stock: 50 },
      { id: '2-500', weight: '500gm', price: 500, discountPrice: null, stock: 50 },
      { id: '2-1kg', weight: '1kg', price: 950, discountPrice: 899, stock: 50 },
    ],
    defaultVariantId: '2-500',
  },
  {
    id: 3,
    name: 'Badam American',
    origin: 'American Almonds',
    image: almonds,
    variants: [
      { id: '3-200', weight: '200gm', price: 220, discountPrice: null, stock: 50 },
      { id: '3-500', weight: '500gm', price: 520, discountPrice: null, stock: 50 },
      { id: '3-1kg', weight: '1kg', price: 999, discountPrice: 949, stock: 50 },
    ],
    defaultVariantId: '3-500',
  },
  {
    id: 4,
    name: 'Badam Independent',
    origin: 'Independent Almonds',
    image: almonds,
    variants: [
      { id: '4-200', weight: '200gm', price: 210, discountPrice: null, stock: 50 },
      { id: '4-500', weight: '500gm', price: 500, discountPrice: null, stock: 50 },
      { id: '4-1kg', weight: '1kg', price: 950, discountPrice: null, stock: 50 },
    ],
    defaultVariantId: '4-1kg',
  },
  {
    id: 5,
    name: 'Pista',
    origin: 'Roasted Pistachios',
    image: pistachio,
    variants: [
      { id: '5-200', weight: '200gm', price: 310, discountPrice: null, stock: 50 },
      { id: '5-500', weight: '500gm', price: 750, discountPrice: null, stock: 50 },
      { id: '5-1kg', weight: '1kg', price: 1499, discountPrice: 1399, stock: 50 },
    ],
    defaultVariantId: '5-500',
  },
  {
    id: 6,
    name: 'Anjir',
    origin: 'Dried Figs',
    image: anjir,
    variants: [
      { id: '6-200', weight: '200gm', price: 260, discountPrice: null, stock: 50 },
      { id: '6-500', weight: '500gm', price: 620, discountPrice: null, stock: 50 },
      { id: '6-1kg', weight: '1kg', price: 1199, discountPrice: 1099, stock: 50 },
    ],
    defaultVariantId: '6-1kg',
  },
];

// Helper function to get product with variant
export const getProductVariant = (productId, variantId) => {
  const product = allProductsWithVariants.find((p) => p.id === productId);
  if (!product) return null;
  
  const variant = product.variants.find((v) => v.id === variantId);
  return { product, variant };
};

// Helper function to get default variant for product
export const getDefaultVariant = (productId) => {
  const product = allProductsWithVariants.find((p) => p.id === productId);
  if (!product) return null;
  
  const variant = product.variants.find((v) => v.id === product.defaultVariantId);
  return { product, variant };
};
