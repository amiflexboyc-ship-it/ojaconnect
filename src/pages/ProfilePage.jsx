import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Package, Clock, Phone, Mail, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  
  const savedOrders = JSON.parse(localStorage.getItem('ojaconnect_orders') || '[]');

  const formatPrice = (p) => new Intl.NumberFormat('en-NG').format(p);

  return (
    <main className="min-h-screen bg-cream py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-deep-green to-fresh-green text-white font-bold text-2xl flex items-center justify-center font-heading shadow-md">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-dark-text font-heading">{user?.name || 'Lagos Food Shopper'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email || 'customer@ojaconnect.ng'}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="px-3 py-1 bg-fresh-green/10 text-fresh-green text-xs font-semibold rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> Verified Customer
              </span>
              <span className="px-3 py-1 bg-deep-green/10 text-deep-green text-xs font-semibold rounded-full flex items-center gap-1">
                <MapPin size={12} /> Lagos Resident
              </span>
            </div>
          </div>
          <Link to="/become-seller" className="px-5 py-2.5 border-2 border-deep-green text-deep-green rounded-xl text-sm font-bold hover:bg-deep-green hover:text-white transition-all">
            Switch to Seller
          </Link>
        </div>

        {/* Orders History */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-dark-text font-heading mb-6 flex items-center gap-2">
            <Package size={20} className="text-fresh-green" /> My Lagos Market Orders
          </h2>

          {savedOrders.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">You haven't placed any foodstuff orders yet.</p>
              <Link to="/shop" className="inline-block mt-4 px-6 py-2.5 bg-gradient-to-r from-deep-green to-fresh-green text-white font-semibold rounded-xl text-sm shadow">
                Start Shopping Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedOrders.map(order => (
                <div key={order.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-deep-green font-heading">{order.id}</span>
                      <span className="text-xs text-gray-400">â€¢ {order.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-dark-text">
                      {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={12} className="text-fresh-green" />
                      Delivering to: {order.shipping.address}, {order.shipping.lga}
                    </p>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="text-lg font-bold text-deep-green">{'\u20A6'}{formatPrice(order.total)}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-fresh-green/10 text-fresh-green mt-1">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
