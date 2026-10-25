import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag, ShoppingCart, User, PlusCircle, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Explore', icon: Compass },
    { to: '/seller/dashboard', label: 'Sell', icon: Store, isCenter: true },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { to: user ? '/profile' : '/login', label: user ? 'Account' : 'Login', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden safe-area-bottom">
      <div className="grid grid-cols-5 h-16 items-center px-2">
        {navItems.map((item) => {
          const active = isActive(item.to);
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center -mt-5 relative group"
                id="mobile-nav-sell"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-deep-green to-fresh-green text-white flex items-center justify-center shadow-lg shadow-fresh-green/30 group-active:scale-95 transition-transform border-4 border-white">
                  <Icon size={20} />
                </div>
                <span className={`text-[10px] font-semibold mt-0.5 ${active ? 'text-deep-green' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 transition-all relative ${
                active ? 'text-deep-green' : 'text-gray-400 hover:text-gray-600'
              }`}
              id={`mobile-nav-${item.label.toLowerCase()}`}
            >
              <div className="relative">
                <Icon size={20} className={active ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse-soft">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${active ? 'font-bold text-deep-green' : ''}`}>
                {item.label}
              </span>
              {active && (
                <span className="w-1 h-1 bg-fresh-green rounded-full mt-0.5"></span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
