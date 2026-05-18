import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Contact from './pages/Contact';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AddProduct from './pages/admin/AddProduct';
import ProductsList from './pages/admin/ProductsList';
import OrdersList from './pages/admin/OrdersList';
import InventoryList from './pages/admin/InventoryList';
import Dashboard from './pages/admin/Dashboard';
import ProfitLoss from './pages/admin/ProfitLoss';
import InvoiceView from './pages/admin/InvoiceView';
import ProtectedRoute from './components/ProtectedRoute';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        
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
    </Router>
  );
}

export default App;
