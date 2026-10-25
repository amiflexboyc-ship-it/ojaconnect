import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, Store, UserCheck, Sparkles, CheckCircle2, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/';

  // If already logged in, redirect
  if (user) {
    navigate(destination, { replace: true });
    return null;
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password) {
      setError('Please enter your email or phone number and password.');
      return;
    }

    const trimmed = identifier.trim();
    const isPhone = /^[0-9+\s()-]+$/.test(trimmed);

    login({
      name: isPhone ? `User (${trimmed})` : trimmed.split('@')[0],
      email: isPhone ? `${trimmed}@phone.ojaconnect.ng` : trimmed,
      phone: isPhone ? trimmed : '',
      role: trimmed.toLowerCase().includes('seller') ? 'seller' : 'customer',
      id: 'usr_' + Date.now(),
    });

    navigate(destination, { replace: true });
  };

  const handleQuickDemo = (role) => {
    if (role === 'seller') {
      login({
        name: 'Mama Nkechi Foodstuffs',
        email: 'seller@ojaconnect.ng',
        phone: '0802 345 6789',
        role: 'seller',
        id: 'seller_demo_01',
      });
      navigate('/seller/dashboard', { replace: true });
    } else {
      login({
        name: 'Babatunde Adeleke',
        email: 'babatunde@ojaconnect.ng',
        phone: '0803 123 4567',
        role: 'customer',
        id: 'customer_demo_01',
      });
      navigate(destination === '/login' ? '/' : destination, { replace: true });
    }
  };

  return (
    <main className="min-h-screen bg-cream py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-deep-green/5 overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-12 min-h-[600px] my-4">
        
        {/* Left Visual Column (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-deep-green via-deep-green to-fresh-green p-10 xl:p-14 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-md">
                <span className="text-white font-bold text-lg font-heading">O</span>
              </div>
              <span className="text-2xl font-bold font-heading">OjaConnect</span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-white/95">
              <Sparkles size={12} className="text-orange" /> Lagos Market Direct
            </span>

            <h2 className="text-3xl font-bold font-heading leading-snug">
              Direct Access to Mile 12 & Lagos Wholesale Stalls.
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Sign up with your email or phone number to browse verified Lagos foodstuffs, check daily wholesale prices, and arrange door-to-door delivery.
            </p>
          </div>

          <div className="relative z-10 space-y-3 pt-6 border-t border-white/15">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
              <CheckCircle2 size={16} className="text-fresh-green flex-shrink-0" />
              <span>Sign Up Required for Member Wholesale Prices</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
              <ShieldCheck size={16} className="text-orange flex-shrink-0" />
              <span>Protected Lagos Dispatch Logistics</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 xl:p-14 flex flex-col justify-center">
          
          {/* Membership Gate Alert Banner */}
          <div className="mb-6 p-3.5 bg-orange/10 border border-orange/20 rounded-2xl flex items-start gap-3 text-xs text-gray-700">
            <LockKeyhole size={18} className="text-orange flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-dark-text block">Sign-in Required</span>
              <span>Please sign in or register with your email or phone number to access OjaConnect.</span>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-text font-heading">Sign In</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Enter your email or Lagos phone number to enter the market
            </p>
          </div>

          {/* Quick Demo Login Bar */}
          <div className="mb-6 p-4 bg-fresh-green/5 border border-fresh-green/20 rounded-2xl">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-deep-green uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck size={14} /> Quick Demo Access (1-Click)
              </span>
              <span className="text-[10px] bg-fresh-green/20 text-deep-green px-2 py-0.5 rounded-full font-bold">INSTANT</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="py-2.5 px-3 bg-white rounded-xl text-xs sm:text-sm font-bold text-gray-700 hover:text-deep-green border border-gray-200 hover:border-fresh-green shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                id="demo-buyer-btn"
              >
                <span>Demo Buyer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('seller')}
                className="py-2.5 px-3 bg-deep-green text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-deep-green-light shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                id="demo-seller-btn"
              >
                <Store size={14} />
                <span>Demo Seller</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Email Address or Phone Number *</label>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 focus-within:bg-white transition-all">
                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. adebayo@example.com or 0803 123 4567"
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-gray-700">Password *</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset instructions sent to your email or phone.'); }} className="text-xs text-fresh-green hover:underline font-semibold">
                  Forgot Password?
                </a>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 focus-within:bg-white transition-all">
                <Lock size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-fresh-green focus:ring-fresh-green border-gray-300"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-2xl font-bold text-sm sm:text-base hover:shadow-xl hover:shadow-fresh-green/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md"
                id="login-submit-btn"
              >
                <LogIn size={18} />
                <span>Enter OjaConnect Marketplace</span>
              </button>
            </div>
          </form>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8">
            Don't have an account yet?{' '}
            <Link to="/register" state={{ from: location.state?.from }} className="text-fresh-green font-bold hover:underline">
              Create an Account with Email / Phone
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
}
