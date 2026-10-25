import { useState } from 'react';
import { Store, Phone, Mail, MapPin, Camera, CheckCircle, ArrowRight } from 'lucide-react';
import { lagosLocations, categories } from '../data';

export default function BecomeSellerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', shopName: '', address: '',
    neighbourhood: '', categories: [], deliveryAreas: [],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategoryToggle = (catId) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
        <div className="max-w-md text-center bg-white rounded-3xl p-10 shadow-xl">
          <div className="w-20 h-20 bg-fresh-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-fresh-green" />
          </div>
          <h2 className="text-2xl font-bold text-dark-text font-heading mb-3">Application Received</h2>
          <p className="text-gray-500 mb-6">
            Thank you for your interest in selling on OjaConnect. Your application has been submitted and will be reviewed. You will receive a notification once your account has been approved and verified.
          </p>
          <p className="text-xs text-gray-400">This is a demonstration. In the production version, your application would be reviewed by the OjaConnect team.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-deep-green to-fresh-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-dark-text font-heading mb-3">
            Bring Your Foodstuff Business Online
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Reach more customers across Lagos and grow your business with OjaConnect. Fill out the form below to get started.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Your full name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green transition-all" id="seller-name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+234 800 000 0000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green transition-all" id="seller-phone" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green transition-all" id="seller-email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Shop Name *</label>
              <input type="text" name="shopName" value={form.shopName} onChange={handleChange} required placeholder="Your shop name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green transition-all" id="seller-shop" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Address *</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} required placeholder="Your shop or business address" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green transition-all" id="seller-address" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Lagos Neighbourhood *</label>
              <select name="neighbourhood" value={form.neighbourhood} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fresh-green/30 focus:border-fresh-green transition-all appearance-none" id="seller-neighbourhood">
                <option value="">Select your area</option>
                {lagosLocations.slice(1).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Shop Photographs</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <Camera size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">Upload shop photos (optional)</span>
              </div>
            </div>
          </div>

          {/* Food Categories */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Food Categories You Sell *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <label key={cat.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 ${
                  form.categories.includes(cat.id)
                    ? 'bg-fresh-green/10 text-deep-green border border-fresh-green/30'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}>
                  <input type="checkbox" checked={form.categories.includes(cat.id)} onChange={() => handleCategoryToggle(cat.id)} className="w-4 h-4 accent-fresh-green rounded" />
                  <span className="truncate">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-orange/5 border border-orange/15 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Verification:</strong> After submitting your application, the OjaConnect team will review your information. Once approved, you will be able to create your seller profile and start listing products. Sellers are verified before being displayed with a verified badge.
            </p>
          </div>

          <button type="submit" className="w-full mt-8 py-4 bg-gradient-to-r from-deep-green to-fresh-green text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-fresh-green/25 transition-all duration-300 flex items-center justify-center gap-2" id="seller-submit">
            Submit Application <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}
