import { Link } from 'react-router-dom';
import { Store, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';

export default function SellerCTA() {
  const features = [
    { icon: Store, title: 'Create Your Shop', description: 'Set up your online foodstuff store in minutes' },
    { icon: Users, title: 'Reach More Customers', description: 'Connect with buyers across all of Lagos' },
    { icon: TrendingUp, title: 'Grow Your Business', description: 'Track orders, manage inventory, boost sales' },
    { icon: Shield, title: 'Trusted Platform', description: 'Secure payments and verified seller badges' },
  ];

  return (
    <section className="py-16 md:py-20 bg-cream" id="seller-cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-orange/10 text-orange text-sm font-semibold rounded-full mb-4">
              For Sellers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text font-heading mb-4 leading-tight">
              Bring Your Foodstuff Business Online
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Reach more customers across Lagos and grow your business with OjaConnect. Join our marketplace and sell your goods to thousands of buyers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 bg-fresh-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon size={20} className="text-fresh-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-text text-sm">{feature.title}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/become-seller"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl font-semibold shadow-lg shadow-fresh-green/25 hover:shadow-xl hover:shadow-fresh-green/35 transition-all duration-300"
              id="seller-cta-btn"
            >
              Become a Seller
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-deep-green to-fresh-green rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold font-heading mb-2">Why Sell on OjaConnect?</h3>
                  <div className="w-16 h-1 bg-orange rounded-full mx-auto"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/90 font-medium">Zero listing fees for early sellers</p>
                    <p className="text-white/60 text-sm mt-1">Join now and list your products for free during our launch period</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/90 font-medium">Seller Dashboard</p>
                    <p className="text-white/60 text-sm mt-1">Manage products, orders, and earnings all in one place</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/90 font-medium">Secure Payments via Paystack</p>
                    <p className="text-white/60 text-sm mt-1">Get paid directly to your bank account after every sale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
