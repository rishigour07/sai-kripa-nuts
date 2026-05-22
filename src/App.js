import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CartToast from './components/CartToast';
import WhatsAppButton from './components/WhatsAppButton';
import MobileCart from './components/MobileCart';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded pages for sub-routes
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Products = lazy(() => import('./pages/Products'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));

// Admin pages lazy loaded
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductsList = lazy(() => import('./pages/admin/ProductsList'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const OrdersList = lazy(() => import('./pages/admin/OrdersList'));
const InventoryList = lazy(() => import('./pages/admin/InventoryList'));
const ProfitLoss = lazy(() => import('./pages/admin/ProfitLoss'));
const InvoiceView = lazy(() => import('./pages/admin/InvoiceView'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Premium loading fallback for code split routes
const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#040c09] z-[100]">
    <div className="text-center animate-pulse">
      <p className="text-xs uppercase tracking-[0.55em] text-brand-mist">Loading Sai Kripa Nuts...</p>
      <div className="mx-auto mt-4 h-[2px] w-36 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-full bg-gradient-to-r from-brand-brass via-brand-gold to-brand-mist" />
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartToast />
      <WhatsAppButton />
      <MobileCart />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="profit-loss" element={<ProfitLoss />} />
            <Route path="invoice/:orderId" element={<InvoiceView />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
