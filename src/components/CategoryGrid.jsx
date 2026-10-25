import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categories } from '../data';

export default function CategoryGrid() {
  return (
    <section className="py-8 md:py-16 bg-white border-b border-gray-100" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-4 md:mb-8">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-fresh-green/10 text-fresh-green text-xs font-bold rounded-full mb-1.5">
              <Sparkles size={12} /> Direct From Lagos Stalls
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-dark-text font-heading">
              Popular Foodstuff Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs md:text-sm font-bold text-fresh-green hover:text-deep-green flex items-center gap-1 group py-1"
          >
            See All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Horizontal Snap Scroll / Desktop Grid */}
        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="flex-shrink-0 w-28 sm:w-36 md:w-auto snap-start group flex flex-col items-center text-center p-2.5 sm:p-3 rounded-2xl bg-cream/60 hover:bg-fresh-green/5 border border-gray-100 hover:border-fresh-green/30 transition-all duration-300 hover:-translate-y-0.5"
              id={`cat-${category.id}`}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-2.5 shadow-xs group-hover:shadow-md transition-shadow">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              <h3 className="text-xs sm:text-sm font-semibold text-dark-text group-hover:text-deep-green transition-colors line-clamp-2 leading-tight">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
