import { useState, useMemo } from 'react';
import { Search, MapPin, Store, Navigation, Phone, ExternalLink, Sparkles, X } from 'lucide-react';
import LagosMap from '../components/LagosMap';
import NearbyFinder from '../components/NearbyFinder';
import { lagosMapMarkers } from '../data';

export default function ExplorePage() {
  const [marketSearch, setMarketSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredMarkets = useMemo(() => {
    let list = [...lagosMapMarkers];
    if (marketSearch.trim()) {
      const q = marketSearch.toLowerCase();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.area.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    if (selectedArea !== 'all') {
      list = list.filter(m => m.area === selectedArea);
    }
    return list;
  }, [marketSearch, selectedArea]);

  return (
    <main className="min-h-screen bg-cream py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-deep-green via-deep-green to-fresh-green rounded-2xl md:rounded-3xl p-6 md:p-10 text-white mb-6 shadow-md">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-2">
              <Sparkles size={12} className="text-orange" /> Lagos Market Explorer
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading">
              Explore Foodstuff Markets Across Lagos
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1">
              Find wholesale depots, neighborhood food hubs, and direct farm stalls across Lagos Mainland and Lagos Island.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 mb-8 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 relative flex items-center">
              <Search size={18} className="absolute left-3.5 text-gray-400" />
              <input
                type="text"
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                placeholder="Search market name (e.g. Mile 12, Oyingbo, Mushin, Alaba, Jakande)..."
                className="w-full pl-10 pr-10 py-3 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-fresh-green/30 outline-none transition-all"
                id="market-search-input"
              />
              {marketSearch && (
                <button
                  type="button"
                  onClick={() => setMarketSearch('')}
                  className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedArea('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedArea === 'all'
                    ? 'bg-deep-green text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Areas
              </button>
              <button
                type="button"
                onClick={() => setSelectedArea('Lagos Mainland')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedArea === 'Lagos Mainland'
                    ? 'bg-deep-green text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Mainland
              </button>
              <button
                type="button"
                onClick={() => setSelectedArea('Lagos Island')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedArea === 'Lagos Island'
                    ? 'bg-deep-green text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Island & Lekki
              </button>
            </div>
          </div>
        </div>

        {/* Market Catalog Cards */}
        <div className="mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-dark-text font-heading mb-4 flex items-center justify-between">
            <span>Recognized Food Hubs ({filteredMarkets.length})</span>
            {marketSearch && (
              <span className="text-xs font-normal text-gray-400">Filtering by "{marketSearch}"</span>
            )}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarkets.map((m, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-deep-green bg-deep-green/10 px-2.5 py-0.5 rounded-full">
                      {m.area}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Store size={12} className="text-fresh-green" /> Registered Market
                    </span>
                  </div>

                  <h3 className="font-bold text-dark-text text-base mb-1 font-heading">{m.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{m.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`/shop?location=${encodeURIComponent(m.name)}`}
                    className="text-xs font-bold text-fresh-green hover:text-deep-green flex items-center gap-1"
                  >
                    <span>View Stalls</span>
                    <span>→</span>
                  </a>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Navigation size={11} /> Lagos Transit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Lagos Map */}
      <LagosMap />

      {/* Nearby Finder with Geolocation */}
      <NearbyFinder />
    </main>
  );
}
