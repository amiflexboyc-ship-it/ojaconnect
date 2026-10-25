import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, MapPin, Check, Truck, ShieldCheck, Star, 
  ArrowLeft, Phone, MessageCircle, Heart, Share2, AlertCircle 
} from 'lucide-react';
import { sampleProducts, lagosLocations } from '../data';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedLga, setSelectedLga] = useState('Ikeja');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const product = sampleProducts.find(p => String(p.id) === String(id)) || sampleProducts[0];
  const inCart = cartItems.find(item => item.id === product.id);

  const formatPrice = (price) => new Intl.NumberFormat('en-NG').format(price);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  // Delivery fee estimation by zone
  const isIsland = ['Victoria Island', 'Lekki', 'Ajah', 'Ikoyi', 'Sangotedo', 'Badore', 'Epe', 'Ibeju-Lekki'].includes(selectedLga);
  const estDeliveryFee = isIsland ? 2500 : 1800;

  const relatedProducts = sampleProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-deep-green">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-deep-green">Shop</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </div>

        {/* Product Hero Grid */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Product Image Column */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-fresh-green text-white text-xs font-semibold rounded-full shadow-md">
                  <Check size={12} /> Farm Fresh Quality
                </span>
                {product.delivery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 text-deep-green text-xs font-semibold rounded-full shadow-md">
                    <Truck size={12} /> Same-Day Lagos Delivery
                  </span>
                )}
              </div>
            </div>

            {/* Seller Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="p-3 bg-cream rounded-xl">
                <ShieldCheck size={20} className="mx-auto text-deep-green mb-1" />
                <span className="text-xs font-medium text-gray-700">Market Verified</span>
              </div>
              <div className="p-3 bg-cream rounded-xl">
                <Truck size={20} className="mx-auto text-fresh-green mb-1" />
                <span className="text-xs font-medium text-gray-700">Swift Dispatch</span>
              </div>
              <div className="p-3 bg-cream rounded-xl">
                <Star size={20} className="mx-auto text-orange mb-1" />
                <span className="text-xs font-medium text-gray-700">4.9 Star Produce</span>
              </div>
            </div>
          </div>

          {/* Product Details Column */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="inline-block px-3 py-1 bg-deep-green/10 text-deep-green text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                  {product.category.replace('-', ' ')}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-dark-text font-heading">{product.name}</h1>
              </div>
              <button className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Price Banner */}
            <div className="flex items-baseline gap-3 my-4 p-4 bg-cream/70 rounded-2xl border border-fresh-green/20">
              <span className="text-3xl md:text-4xl font-extrabold text-deep-green font-heading">
                {'\u20A6'}{formatPrice(product.price)}
              </span>
              <span className="text-gray-500 font-medium">per {product.unit}</span>
              <span className="ml-auto text-xs font-medium text-fresh-green bg-white px-2.5 py-1 rounded-full border border-fresh-green/30">
                Direct Market Price
              </span>
            </div>

            {/* Seller Info Card */}
            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/70 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-deep-green text-white font-bold flex items-center justify-center font-heading shadow-md">
                    {product.seller.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-text">{product.seller}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} className="text-fresh-green" />
                      {product.location} Market, Lagos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={`https://wa.me/2348012345678?text=Hello%20${product.seller},%20I%20am%20interested%20in%20your%20${product.name}%20on%20OjaConnect`}
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors text-xs flex items-center gap-1 font-medium"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity ({product.unit}):</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-gray-500 hover:text-dark-text font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold text-dark-text min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-gray-500 hover:text-dark-text font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400">Total: {'\u20A6'}{formatPrice(product.price * quantity)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-6 rounded-xl border-2 border-deep-green text-deep-green font-semibold hover:bg-deep-green hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                  id="add-to-cart-detail"
                >
                  <ShoppingCart size={18} />
                  {addedAnimation ? 'Added to Cart!' : inCart ? `Add More (${inCart.quantity} in cart)` : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-deep-green to-fresh-green text-white font-semibold hover:shadow-lg hover:shadow-fresh-green/25 transition-all flex items-center justify-center gap-2"
                  id="buy-now-detail"
                >
                  Buy Now
                </button>
              </div>

              {/* Lagos Delivery Calculator */}
              <div className="p-4 bg-fresh-green/5 border border-fresh-green/15 rounded-2xl mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-deep-green uppercase tracking-wider flex items-center gap-1.5">
                    <Truck size={14} /> Calculate Lagos Delivery
                  </span>
                  <span className="text-xs font-bold text-deep-green">{'\u20A6'}{formatPrice(estDeliveryFee)}</span>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedLga} 
                    onChange={(e) => setSelectedLga(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-fresh-green/30"
                  >
                    {lagosLocations.map(loc => (
                      <option key={loc} value={loc}>{loc} ({['Victoria Island', 'Lekki', 'Ajah', 'Ikoyi', 'Sangotedo'].includes(loc) ? 'Island' : 'Mainland'})</option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  Direct dispatch from {product.location} to {selectedLga}. Typical transit time: 2 - 4 hours.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Related Produce from Lagos Markets */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-dark-text font-heading mb-6">More from {product.category.replace('-', ' ')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(rel => (
                <div key={rel.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <img src={rel.image} alt={rel.name} className="w-full h-44 object-cover rounded-xl mb-3" />
                  <h3 className="font-semibold text-dark-text">{rel.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-deep-green">{'\u20A6'}{formatPrice(rel.price)}</span>
                    <Link to={`/product/${rel.id}`} className="text-xs font-semibold text-fresh-green hover:underline">View Product</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
