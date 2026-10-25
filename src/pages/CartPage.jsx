import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, sellerGroups, clearCart } = useCart();

  const formatPrice = (price) => new Intl.NumberFormat('en-NG').format(price);
  const deliveryFee = cartCount > 0 ? 1800 : 0;
  const sellers = Object.keys(sellerGroups);

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-cream py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-dark-text font-heading mb-2">Your Food Cart is Empty</h1>
            <p className="text-gray-500 mb-8">Discover fresh foodstuffs across Lagos markets and add them here.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-text font-heading">Your Foodstuff Cart</h1>
            <p className="text-sm text-gray-500">{cartCount} items from {sellers.length} Lagos {sellers.length > 1 ? 'markets' : 'market'}</p>
          </div>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear Cart</button>
        </div>

        {sellers.length > 1 && (
          <div className="flex items-start gap-3 p-4 bg-orange/10 border border-orange/20 rounded-2xl mb-6">
            <AlertCircle size={20} className="text-orange flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-dark-text">Multi-Market Stall Order</p>
              <p className="text-gray-600">
                Your cart has produce from {sellers.length} sellers ({sellers.join(', ')}). Our Lagos logistics team combines delivery into a single dispatch.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items by Seller */}
          <div className="lg:col-span-8 space-y-6">
            {Object.entries(sellerGroups).map(([sellerName, items]) => (
              <div key={sellerName} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <span className="font-bold text-dark-text font-heading">{sellerName}</span>
                  <span className="text-xs text-fresh-green bg-fresh-green/10 px-2.5 py-1 rounded-full font-semibold">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <Link to={`/product/${item.id}`} className="font-semibold text-dark-text hover:text-deep-green text-sm line-clamp-1">
                            {item.name}
                          </Link>
                          <span className="text-xs text-gray-400 block">{item.unit}</span>
                          <span className="text-sm font-bold text-deep-green">{'\u20A6'}{formatPrice(item.price)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-xl">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-gray-500 hover:text-dark-text"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-gray-500 hover:text-dark-text"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-dark-text font-heading mb-4">Cart Summary</h2>
              
              <div className="space-y-3 text-sm pb-4 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold">{'\u20A6'}{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Est. Lagos Delivery</span>
                  <span className="font-semibold">{'\u20A6'}{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-deep-green pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{'\u20A6'}{formatPrice(cartTotal + deliveryFee)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full mt-6 py-4 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl font-bold hover:shadow-lg hover:shadow-fresh-green/25 transition-all duration-300 flex items-center justify-center gap-2"
                id="proceed-checkout"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-fresh-green" />
                <span>Lagos Fresh Produce Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
