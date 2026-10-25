import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown, MapPin, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { lagosLocations } from '../data';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [locationSheetOpen, setLocationSheetOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Ikeja');

  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop Foodstuff' },
    { to: '/explore', label: 'Explore Markets' },
    { to: '/seller/dashboard', label: 'Seller Hub' },
    { to: '/orders', label: 'My Orders' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Mobile Bar: Quick Lagos Location Switcher (Native App Look) */}
      <div className="bg-gradient-to-r from-deep-green to-fresh-green text-white text-xs px-4 py-1.5 md:hidden flex items-center justify-between">
        <button
          onClick={() => setLocationSheetOpen(true)}
          className="flex items-center gap-1.5 font-medium hover:opacity-90 active:scale-98 transition-transform"
          id="mobile-location-btn"
        >
          <MapPin size={13} className="text-orange" />
          <span className="text-white/80">Delivering to:</span>
          <span className="font-bold underline decoration-fresh-green underline-offset-2 flex items-center gap-0.5">
            {currentLocation}, Lagos <ChevronDown size={12} />
          </span>
        </button>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
          Same-Day Dispatch
        </span>
      </div>

      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-18">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-deep-green to-fresh-green rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-base md:text-lg font-heading">O</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-deep-green font-heading tracking-tight leading-none">
                  OjaConnect
                </span>
                <span className="text-[9px] md:text-[10px] text-gray-400 hidden sm:block">
                  Your Market, Just One Click Away
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-fresh-green/10 text-deep-green font-bold'
                      : 'text-gray-600 hover:text-deep-green hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Quick Location Selector */}
              <button
                onClick={() => setLocationSheetOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 border border-gray-200 transition-colors"
              >
                <MapPin size={13} className="text-fresh-green" />
                <span>{currentLocation}, Lagos</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {/* Desktop Cart */}
              <Link
                to="/cart"
                className="hidden md:flex relative p-2.5 text-gray-600 hover:text-deep-green hover:bg-gray-50 rounded-xl transition-all"
                id="nav-cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth / Profile */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 md:border-transparent"
                    id="nav-profile"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-fresh-green to-deep-green rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">{user.name?.[0] || 'U'}</span>
                    </div>
                    <span className="hidden sm:block font-semibold">{user.name?.split(' ')[0]}</span>
                    <ChevronDown size={13} className="text-gray-400" />
                  </button>
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-up">
                      <Link to="/profile" onClick={() => setProfileDropdown(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <User size={15} className="text-deep-green" /> Customer Profile
                      </Link>
                      <Link to="/seller/dashboard" onClick={() => setProfileDropdown(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <span className="w-2 h-2 rounded-full bg-fresh-green"></span> Seller Dashboard
                      </Link>
                      <Link to="/orders" onClick={() => setProfileDropdown(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <ShoppingCart size={15} className="text-orange" /> Track Orders
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => { logout(); setProfileDropdown(false); }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs md:text-sm font-semibold text-deep-green hover:bg-deep-green/5 rounded-xl transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-deep-green to-fresh-green rounded-xl hover:shadow-md transition-all shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-deep-green hover:bg-gray-50 rounded-xl"
                id="nav-mobile-toggle"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 animate-fade-in-up shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-fresh-green/10"
              >
                <span>{link.label}</span>
                <span className="text-gray-300">â€º</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-3">
              <span>Lagos Foodstuff Dispatch Hotline</span>
              <span className="font-bold text-deep-green">0800-OJA-CONNECT</span>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Location Bottom Sheet Modal */}
      {locationSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="text-fresh-green" size={20} />
                <h3 className="font-bold text-dark-text font-heading text-lg">Select Your Lagos Area</h3>
              </div>
              <button 
                onClick={() => setLocationSheetOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 mb-4">
              We customize foodstuff stall distance, delivery dispatch times, and pricing to your location.
            </p>

            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
              {lagosLocations.map((loc) => {
                const isSelected = currentLocation === loc;
                const isIsland = ['Victoria Island', 'Lekki', 'Ajah', 'Ikoyi', 'Sangotedo', 'Badore', 'Epe'].includes(loc);
                return (
                  <button
                    key={loc}
                    onClick={() => {
                      setCurrentLocation(loc);
                      setLocationSheetOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between text-sm transition-all ${
                      isSelected
                        ? 'bg-fresh-green/10 text-deep-green font-bold border border-fresh-green/30'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${isIsland ? 'bg-orange' : 'bg-deep-green'}`}></span>
                      <span>{loc}</span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-400">
                      {isIsland ? 'Lagos Island' : 'Mainland'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
