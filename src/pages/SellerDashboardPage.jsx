import { useState } from 'react';
import { 
  Package, ShoppingBag, DollarSign, TrendingUp, Plus, Edit2, 
  Trash2, Check, X, MapPin, Store, AlertCircle, Phone, MessageSquare, Search
} from 'lucide-react';
import { sampleProducts, categories, lagosLocations } from '../data';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [productsList, setProductsList] = useState(sampleProducts.filter(p => p.seller.includes('Mama Nkechi') || p.seller.includes('Bello')));
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'rice-grains',
    price: '',
    unit: '50kg Bag',
    location: 'Mile 12 Market',
    image: '/images/cat-rice.jpg',
    available: true,
    delivery: true,
  });

  const [sellerOrders, setSellerOrders] = useState([
    {
      id: 'ORD-7821',
      customer: 'Tunde Adeleke',
      phone: '0802 345 6789',
      address: 'Plot 4 Admiralty Way, Lekki Phase 1',
      items: '50kg Mama Gold Rice (x1), Derica Garri (x2)',
      total: 89000,
      status: 'Pending Dispatch',
      time: '12 mins ago'
    },
    {
      id: 'ORD-7815',
      customer: 'Mrs. Folake Johnson',
      phone: '0813 998 1234',
      address: '22 Isaac John Street, GRA, Ikeja',
      items: 'Yellow Garri 50kg (x1)',
      total: 35000,
      status: 'Ready for Pickup',
      time: '1 hour ago'
    },
    {
      id: 'ORD-7790',
      customer: 'Emeka Nwosu',
      phone: '0901 223 3445',
      address: 'Victoria Garden City (VGC), Lekki',
      items: 'Brown Beans 50kg (x1)',
      total: 62000,
      status: 'Delivered',
      time: 'Yesterday'
    }
  ]);

  const formatPrice = (p) => new Intl.NumberFormat('en-NG').format(p);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const created = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      unit: newProduct.unit,
      seller: 'Mama Nkechi Foodstuffs',
      location: newProduct.location,
      image: newProduct.image,
      available: newProduct.available,
      delivery: newProduct.delivery,
    };

    setProductsList([created, ...productsList]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: 'rice-grains',
      price: '',
      unit: '50kg Bag',
      location: 'Mile 12 Market',
      image: '/images/cat-rice.jpg',
      available: true,
      delivery: true,
    });
  };

  const handleToggleStock = (id) => {
    setProductsList(productsList.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to remove this product from your market stall?')) {
      setProductsList(productsList.filter(p => p.id !== id));
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setSellerOrders(sellerOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <main className="min-h-screen bg-cream py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stall Header Banner */}
        <div className="bg-gradient-to-r from-deep-green via-deep-green to-fresh-green rounded-2xl md:rounded-3xl p-5 md:p-8 text-white mb-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-lg md:text-2xl font-bold font-heading border border-white/30 flex-shrink-0">
              MN
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold font-heading">Mama Nkechi Foodstuffs</h1>
                <span className="px-2 py-0.5 bg-fresh-green text-white text-[10px] font-bold rounded-full">
                  VERIFIED
                </span>
              </div>
              <p className="text-white/80 text-xs md:text-sm flex items-center gap-1 mt-0.5">
                <Store size={13} /> Stall B42, Mile 12 Market, Lagos
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white text-deep-green font-bold rounded-xl text-xs md:text-sm shadow hover:bg-cream transition-all flex items-center justify-center gap-1.5"
            id="seller-add-product-btn"
          >
            <Plus size={16} /> Add Foodstuff
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white p-3.5 md:p-5 rounded-2xl border border-gray-100 shadow-xs">
            <span className="text-[11px] md:text-xs font-semibold text-gray-400 block">Total Sales</span>
            <p className="text-xl md:text-2xl font-extrabold text-deep-green font-heading mt-0.5">{'\u20A6'}485,000</p>
            <span className="text-[10px] md:text-[11px] text-fresh-green font-medium flex items-center gap-0.5 mt-0.5">
              <TrendingUp size={11} /> +18% this month
            </span>
          </div>

          <div className="bg-white p-3.5 md:p-5 rounded-2xl border border-gray-100 shadow-xs">
            <span className="text-[11px] md:text-xs font-semibold text-gray-400 block">Active Produce</span>
            <p className="text-xl md:text-2xl font-extrabold text-dark-text font-heading mt-0.5">{productsList.length}</p>
            <span className="text-[10px] text-gray-400 mt-0.5 block">In your stall</span>
          </div>

          <div className="bg-white p-3.5 md:p-5 rounded-2xl border border-gray-100 shadow-xs">
            <span className="text-[11px] md:text-xs font-semibold text-gray-400 block">Pending Dispatch</span>
            <p className="text-xl md:text-2xl font-extrabold text-orange font-heading mt-0.5">
              {sellerOrders.filter(o => o.status !== 'Delivered').length}
            </p>
            <span className="text-[10px] text-orange font-medium mt-0.5 block">Needs packing</span>
          </div>

          <div className="bg-white p-3.5 md:p-5 rounded-2xl border border-gray-100 shadow-xs">
            <span className="text-[11px] md:text-xs font-semibold text-gray-400 block">Rating</span>
            <p className="text-xl md:text-2xl font-extrabold text-dark-text font-heading mt-0.5">4.9 / 5.0</p>
            <span className="text-[10px] text-fresh-green font-medium mt-0.5 block">Top Rated Stall</span>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-4 sm:gap-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 font-semibold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-1.5 ${activeTab === 'products' ? 'border-deep-green text-deep-green' : 'border-transparent text-gray-400'}`}
          >
            <Package size={15} /> My Produce ({productsList.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-semibold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-1.5 ${activeTab === 'orders' ? 'border-deep-green text-deep-green' : 'border-transparent text-gray-400'}`}
          >
            <ShoppingBag size={15} /> Orders ({sellerOrders.length})
          </button>
        </div>

        {/* TAB 1: Foodstuff Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xs border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-dark-text font-heading">Stall Food Inventory</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-fresh-green/10 text-fresh-green text-xs font-bold rounded-xl hover:bg-fresh-green/20 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            {/* Mobile Native Cards Layout (Phones) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {productsList.map(prod => (
                <div key={prod.id} className="p-3 bg-gray-50/60 rounded-xl border border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-semibold text-dark-text text-sm line-clamp-1">{prod.name}</h4>
                      <p className="text-xs font-bold text-deep-green">{'\u20A6'}{formatPrice(prod.price)} <span className="text-[10px] text-gray-400 font-normal">/{prod.unit}</span></p>
                      <button
                        onClick={() => handleToggleStock(prod.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${prod.available ? 'bg-fresh-green/15 text-fresh-green' : 'bg-red-100 text-red-600'}`}
                      >
                        {prod.available ? 'â€¢ In Stock' : 'â€¢ Out of Stock'}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table (Laptops / Tablets) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase">
                    <th className="pb-3 font-medium">Food Item</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Unit Price</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Delivery</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productsList.map(prod => (
                    <tr key={prod.id} className="hover:bg-gray-50/50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <span className="font-semibold text-dark-text block">{prod.name}</span>
                            <span className="text-xs text-gray-400">{prod.unit}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600 capitalize">
                        {prod.category.replace('-', ' ')}
                      </td>
                      <td className="py-4 font-bold text-deep-green">
                        {'\u20A6'}{formatPrice(prod.price)}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleToggleStock(prod.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${prod.available ? 'bg-fresh-green/10 text-fresh-green' : 'bg-red-50 text-red-500'}`}
                        >
                          {prod.available ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-4 text-xs text-gray-500">
                        {prod.delivery ? 'Lagos Dispatch' : 'Stall Pickup'}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Orders Received */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xs border border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-dark-text font-heading mb-4">Customer Food Orders</h2>

            <div className="space-y-3">
              {sellerOrders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-dark-text font-heading text-sm">{order.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        order.status === 'Delivered' 
                          ? 'bg-fresh-green/10 text-fresh-green' 
                          : order.status === 'Ready for Pickup' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange/15 text-orange'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] text-gray-400">{order.time}</span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-gray-700">{order.items}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin size={11} className="text-fresh-green" /> {order.address} â€¢ {order.customer} ({order.phone})
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-400 block">Payout</span>
                      <span className="text-sm sm:text-base font-extrabold text-deep-green">{'\u20A6'}{formatPrice(order.total)}</span>
                    </div>

                    {order.status !== 'Delivered' && (
                      <div>
                        {order.status === 'Pending Dispatch' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Ready for Pickup')}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700"
                          >
                            Ready For Rider
                          </button>
                        )}
                        {order.status === 'Ready for Pickup' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                            className="px-3 py-1.5 bg-fresh-green text-white text-xs font-semibold rounded-xl hover:bg-deep-green"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Product Modal (Responsive Sheet) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-dark-text font-heading">Add Foodstuff Item</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-gray-400 hover:text-dark-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Produce Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Royal Stallion Rice 50kg"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-fresh-green/30 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-fresh-green/30 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Unit *</label>
                  <input
                    type="text"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="e.g. 50kg Bag"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-fresh-green/30 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price in {'\u20A6'} *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="75000"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-fresh-green/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Market Stall *</label>
                  <select
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-fresh-green/30 outline-none"
                  >
                    <option value="Mile 12 Market">Mile 12 Market</option>
                    <option value="Oyingbo Market">Oyingbo Market</option>
                    <option value="Mushin Market">Mushin Market</option>
                    <option value="Alaba Rago">Alaba Rago</option>
                    <option value="Jakande Market">Jakande Lekki</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl text-xs font-bold shadow"
                >
                  Upload Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
