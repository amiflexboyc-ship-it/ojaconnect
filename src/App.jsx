import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ExplorePage from './pages/ExplorePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import BecomeSellerPage from './pages/BecomeSellerPage';
import OrdersPage from './pages/OrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import ProfilePage from './pages/ProfilePage';

// ProtectedRoute Auth Gate
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-deep-green border-t-fresh-green rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-deep-green">Verifying Lagos Market Access...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-cream relative">
      <Navbar />
      
      {/* Main Content with bottom padding on mobile if authenticated */}
      <div className={`flex-1 ${user ? 'pb-20 md:pb-0' : 'pb-0'}`}>
        <Routes>
          {/* Public Authentication Gateways */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - Requiring Email or Phone Sign Up */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/become-seller" element={<ProtectedRoute><BecomeSellerPage /></ProtectedRoute>} />
          <Route path="/seller/dashboard" element={<ProtectedRoute><SellerDashboardPage /></ProtectedRoute>} />
          <Route path="/seller-dashboard" element={<ProtectedRoute><SellerDashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={
            user ? (
              <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center">
                  <h1 className="text-5xl md:text-6xl font-bold text-deep-green font-heading mb-3">404</h1>
                  <p className="text-gray-500 mb-6 text-sm">Market page not found</p>
                  <a href="/" className="px-6 py-3 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl font-bold text-sm shadow">
                    Go Home
                  </a>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </div>

      <Footer />

      {/* Floating Bottom App Navigation Dock for Logged-In Mobile Users */}
      {user && <MobileBottomNav />}
    </div>
  );
}
