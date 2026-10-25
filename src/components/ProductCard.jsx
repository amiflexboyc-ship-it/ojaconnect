import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, Check, Truck, Eye, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.find(item => item.id === product.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG').format(price);
  };

  return (
    <div
      className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/80 flex flex-col relative"
      id={`product-${product.id}`}
    >
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/3] sm:aspect-square overflow-hidden block bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges on Mobile */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.available && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-fresh-green/95 backdrop-blur-sm text-white text-[9px] sm:text-[11px] font-bold rounded-full shadow-xs">
              <Check size={9} /> Fresh
            </span>
          )}
        </div>

        {/* Market location chip */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none">
          <span className="bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium truncate max-w-[85%]">
            {product.location}
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-xs text-gray-400 truncate block">
              {product.seller}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
              {product.unit}
            </span>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-dark-text font-heading text-xs sm:text-sm md:text-base leading-snug group-hover:text-deep-green transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-1">
          <div>
            <div className="text-sm sm:text-lg font-extrabold text-deep-green font-heading leading-tight">
              {'\u20A6'}{formatPrice(product.price)}
            </div>
            <span className="text-[9px] sm:text-[11px] text-gray-400 block -mt-0.5">
              /{product.unit}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 shadow-sm ${
              inCart
                ? 'bg-fresh-green text-white shadow-fresh-green/30'
                : 'bg-gradient-to-r from-deep-green to-fresh-green text-white hover:opacity-95 active:scale-95'
            }`}
            id={`add-cart-${product.id}`}
            title="Add to cart"
          >
            {inCart ? (
              <span className="text-[11px] font-bold px-0.5">{inCart.quantity} in Cart</span>
            ) : (
              <>
                <Plus size={14} className="sm:hidden" />
                <span className="hidden sm:inline flex items-center gap-1">
                  <ShoppingCart size={13} /> Add
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
