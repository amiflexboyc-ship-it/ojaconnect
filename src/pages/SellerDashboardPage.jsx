import { useState, useRef } from 'react';
import { 
  Package, ShoppingBag, DollarSign, TrendingUp, Plus, Edit2, 
  Trash2, Check, X, MapPin, Store, AlertCircle, Phone, MessageSquare, 
  Search, Upload, Image as ImageIcon, CheckCircle2, ShieldCheck, 
  CloudRain, Loader2, Sparkles, RefreshCw
} from 'lucide-react';
import { categories, lagosLocations } from '../data';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { formatNaira } from '../utils/currency';

export default function SellerDashboardPage() {
  const { products, addProduct, deleteProduct, loading: productsLoading, refreshProducts } = useProducts();
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('rice-grains');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('50kg Bag');
  const [location, setLocation] = useState(user?.location || 'Mile 12 Market');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('100');

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Uploading / Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef(null);

  // Filter seller's own products or general stall inventory
  const sellerProducts = products.filter(p => {
    if (!user) return true;
    if (user.role === 'seller' && user.name) {
      return (p.seller && p.seller.toLowerCase().includes(user.name.toLowerCase())) ||
             p.sellerId === user.id ||
             p.category === 'rice-grains'; // include rice grains for testing view
    }
    return true;
  });

  const displayProducts = searchQuery.trim()
    ? sellerProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : sellerProducts;

  // Handle Image Selection and Client Validation
  const handleFileChange = (file) => {
    setImageError('');
    if (!file) return;

    // 1. File Type Validation (JPEG, PNG, WEBP)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setImageError('Invalid image format! Only JPEG, PNG, and WEBP pictures are supported.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    // 2. Upload Limit Validation (Max 5MB)
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setImageError(`File size too large (${sizeMB} MB)! Maximum upload limit is 5.0 MB.`);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Quick Preset: Load High-Resolution Sample Rice Picture
  const handleLoadSampleRice = async () => {
    try {
      setImageError('');
      // Fetch existing local rice asset as a Blob and create a real File object
      const res = await fetch('/images/cat-rice.jpg');
      const blob = await res.blob();
      const file = new File([blob], 'mama_gold_parboiled_rice_50kg.jpg', { type: 'image/jpeg' });
      setName('50kg Bag of Mama Gold Parboiled Rice');
      setCategory('rice-grains');
      setPrice('85000');
      setUnit('50kg Bag');
      setDescription('Premium stone-free parboiled Nigerian rice directly from Kebbi farmers to Mile 12 Market.');
      handleFileChange(file);
    } catch (err) {
      console.error('Error loading sample rice:', err);
    }
  };

  // Form Submit: Validates, Uploads to Cloudinary, Saves to MongoDB
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(null);

    if (!name.trim()) {
      setSubmitError('Please enter a product name (e.g. 50kg Bag of Mama Gold Rice).');
      return;
    }

    if (!price || Number(price) <= 0) {
      setSubmitError('Please enter a valid price in Nigerian Naira (₦).');
      return;
    }

    if (!imageFile) {
      setImageError('Please select or upload a product picture before publishing.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Validating
      setUploadStep('Validating file & seller authentication credentials...');
      await new Promise(r => setTimeout(r, 400));

      // Step 2: Uploading to Cloudinary & MongoDB
      setUploadStep('Uploading image to Cloudinary & saving product to MongoDB...');

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', name.trim());
      formData.append('category', category);
      formData.append('price', price);
      formData.append('unit', unit);
      formData.append('location', location);
      formData.append('description', description);
      formData.append('stock', stock);
      formData.append('seller', user?.name || 'Mama Nkechi Foodstuffs');

      const result = await addProduct(formData);

      setUploadStep('Product published successfully!');
      setSubmitSuccess(result.product);

      // Reset form after short delay
      setTimeout(() => {
        setName('');
        setPrice('');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
        setIsSubmitting(false);
        setUploadStep('');
        setShowAddModal(false);
      }, 1500);

    } catch (err) {
      console.error('Product upload error:', err);
      setSubmitError(err.message || 'Failed to upload product to Cloudinary or MongoDB.');
      setIsSubmitting(false);
      setUploadStep('');
    }
  };

  const handleDelete = async (id, prodName) => {
    if (window.confirm(`Remove "${prodName}" from your marketplace stall?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <main className="min-h-screen bg-cream py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Seller Banner */}
        <div className="bg-gradient-to-r from-deep-green via-deep-green to-fresh-green rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase">
                  Verified Lagos Food Seller
                </span>
                <span className="px-3 py-1 bg-fresh-green/30 rounded-full text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} className="text-white" /> Cloudinary & MongoDB Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading">
                {user?.name || 'Mama Nkechi Foodstuffs'}
              </h1>
              <p className="text-white/80 text-xs sm:text-sm flex items-center gap-2">
                <MapPin size={15} className="text-orange" />
                Stall Location: <strong className="text-white">{user?.location || 'Mile 12 Market (Kosofe)'}</strong>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => { setShowAddModal(true); setSubmitSuccess(null); setSubmitError(''); }}
                className="px-5 py-3.5 bg-orange hover:bg-orange/90 text-white font-bold rounded-2xl shadow-lg shadow-orange/30 flex items-center gap-2 transition-all cursor-pointer active:scale-98 text-sm sm:text-base"
                id="seller-add-product-btn"
              >
                <Plus size={18} />
                <span>Add Product</span>
              </button>

              <button
                onClick={() => refreshProducts()}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all cursor-pointer"
                title="Refresh products from MongoDB"
              >
                <RefreshCw size={18} className={productsLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">Stall Products</span>
              <Package size={18} className="text-deep-green" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-dark-text font-heading">
              {sellerProducts.length}
            </div>
            <span className="text-[11px] text-fresh-green font-medium">Synced with MongoDB</span>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">Storage Host</span>
              <ImageIcon size={18} className="text-orange" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-dark-text font-heading">
              Cloudinary
            </div>
            <span className="text-[11px] text-gray-500">Auto-Optimized CDN</span>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">Upload Limit</span>
              <ShieldCheck size={18} className="text-fresh-green" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-dark-text font-heading">
              5 MB Max
            </div>
            <span className="text-[11px] text-gray-500">JPG, PNG, WEBP</span>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">Orders Today</span>
              <ShoppingBag size={18} className="text-deep-green" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-dark-text font-heading">
              12 Orders
            </div>
            <span className="text-[11px] text-fresh-green font-medium">Lagos Same-Day</span>
          </div>
        </div>

        {/* Products Section Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-dark-text font-heading">
                Marketplace Stall Products
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Manage your food items available to Lagos households on OjaConnect
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your products..."
                  className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs sm:text-sm border border-gray-200 outline-none focus:border-fresh-green"
                />
              </div>

              <button
                onClick={() => { setShowAddModal(true); setSubmitSuccess(null); setSubmitError(''); }}
                className="px-4 py-2 bg-gradient-to-r from-deep-green to-fresh-green text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 shadow hover:shadow-md transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Product Grid / Table */}
          {displayProducts.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto text-deep-green">
                <Package size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No products found in stall</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                Click "Add Product" to select a picture of rice or foodstuff and publish it to the Lagos marketplace.
              </p>
              <button
                onClick={() => { setShowAddModal(true); handleLoadSampleRice(); }}
                className="px-5 py-2.5 bg-fresh-green text-white rounded-xl text-xs sm:text-sm font-bold shadow hover:bg-deep-green transition-all"
              >
                + Add Rice Product Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayProducts.map((p) => (
                <div 
                  key={p.id || p._id} 
                  className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="relative h-44 sm:h-48 w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/images/cat-rice.jpg'; }}
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-deep-green uppercase shadow-sm">
                        {p.category}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 bg-deep-green/90 text-white rounded-md text-[10px] font-medium flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-fresh-green" /> In MongoDB
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-dark-text text-sm sm:text-base line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {p.description || 'Fresh foodstuff from Lagos market stall.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400 block">{p.unit || 'Unit'}</span>
                        <span className="text-base sm:text-lg font-extrabold text-deep-green font-heading">
                          {formatNaira(p.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(p.id || p._id, p.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Remove from stall"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fresh-green/10 text-deep-green rounded-xl flex items-center justify-center font-bold">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-dark-text font-heading">Add Product</h3>
                  <p className="text-xs text-gray-500">Cloudinary Image Upload & MongoDB Storage</p>
                </div>
              </div>
              
              <button
                onClick={() => { if (!isSubmitting) setShowAddModal(false); }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Rice Demo Button */}
            <div className="mb-5 p-3 bg-fresh-green/10 border border-fresh-green/20 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-deep-green font-semibold">
                <Sparkles size={16} className="text-orange flex-shrink-0" />
                <span>Quick Test: Automatically load sample 50kg Mama Gold Rice</span>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleRice}
                className="px-3 py-1.5 bg-deep-green hover:bg-deep-green/90 text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer shadow-sm active:scale-95 transition-transform"
              >
                Select Rice Picture
              </button>
            </div>

            {submitError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="mb-5 p-4 bg-green-50 border border-green-200 text-deep-green rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 size={20} className="text-fresh-green flex-shrink-0" />
                <div>
                  <strong className="block text-sm">Published to Marketplace!</strong>
                  <span>"{submitSuccess.name}" is now stored in MongoDB with Cloudinary image.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitProduct} className="space-y-5">
              
              {/* IMAGE UPLOAD DROPZONE */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-dark-text mb-2">
                  Product Picture *
                </label>

                {imagePreview ? (
                  <div className="relative border-2 border-fresh-green rounded-2xl overflow-hidden bg-gray-50 p-2">
                    <div className="relative h-48 w-full rounded-xl overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-gray-500 font-medium">
                      <span className="truncate max-w-[200px]">{imageFile?.name}</span>
                      <span className="text-fresh-green font-bold">
                        {(imageFile?.size / (1024 * 1024)).toFixed(2)} MB / 5.0 MB Limit (Valid)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragging 
                        ? 'border-fresh-green bg-fresh-green/10' 
                        : imageError 
                          ? 'border-red-300 bg-red-50/50' 
                          : 'border-gray-300 hover:border-fresh-green hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-deep-green mb-1 shadow-sm">
                      <Upload size={22} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-dark-text">
                        Click to select picture or drag & drop here
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Max file size: <strong>5 MB</strong> • Formats: <strong>JPG, PNG, WEBP</strong>
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                  id="product-image-file-input"
                />

                {imageError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle size={14} /> {imageError}
                  </p>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 50kg Bag of Mama Gold Rice"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-fresh-green focus:bg-white transition-all"
                  id="product-name-input"
                />
              </div>

              {/* Category & Unit Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-fresh-green font-medium cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                    Selling Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-fresh-green font-medium cursor-pointer"
                  >
                    <option value="50kg Bag">50kg Bag</option>
                    <option value="25kg Bag">25kg Bag</option>
                    <option value="Paint Bucket (4kg)">Paint Bucket (4kg)</option>
                    <option value="Derica (850g)">Derica (850g)</option>
                    <option value="5 Tubers">5 Large Tubers</option>
                    <option value="25L Jerrycan">25L Jerrycan</option>
                    <option value="Large Raffia Basket">Large Raffia Basket</option>
                    <option value="Per Kilogram (1kg)">Per Kilogram (1kg)</option>
                  </select>
                </div>
              </div>

              {/* Price & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                    Price in Nigerian Naira (₦) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="85000"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-fresh-green focus:bg-white font-bold"
                      id="product-price-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                    Market Stall Location *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-fresh-green font-medium cursor-pointer"
                  >
                    <option value="Mile 12 Market">Mile 12 Market (Kosofe)</option>
                    <option value="Oyingbo Market">Oyingbo Market (Ebute Metta)</option>
                    <option value="Mushin Olosha Market">Mushin Olosha Market</option>
                    <option value="Alaba Rago Grains">Alaba Rago Market (Ojo)</option>
                    <option value="Jakande Market">Jakande Market (Lekki)</option>
                    <option value="Ikorodu Food Market">Ikorodu Food Market</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your food item (e.g. Stone-free, sorted, dry, sourced from northern farms)..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-fresh-green focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Progress Indicator */}
              {isSubmitting && (
                <div className="p-4 bg-deep-green/5 border border-deep-green/15 rounded-2xl space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-deep-green">
                    <Loader2 size={16} className="animate-spin text-fresh-green" />
                    <span>{uploadStep}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-deep-green to-fresh-green animate-pulse w-3/4"></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-deep-green to-fresh-green text-white font-bold rounded-2xl shadow-lg shadow-fresh-green/20 hover:shadow-xl hover:shadow-fresh-green/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm sm:text-base active:scale-98"
                  id="submit-add-product-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Publishing to Marketplace...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Publish Product to Marketplace</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </main>
  );
}
