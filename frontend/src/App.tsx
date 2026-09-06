import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { OffersPage } from './pages/OffersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';
import { AdminOrders } from './admin/AdminOrders';
import { AdminInventory } from './admin/AdminInventory';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminCoupons } from './admin/AdminCoupons';
import { AdminBanners } from './admin/AdminBanners';
import { AdminReports } from './admin/AdminReports';

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${isHome ? 'pt-0' : 'pt-[72px]'}`}>{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
              <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
              <Route path="/products/:slug" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
              <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
              <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
              <Route path="/order-success/:id" element={<CustomerLayout><OrderSuccessPage /></CustomerLayout>} />
              <Route path="/orders" element={<CustomerLayout><OrdersPage /></CustomerLayout>} />
              <Route path="/orders/:id" element={<CustomerLayout><OrderTrackingPage /></CustomerLayout>} />
              <Route path="/wishlist" element={<CustomerLayout><WishlistPage /></CustomerLayout>} />
              <Route path="/offers" element={<CustomerLayout><OffersPage /></CustomerLayout>} />
              <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
              <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
              <Route path="/profile" element={<CustomerLayout><ProfilePage /></CustomerLayout>} />
              <Route path="/login" element={<CustomerLayout><LoginPage /></CustomerLayout>} />
              <Route path="/register" element={<CustomerLayout><RegisterPage /></CustomerLayout>} />

              {/* Admin Portal Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
