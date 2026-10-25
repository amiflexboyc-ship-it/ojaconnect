import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, UserPlus, Store, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { lagosLocations } from '../data';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState('customer'); // 'customer' or 'seller'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stallName, setStallName] = useState('');
  const [marketLocation, setMarketLocation] = useState('Mile 12 Market');
  const [lga, setLga] = useState('Ikeja');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/';

  // If already logged in, redirect immediately
  if (user) {
    navigate(destination, { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name or business contact name.');
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail && !trimmedPhone) {
      setError('Please provide at least an Email address OR a Phone number to create your account.');
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (trimmedPhone && !/^[0-9+\s()-]{9,16}$/.test(trimmedPhone)) {
      setError('Please enter a valid Nigerian phone number (e.g. 0803 123 4567).');
      return;
    }

    if (!password) {
      setError('Please choose a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Generate unique identifier if email was omitted
    const effectiveEmail = trimmedEmail || (trimmedPhone ? trimmedPhone.replace(/[^0-9]/g, '') + '@phone.ojaconnect.ng' : '');
    const effectivePhone = trimmedPhone || '';

    register({
      name: accountType === 'seller' && stallName.trim() ? stallName.trim() : name.trim(),
      email: effectiveEmail,
      phone: effectivePhone,
      role: accountType,
      location: accountType === 'seller' ? marketLocation : lga,
      id: 'usr_' + Date.now()
    });

    if (accountType === 'seller') {
      navigate('/seller/dashboard', { replace: true });
    } else {
      navigate(destination === '/register' || destination === '/login' ? '/' : destination, { replace: true });
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    if (password.length >= 8 && /[0-9]/.test(password)) return 3;
    if (password.length >= 6) return 2;
    return 1;
  };

  const strength = getPasswordStrength();

  return (
    <main className="min-h-screen bg-cream py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-deep-green/5 p-6 sm:p-10 md:p-12 border border-gray-100 my-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-deep-green to-fresh-green rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg font-heading">O</span>
            </div>
            <span className="text-2xl font-bold text-deep-green font-heading">OjaConnect</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-text font-heading">Create Your Account</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Sign up with your phone number or email to access Lagos foodstuff markets</p>
        </div>

        {/* Access requirement banner */}
        <div className="mb-6 p-3.5 bg-fresh-green/10 border border-fresh-green/30 rounded-2xl flex items-center gap-3">
          <ShieldCheck size={20} className="text-fresh-green flex-shrink-0" />
          <span className="text-xs font-semibold text-deep-green">
            Fast & secure sign up. Use your Nigerian mobile number or email address.
          </span>
        </div>

        {/* Account Type Tabs */}
        <div className="flex p-1.5 bg-gray-100/80 rounded-2xl mb-8 gap-2">
          <button
            type="button"
            onClick={() => setAccountType('customer')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              accountType === 'customer'
                ? 'bg-white text-deep-green shadow-sm'
                : 'text-gray-500 hover:text-dark-text'
            }`}
            id="tab-customer"
          >
            <User size={16} />
            <span>Buyer / Household</span>
          </button>
          
          <button
            type="button"
            onClick={() => setAccountType('seller')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              accountType === 'seller'
                ? 'bg-deep-green text-white shadow-sm'
                : 'text-gray-500 hover:text-dark-text'
            }`}
            id="tab-seller"
          >
            <Store size={16} />
            <span>Lagos Food Seller</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs sm:text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Seller Extra Fields */}
          {accountType === 'seller' && (
            <div className="p-4 sm:p-5 bg-fresh-green/5 border border-fresh-green/20 rounded-2xl space-y-4 mb-2 animate-fade-in">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-deep-green mb-2">Market Stall / Business Name *</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 transition-all">
                  <Store size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={stallName}
                    onChange={(e) => setStallName(e.target.value)}
                    placeholder="e.g. Mama Nkechi Foodstuffs, Alhaji Danladi Grains"
                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-gray-800 placeholder:text-gray-400"
                    id="register-stall-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-deep-green mb-2">Select Your Market Stall Location *</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 transition-all">
                  <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                  <select
                    value={marketLocation}
                    onChange={(e) => setMarketLocation(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-medium text-gray-800 cursor-pointer"
                  >
                    <option value="Mile 12 Market">Mile 12 Market (Kosofe)</option>
                    <option value="Oyingbo Market">Oyingbo Market (Ebute Metta)</option>
                    <option value="Mushin Olosha Market">Mushin Olosha Market</option>
                    <option value="Alaba Rago Grains">Alaba Rago Market (Ojo)</option>
                    <option value="Jakande Market">Jakande Market (Lekki)</option>
                    <option value="Bodija / Ikorodu Depot">Ikorodu Food Market</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Your Full Name *</label>
            <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 focus-within:bg-white transition-all">
              <User size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Adebayo Adeleke"
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                id="register-name"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-bold text-gray-700">Email Address</label>
                <span className="text-[11px] text-gray-400 font-normal">or Phone</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 focus-within:bg-white transition-all">
                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adebayo@example.com"
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                  id="register-email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-bold text-gray-700">Phone Number</label>
                <span className="text-[11px] text-fresh-green font-medium">WhatsApp / SMS</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 focus-within:bg-white transition-all">
                <Phone size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0803 123 4567"
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                  id="register-phone"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 italic">
            * You can sign up using either your email address or phone number (or both).
          </p>

          {/* Customer LGA Dropdown */}
          {accountType === 'customer' && (
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Default Lagos Area / LGA</label>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 focus-within:bg-white transition-all">
                <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                <select
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm md:text-base font-medium text-gray-800 cursor-pointer"
                >
                  {lagosLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Password *</label>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 focus-within:bg-white transition-all">
                <Lock size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 chars"
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                  id="register-password"
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

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Confirm Password *</label>
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-fresh-green focus-within:ring-2 focus-within:ring-fresh-green/20 focus-within:bg-white transition-all">
                <Lock size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                  id="register-confirm"
                />
              </div>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-1.5 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`flex-1 rounded-full ${strength >= 1 ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-orange' : 'bg-fresh-green') : ''}`}></div>
                <div className={`flex-1 rounded-full ${strength >= 2 ? (strength === 2 ? 'bg-orange' : 'bg-fresh-green') : ''}`}></div>
                <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-fresh-green' : ''}`}></div>
              </div>
              <span className="text-xs text-gray-400 block text-right font-medium">
                {strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong'}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-2xl font-bold text-sm sm:text-base hover:shadow-xl hover:shadow-fresh-green/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md"
              id="register-submit-btn"
            >
              <UserPlus size={18} />
              <span>{accountType === 'seller' ? 'Open Seller Stall' : 'Create Customer Account'}</span>
            </button>
          </div>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8">
          Already have an account?{' '}
          <Link to="/login" state={{ from: location.state?.from }} className="text-fresh-green font-bold hover:underline">
            Sign In with Email or Phone
          </Link>
        </p>

      </div>
    </main>
  );
}
