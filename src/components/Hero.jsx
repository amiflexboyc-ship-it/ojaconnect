import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { lagosLocations } from '../data';

export default function Hero() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Lagos');

  const popularMarkets = ['Mile 12', 'Oyingbo', 'Mushin', 'Lekki', 'Ikeja', 'Ajah'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <section className="relative overflow-hidden" id="hero">
      {/* Background with Dark Green Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-market.jpg"
          alt="Nigerian foodstuff market display"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-green/95 via-deep-green/85 to-deep-green/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-green/80 via-transparent to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-24 lg:py-32">
        <div className="max-w-2xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 mb-4 shadow-xs">
            <span className="w-2 h-2 bg-fresh-green rounded-full animate-ping"></span>
            <span className="text-white/95 text-xs font-semibold tracking-wide">
              Lagos Foodstuff Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight mb-3 md:mb-5">
            Your Favourite Foodstuff, Delivered to Your{' '}
            <span className="text-orange">Doorstep.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed mb-6">
            Buy rice, beans, garri, yam, palm oil & fresh vegetables directly from verified Lagos market sellers at real wholesale prices.
          </p>

          {/* Search Card */}
          <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl p-2 shadow-2xl shadow-black/25 mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 rounded-xl">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search rice, beans, garri, tomatoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-dark-text placeholder:text-gray-400 outline-none text-xs sm:text-sm font-medium"
                  id="hero-search"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                id="hero-search-btn"
              >
                <span>Find Foodstuff</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Mobile Quick Chips for Popular Markets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs text-white/90">
            <span className="font-semibold text-white/70 flex-shrink-0 text-[11px]">Popular Markets:</span>
            {popularMarkets.map(market => (
              <button
                key={market}
                type="button"
                onClick={() => navigate(`/shop?location=${encodeURIComponent(market)}`)}
                className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 transition-all active:scale-95"
              >
                {market}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
