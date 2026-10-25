const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [120, 'Product name cannot exceed 120 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'rice-grains', 'beans-legumes', 'garri-cassava', 'yam-potatoes',
      'palm-oil-groundnut', 'fresh-vegetables', 'fruits', 'meat-poultry',
      'fish-seafood', 'peppers-onions-tomatoes', 'spices-seasonings', 'flour-baking'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Product price in Naira (₦) is required'],
    min: [1, 'Price must be greater than zero']
  },
  unit: {
    type: String,
    default: '50kg Bag',
    trim: true
  },
  seller: {
    type: String,
    required: [true, 'Seller business name is required'],
    trim: true
  },
  sellerId: {
    type: String,
    default: ''
  },
  sellerEmail: {
    type: String,
    default: ''
  },
  sellerPhone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: [true, 'Lagos market location is required'],
    trim: true
  },
  area: {
    type: String,
    default: 'Lagos Mainland'
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  cloudinaryPublicId: {
    type: String,
    default: ''
  },
  storageProvider: {
    type: String,
    enum: ['cloudinary', 'local', 'seeded'],
    default: 'cloudinary'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  },
  delivery: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast text search and category queries
productSchema.index({ name: 'text', description: 'text', seller: 'text' });
productSchema.index({ category: 1, location: 1 });

module.exports = mongoose.model('Product', productSchema);
