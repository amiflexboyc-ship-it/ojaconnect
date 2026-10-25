import { Link } from 'react-router-dom';
import { Package, Clock, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
        <div className="max-w-md text-center bg-white rounded-3xl p-10 shadow-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-dark-text font-heading mb-3">Sign In to View Orders</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your order history and track current orders.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-text font-heading mb-8">My Orders</h1>
        <div className="bg-white rounded-3xl p-10 shadow-sm text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-dark-text font-heading mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">
            You have not placed any orders yet. Browse our marketplace and place your first order!
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
            <ShoppingCart size={18} /> Start Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
