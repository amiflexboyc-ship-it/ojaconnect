import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ShieldCheck, Truck, Check, Heart } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const lagosMainland = ['Ikeja', 'Mile 12', 'Oyingbo', 'Mushin', 'Yaba', 'Surulere', 'Agege', 'Ikorodu'];
  const lagosIsland = ['Victoria Island', 'Lekki Phase 1', 'Ajah', 'Ikoyi', 'Sangotedo', 'Badore', 'Epe'];

  return (
    <footer className="bg-deep-green text-white pt-14 pb-8 border-t border-deep-green-light" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Brand & Tagline Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-fresh-green to-orange rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg font-heading">O</span>
              </div>
              <span className="text-2xl font-bold font-heading tracking-tight">OjaConnect</span>
            </Link>

            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm">
              Your Market, Just One Click Away. Nigeria's premier digital marketplace connecting authentic foodstuff sellers across Lagos with households, caterers, and restaurants.
            </p>

            {/* Newsletter / Price Alert Form */}
            <div className="pt-2">
              <span className="text-xs font-bold text-orange uppercase tracking-wider block mb-2">
                Daily Lagos Market Price Alerts
              </span>
              <form onSubmit={handleSubscribe} className="relative flex items-center max-w-sm">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email or WhatsApp..."
                  className="w-full pl-3.5 pr-24 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/40 outline-none focus:border-fresh-green"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1.5 bg-gradient-to-r from-fresh-green to-fresh-green-dark text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1"
                >
                  {subscribed ? <Check size={13} /> : <Send size={13} />}
                  <span>{subscribed ? 'Subscribed' : 'Join'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-sm font-heading text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link to="/shop" className="hover:text-fresh-green transition-colors">Shop All Produce</Link></li>
              <li><Link to="/explore" className="hover:text-fresh-green transition-colors">Explore Lagos Markets</Link></li>
              <li><Link to="/about" className="hover:text-fresh-green transition-colors">About OjaConnect</Link></li>
              <li><Link to="/orders" className="hover:text-fresh-green transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-sm font-heading text-white uppercase tracking-wider">For Sellers</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link to="/become-seller" className="hover:text-fresh-green transition-colors">Become a Seller</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-fresh-green transition-colors">Seller Hub Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-fresh-green transition-colors">Seller Portal Login</Link></li>
              <li><span className="text-white/40">Wholesale Bulk Requests</span></li>
            </ul>
          </div>

          {/* Lagos Delivery Coverage Zones */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-sm font-heading text-white uppercase tracking-wider flex items-center gap-1.5">
              <Truck size={15} className="text-fresh-green" /> Lagos Delivery Zones
            </h4>
            
            <div>
              <span className="text-[11px] font-semibold text-white/50 block mb-1">Mainland Corridors:</span>
              <div className="flex flex-wrap gap-1">
                {lagosMainland.map(area => (
                  <Link
                    key={area}
                    to={`/shop?location=${encodeURIComponent(area)}`}
                    className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md text-white/80 transition-colors"
                  >
                    {area}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[11px] font-semibold text-white/50 block mb-1">Island & Lekki Corridors:</span>
              <div className="flex flex-wrap gap-1">
                {lagosIsland.map(area => (
                  <Link
                    key={area}
                    to={`/shop?location=${encodeURIComponent(area)}`}
                    className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md text-white/80 transition-colors"
                  >
                    {area}
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Trust Badges & Payments */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-fresh-green" /> Secured by Paystack
            </span>
            <span>•</span>
            <span>Visa, Verve, Mastercard & USSD</span>
            <span>•</span>
            <span>Freshness Buyer Guarantee</span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>(c) {new Date().getFullYear()} OjaConnect Technologies. Built with</span>
            <Heart size={12} className="text-red-400 fill-red-400 mx-0.5" />
            <span>for Lagos, Nigeria.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
