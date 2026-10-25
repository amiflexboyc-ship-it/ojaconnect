import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, Truck, ShieldCheck, MapPin, CheckCircle, 
  ArrowLeft, AlertTriangle, Lock, Phone, User, Home, ChevronRight 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { lagosLocations } from '../data';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, sellerGroups } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    lga: 'Ikeja',
    deliveryNote: '',
    paymentMethod: 'paystack', // 'paystack' | 'cod' | 'transfer'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const formatPrice = (price) => new Intl.NumberFormat('en-NG').format(price);

  const isIsland = ['Victoria Island', 'Lekki', 'Ajah', 'Ikoyi', 'Sangotedo', 'Badore', 'Epe', 'Ibeju-Lekki'].includes(formData.lga);
  const sellers = Object.keys(sellerGroups);
  
  // Base delivery fee + extra dispatch if multi-seller across markets
  const baseDelivery = isIsland ? 2500 : 1800;
  const multiMarketFee = sellers.length > 1 ? (sellers.length - 1) * 800 : 0;
  const totalDeliveryFee = cartItems.length > 0 ? baseDelivery + multiMarketFee : 0;
  const grandTotal = cartTotal + totalDeliveryFee;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsProcessing(true);

    // Simulate Paystack payment popup or order placement
    setTimeout(() => {
      const orderId = 'OJA-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...cartItems],
        total: grandTotal,
        subtotal: cartTotal,
        deliveryFee: totalDeliveryFee,
        shipping: formData,
        sellers: sellers,
        status: 'Order Placed',
        paymentStatus: formData.paymentMethod === 'cod' ? 'Pending on Delivery' : 'Paid via Paystack',
      };

      // Save to localStorage for demo persistence
      const savedOrders = JSON.parse(localStorage.getItem('ojaconnect_orders') || '[]');
      savedOrders.unshift(newOrder);
      localStorage.setItem('ojaconnect_orders', JSON.stringify(savedOrders));

      setIsProcessing(false);
      setPlacedOrderDetails(newOrder);
      setOrderComplete(true);
      clearCart();
    }, 1800);
  };

  if (orderComplete && placedOrderDetails) {
    return (
      <main className="min-h-screen bg-cream py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm text-center border border-gray-100">
            <div className="w-20 h-20 bg-fresh-green/10 text-fresh-green rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={44} />
            </div>
            
            <span className="text-xs font-bold uppercase tracking-wider text-fresh-green bg-fresh-green/10 px-3 py-1 rounded-full">
              Order Confirmed
            </span>

            <h1 className="text-3xl font-bold text-dark-text font-heading mt-4 mb-2">
              E Dupe! Order Placed Successfully
            </h1>
            
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Your Lagos foodstuff order <span className="font-semibold text-deep-green">#{placedOrderDetails.id}</span> has been dispatched to market sellers.
            </p>

            <div className="bg-cream rounded-2xl p-6 text-left border border-gray-200/60 mb-8 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-semibold text-dark-text">{placedOrderDetails.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Address:</span>
                <span className="font-semibold text-dark-text text-right max-w-[240px]">
                  {placedOrderDetails.shipping.address}, {placedOrderDetails.shipping.lga}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-semibold text-fresh-green">{placedOrderDetails.paymentStatus}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base text-deep-green">
                <span>Total Paid:</span>
                <span>{'\u20A6'}{formatPrice(placedOrderDetails.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/orders" 
                className="px-6 py-3.5 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Track Your Foodstuff Order
              </Link>
              <Link 
                to="/shop" 
                className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-cream py-16 text-center">
        <h2 className="text-2xl font-bold font-heading text-dark-text mb-4">No items to checkout</h2>
        <Link to="/shop" className="text-fresh-green font-semibold hover:underline">Browse Market Products</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-2 mb-8">
          <Link to="/cart" className="p-2 bg-white rounded-xl text-gray-500 hover:text-dark-text">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-3xl font-bold text-dark-text font-heading">Secure Checkout</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Delivery Details & Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery Destination in Lagos */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-dark-text font-heading mb-4 flex items-center gap-2">
                <MapPin className="text-fresh-green" size={20} /> Lagos Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Recipient Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Babatunde Adeleke"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green outline-none"
                    id="checkout-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number (For Lagos Dispatch Rider) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="080 1234 5678"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green outline-none"
                    id="checkout-phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="babatunde@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Lagos Area / LGA *</label>
                  <select
                    name="lga"
                    value={formData.lga}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green outline-none"
                    id="checkout-lga"
                  >
                    {lagosLocations.map(loc => (
                      <option key={loc} value={loc}>
                        {loc} - {['Victoria Island', 'Lekki', 'Ajah', 'Ikoyi', 'Sangotedo', 'Badore', 'Epe'].includes(loc) ? 'Island' : 'Mainland'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Street Address / House Number *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 15 Allen Avenue, near Ikeja Mall"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green outline-none"
                  id="checkout-address"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Popular Landmark (Helps rider navigate Lagos traffic)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="e.g. Opposite Total Filling Station / Beside First Bank"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green outline-none"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-dark-text font-heading mb-4 flex items-center gap-2">
                <CreditCard className="text-fresh-green" size={20} /> Payment Option
              </h2>

              <div className="space-y-3">
                <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${formData.paymentMethod === 'paystack' ? 'border-fresh-green bg-fresh-green/5 ring-1 ring-fresh-green' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={formData.paymentMethod === 'paystack'}
                    onChange={handleChange}
                    className="mt-1 text-fresh-green focus:ring-fresh-green"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-dark-text text-sm">Paystack (Instant Card, USSD, Bank Transfer)</span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">RECOMMENDED</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Secure payment verified in real-time. Protected by 256-bit encryption.</p>
                  </div>
                </label>

                <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-fresh-green bg-fresh-green/5 ring-1 ring-fresh-green' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="mt-1 text-fresh-green focus:ring-fresh-green"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-dark-text text-sm">Pay On Delivery (Lagos Mainland Only)</span>
                    <p className="text-xs text-gray-500 mt-0.5">Pay cash or mobile transfer when dispatch rider delivers foodstuff.</p>
                  </div>
                </label>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                <Lock size={14} className="text-gray-400" />
                <span>All transactions on OjaConnect are covered by our Fresh Foodstuff Buyer Protection Guarantee.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-dark-text font-heading mb-4">Order Summary</h2>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto mb-6 pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold text-dark-text line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.seller} â€¢ Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-deep-green">{'\u20A6'}{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Multi-Seller Alert */}
              {sellers.length > 1 && (
                <div className="p-3 bg-orange/10 border border-orange/20 rounded-xl mb-4 text-xs text-gray-700">
                  <p className="font-semibold text-orange mb-0.5">Multi-Market Dispatch:</p>
                  Items will be dispatched from {sellers.join(', ')}. Consolidated delivery applied.
                </div>
              )}

              {/* Fee Breakdown */}
              <div className="space-y-2.5 text-sm border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Foodstuff Subtotal</span>
                  <span className="font-semibold">{'\u20A6'}{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Lagos Delivery ({isIsland ? 'Island' : 'Mainland'})</span>
                  <span className="font-semibold">{'\u20A6'}{formatPrice(baseDelivery)}</span>
                </div>
                {multiMarketFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Multi-Market Pickup Fee</span>
                    <span className="font-semibold">{'\u20A6'}{formatPrice(multiMarketFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-deep-green border-t border-gray-200 pt-3">
                  <span>Total Amount</span>
                  <span>{'\u20A6'}{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-fresh-green/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-base"
                id="confirm-pay-btn"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Pay {'\u20A6'}{formatPrice(grandTotal)}</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-3">
                By ordering, you agree to OjaConnect's Lagos Market Terms & Conditions.
              </p>
            </div>
          </div>

        </form>

      </div>
    </main>
  );
}
