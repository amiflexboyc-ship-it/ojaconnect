import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Filter, MapPin, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories, lagosLocations } from '../data';
import { useProducts } from '../context/ProductContext';

export default function ShopPage() {
  const { products: contextProducts, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialLocation = searchParams.get('location') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    let list = [...contextProducts];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory || p.category.includes(selectedCategory));
    }

    if (selectedLocation !== 'all') {
      list = list.filter(p => p.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [query, selectedCategory, selectedLocation, sortBy]);

  return (
    <main className="min-h-screen bg-cream py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-deep-green to-fresh-green rounded-2xl md:rounded-3xl p-6 md:p-10 text-white mb-6 shadow-md">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-2">
              <Sparkles size={12} className="text-orange" /> Lagos Market Direct
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading">Shop Foodstuffs</h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1">
              Browse genuine prices directly from verified stallholders in Mile 12, Oyingbo, Mushin, and Lekki.
            </p>
          </div>
        </div>

        {/* Enhanced Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-gray-100 mb-6 space-y-3">
          
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input with Clear Button */}
            <div className="flex-1 relative flex items-center">
              <Search size={18} className="absolute left-3.5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by produce (rice, yam, garri, oil) or seller name..."
                className="w-full pl-10 pr-10 py-3 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green outline-none transition-all"
                id="shop-search-input"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-fresh-green/30 cursor-pointer"
              >
                <option value="all">📍 All Lagos Locations</option>
                {lagosLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-fresh-green/30 cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Chips Scroller */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-deep-green text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Produce
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-deep-green text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4 px-1 text-xs text-gray-500">
          <span>Found <strong className="text-dark-text">{filteredProducts.length}</strong> items in Lagos</span>
          {(query || selectedCategory !== 'all' || selectedLocation !== 'all') && (
            <button
              onClick={() => { setQuery(''); setSelectedCategory('all'); setSelectedLocation('all'); }}
              className="text-fresh-green font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* 2-Column on Mobile, 3 on Tablet, 4 on Desktop */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <h3 className="text-lg font-bold text-dark-text font-heading mb-1">No Foodstuffs Found</h3>
            <p className="text-xs text-gray-500 mb-4">Try adjusting your search terms or clearing filters.</p>
            <button
              onClick={() => { setQuery(''); setSelectedCategory('all'); setSelectedLocation('all'); }}
              className="px-5 py-2.5 bg-deep-green text-white rounded-xl text-xs font-bold shadow"
            >
              View All Produce
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
