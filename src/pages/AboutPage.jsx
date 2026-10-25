import { Link } from 'react-router-dom';
import { Store, Truck, ShieldCheck, Heart, Sparkles, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const marketPillars = [
    {
      icon: Store,
      title: 'Direct Market Sourcing',
      desc: 'We bypass high-cost supermarkets by connecting you directly to registered stallholders in Mile 12, Oyingbo, Mushin, and Alaba.',
    },
    {
      icon: ShieldCheck,
      title: 'Real Wholesale Pricing',
      desc: 'Get genuine market prices in Naira (₦). No middleman markups. Transparent per-bag, per-basket, and per-kg pricing.',
    },
    {
      icon: Truck,
      title: 'Reliable Lagos Dispatch',
      desc: 'From mainland food hubs straight to Island and Mainland residential areas with temperature-conscious dispatch riders.',
    },
  ];

  const lagosMarkets = [
    { name: 'Mile 12 Market', lga: 'Kosofe', focus: 'Tomatoes, Peppers, Onions, Yam, Grains' },
    { name: 'Oyingbo Market', lga: 'Ebute Metta', focus: 'Stockfish, Dried Fish, Crayfish, Snails' },
    { name: 'Mushin Olosha', lga: 'Mushin', focus: 'Palm Oil, Groundnut Oil, Plantain, Garri' },
    { name: 'Alaba Rago', lga: 'Ojo', focus: 'Northern Beans, Rice, Sorghum, Millet' },
    { name: 'Jakande Market', lga: 'Lekki', focus: 'Fresh Coastal Seafood, Vegetables, Fruits' },
  ];

  return (
    <main className="min-h-screen bg-cream py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-deep-green via-deep-green to-fresh-green rounded-3xl p-8 md:p-14 text-white mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-4 text-white">
              <Sparkles size={12} className="text-orange" /> About OjaConnect
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading leading-tight mb-4">
              Your Market, Just One Click Away.
            </h1>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6">
              OjaConnect was born from a simple truth: Lagosians spend hours in traffic just to buy fresh foodstuffs from wholesale markets like Mile 12 and Oyingbo. We digitize this experience, bringing the market stalls straight to your phone.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="px-6 py-3 bg-white text-deep-green rounded-xl font-bold text-xs sm:text-sm shadow-md hover:bg-cream transition-all flex items-center gap-2"
              >
                <span>Start Shopping</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/become-seller"
                className="px-6 py-3 bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold text-xs sm:text-sm hover:bg-white/25 transition-all"
              >
                Register as a Market Stall
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {marketPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-fresh-green/10 text-fresh-green flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-dark-text font-heading mb-2">{p.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Lagos Market Hubs */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs mb-12">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-fresh-green uppercase tracking-wider block mb-1">Our Partner Markets</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-text font-heading">
              Serving Stalls Across Lagos Mainland & Island
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Every item ordered on OjaConnect is dispatched directly from active stalls in recognized foodstuff centers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lagosMarkets.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-cream/70 border border-gray-100 flex items-start gap-3">
                <div className="p-2 bg-deep-green/10 text-deep-green rounded-xl flex-shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-dark-text text-sm">{m.name}</h4>
                  <span className="text-[11px] text-gray-400 block">{m.lga}, Lagos</span>
                  <p className="text-xs text-fresh-green font-medium mt-1">Specialty: {m.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
