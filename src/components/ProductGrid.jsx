import { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, ChevronDown, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { sampleProducts, categories, lagosLocations } from '../data';

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    let result = [...sampleProducts];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (selectedLocation !== 'all') {
      result = result.filter(p => p.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, selectedLocation, sortBy]);

  return (
    <section className="py-8 md:py-16 bg-cream" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 md:mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-fresh-green/10 text-fresh-green text-xs font-bold rounded-full mb-1.5">
              <Sparkles size={12} /> Today's Wholesale & Retail Prices
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-dark-text font-heading">
              Featured Lagos Foodstuffs
            </h2>
          </div>

          {/* Quick Filter Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl text-xs font-semibold text-gray-700 border border-gray-200 shadow-xs focus:ring-2 focus:ring-fresh-green/30 outline-none"
            >
              <option value="all">ðŸ“ All Lagos Markets</option>
              {lagosLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl text-xs font-semibold text-gray-700 border border-gray-200 shadow-xs focus:ring-2 focus:ring-fresh-green/30 outline-none"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 2-Column Grid on Mobile, 3 on Tablet, 4 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
