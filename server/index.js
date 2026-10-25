require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const Product = require('./models/Product');
const { requireSellerAuth } = require('./middleware/auth');
const { uploadProductImage, MAX_FILE_SIZE } = require('./middleware/upload');
const { uploadToCloudinary, isCloudinaryConfigured } = require('./utils/cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ojaconnect';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-seller-role', 'x-seller-id', 'x-user-payload']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve local fallback uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Categories Seed Data
const categories = [
  { id: 'rice-grains', name: 'Rice and Grains', count: 24 },
  { id: 'beans-legumes', name: 'Beans and Legumes', count: 18 },
  { id: 'garri-cassava', name: 'Garri and Cassava Products', count: 15 },
  { id: 'yam-potatoes', name: 'Yam and Potatoes', count: 22 },
  { id: 'palm-oil-groundnut', name: 'Palm Oil and Groundnut Oil', count: 12 },
  { id: 'fresh-vegetables', name: 'Fresh Vegetables', count: 35 },
  { id: 'fruits', name: 'Fruits', count: 28 },
  { id: 'meat-poultry', name: 'Meat and Poultry', count: 19 },
  { id: 'fish-seafood', name: 'Fish and Seafood', count: 14 },
  { id: 'peppers-onions-tomatoes', name: 'Peppers, Onions and Tomatoes', count: 42 },
  { id: 'spices-seasonings', name: 'Spices and Seasonings', count: 30 },
  { id: 'flour-baking', name: 'Flour and Baking Essentials', count: 16 }
];

// Initial Seed Products
const initialSeedProducts = [
  {
    name: '50kg Bag of Mama Gold Rice',
    category: 'rice-grains',
    price: 85000,
    unit: '50kg Bag',
    seller: 'Alhaji Bello Grains',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-rice.jpg',
    storageProvider: 'seeded',
    available: true,
    delivery: true,
    description: 'Direct stone-free Nigerian parboiled rice sourced directly from Kebbi farmers to Mile 12.'
  },
  {
    name: '50kg Bag of Oloyin Beans',
    category: 'beans-legumes',
    price: 65000,
    unit: '50kg Bag',
    seller: 'Mama Nkechi Foodstuffs',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-beans.jpg',
    storageProvider: 'seeded',
    available: true,
    delivery: true,
    description: 'Sweet honey beans clean of weevils, perfectly stored in dry bags.'
  },
  {
    name: 'Ijebu Garri (Bag)',
    category: 'garri-cassava',
    price: 32000,
    unit: 'Bag (50kg)',
    seller: 'Iya Moria Provisions',
    location: 'Oyingbo Market',
    area: 'Lagos Mainland',
    image: '/images/cat-garri.jpg',
    storageProvider: 'seeded',
    available: true,
    delivery: true,
    description: 'Authentic sharp and crispy white Ijebu Garri directly from Ogun/Ijebu farms.'
  },
  {
    name: 'Tubers of Abuja Yam (5 pcs)',
    category: 'yam-potatoes',
    price: 28000,
    unit: '5 Tubers',
    seller: 'Mallam Sani Yam Depot',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-yam.jpg',
    storageProvider: 'seeded',
    available: true,
    delivery: true,
    description: 'Large, firm sweet white Abuja yams, ideal for pounding and boiling.'
  },
  {
    name: '25L Jerrycan Pure Palm Oil',
    category: 'palm-oil-groundnut',
    price: 45000,
    unit: '25L Jerrycan',
    seller: 'Ondo Fresh Oil Depot',
    location: 'Mushin Market',
    area: 'Lagos Mainland',
    image: '/images/cat-palmoil.jpg',
    storageProvider: 'seeded',
    available: true,
    delivery: true,
    description: 'First-press unadulterated red palm oil with rich aroma and natural red pigment.'
  },
  {
    name: 'Fresh Lagos Basket Tomatoes',
    category: 'peppers-onions-tomatoes',
    price: 38000,
    unit: 'Large Raffia Basket',
    seller: 'Alhaji Danladi Produce',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-vegetables.jpg',
    storageProvider: 'seeded',
    available: true,
    delivery: true,
    description: 'Direct Northern Jos farm tomatoes, firm and fresh without bruises.'
  }
];

let inMemoryOrders = [
  {
    id: 'OJA-892144',
    date: '24 Oct 2026',
    customer: 'Babatunde Adeleke',
    phone: '0803 123 4567',
    items: [{ id: 1, name: '50kg Bag of Mama Gold Rice', quantity: 1, price: 85000, seller: 'Alhaji Bello Grains' }],
    total: 86800,
    subtotal: 85000,
    deliveryFee: 1800,
    shipping: { address: '12 Allen Avenue', lga: 'Ikeja' },
    status: 'Order Placed',
    paymentStatus: 'Paid via Paystack'
  }
];

// In-memory fallback if MongoDB connection fails
let inMemoryProducts = [...initialSeedProducts.map((p, i) => ({ ...p, _id: 'seed_' + (i + 1), id: i + 1 }))];

// Connect to MongoDB
let isDbConnected = false;
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
}).then(async () => {
  isDbConnected = true;
  console.log('[MongoDB] Connected successfully to:', MONGODB_URI);

  // Pre-seed initial products if collection is empty
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('[MongoDB] Seeding default Lagos marketplace products...');
    await Product.insertMany(initialSeedProducts);
    console.log('[MongoDB] Seeded successfully!');
  }
}).catch((err) => {
  console.warn('[MongoDB] Connection notice:', err.message);
  console.log('[MongoDB] Operating with robust in-memory database fallback.');
});

// ---------------------- ROUTES ----------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OjaConnect Node + MongoDB + Cloudinary API',
    database: isDbConnected ? 'MongoDB Connected' : 'In-Memory Fallback',
    cloudinary: isCloudinaryConfigured() ? 'Cloudinary Active' : 'Local Fallback Storage Active',
    uptime: process.uptime()
  });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, count: categories.length, data: categories });
});

// GET /api/products - Fetch all products with filtering
app.get('/api/products', async (req, res) => {
  try {
    const { category, location, search, seller } = req.query;
    
    if (isDbConnected) {
      let query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (location && location !== 'all') {
        query.location = { $regex: location, $options: 'i' };
      }
      if (seller) {
        query.seller = { $regex: seller, $options: 'i' };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { seller: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: products.length, data: products });
    }

    // In-memory fallback
    let result = [...inMemoryProducts];
    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    if (location && location !== 'all') {
      result = result.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (seller) {
      result = result.filter(p => p.seller.toLowerCase().includes(seller.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.seller.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: err.message });
  }
});

// GET /api/products/:id - Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id);
      if (product) return res.json({ success: true, data: product });
    }
    const found = inMemoryProducts.find(p => String(p._id) === String(id) || String(p.id) === String(id));
    if (found) return res.json({ success: true, data: found });

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving product', error: err.message });
  }
});

// POST /api/products - ADD PRODUCT WITH CLOUDINARY UPLOAD & MONGODB STORAGE
// Protected with requireSellerAuth and uploadProductImage
app.post('/api/products', requireSellerAuth, uploadProductImage, async (req, res) => {
  try {
    const { name, category, price, unit, location, description, stock } = req.body;

    // 1. Validate required textual fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required (e.g. 50kg Bag of Mama Gold Rice).' });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: 'Please select a valid food category.' });
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid price in Nigerian Naira (₦).' });
    }

    // 2. Validate image file presence
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image provided',
        message: 'Please select a product picture (JPEG, PNG, or WEBP under 5MB).'
      });
    }

    console.log(`[Upload] Processing image for product "${name}" (${req.file.size} bytes, ${req.file.mimetype})...`);

    // 3. Upload image to Cloudinary (or local fallback if credentials placeholder)
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    console.log('[Upload] Image stored successfully! URL:', uploadResult.url, 'Provider:', uploadResult.provider);

    // 4. Construct Product Document
    const sellerInfo = req.seller || {};
    const productData = {
      name: name.trim(),
      category: category,
      price: Number(price),
      unit: unit ? unit.trim() : '50kg Bag',
      seller: sellerInfo.name || req.body.seller || 'Verified Lagos Seller',
      sellerId: sellerInfo.id || '',
      sellerEmail: sellerInfo.email || '',
      sellerPhone: sellerInfo.phone || '',
      location: location || sellerInfo.location || 'Mile 12 Market',
      area: (location || '').toLowerCase().includes('lekki') || (location || '').toLowerCase().includes('island') ? 'Lagos Island' : 'Lagos Mainland',
      image: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      storageProvider: uploadResult.provider,
      description: description ? description.trim() : `Fresh ${name} direct from Lagos food market.`,
      stock: stock ? Number(stock) : 100,
      available: true,
      delivery: true,
      createdAt: new Date()
    };

    // 5. Save to MongoDB
    let savedProduct;
    if (isDbConnected) {
      const productDoc = new Product(productData);
      savedProduct = await productDoc.save();
      console.log('[MongoDB] Product saved to database with ID:', savedProduct._id);
    } else {
      savedProduct = {
        _id: 'prod_' + Date.now(),
        id: Date.now(),
        ...productData
      };
      console.log('[InMemory] Product saved to in-memory store with ID:', savedProduct._id);
    }

    // Keep in-memory list synchronized so all views update instantly
    inMemoryProducts.unshift(savedProduct);

    // 6. Return response
    return res.status(201).json({
      success: true,
      message: `"${savedProduct.name}" has been published to OjaConnect Marketplace!`,
      data: savedProduct
    });

  } catch (error) {
    console.error('[Add Product Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image or save product to database.',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Remove product
app.delete('/api/products/:id', requireSellerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
    }
    inMemoryProducts = inMemoryProducts.filter(p => String(p._id) !== String(id) && String(p.id) !== String(id));
    res.json({ success: true, message: 'Product removed from marketplace stall.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: err.message });
  }
});

// Orders Endpoints
app.get('/api/orders', (req, res) => {
  res.json({ success: true, count: inMemoryOrders.length, data: inMemoryOrders });
});

app.post('/api/orders', (req, res) => {
  const payload = req.body || {};
  const newOrder = {
    id: 'OJA-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    items: payload.items || [],
    shipping: payload.shipping || {},
    total: payload.total || 0,
    subtotal: payload.subtotal || 0,
    deliveryFee: payload.deliveryFee || 0,
    status: 'Order Placed',
    paymentStatus: payload.paymentMethod === 'cod' ? 'Pending on Delivery' : 'Paid via Paystack'
  };
  inMemoryOrders.unshift(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

// Paystack payment initialization
app.post('/api/payments/initialize', (req, res) => {
  const reference = 'PAY_' + Math.random().toString(36).substring(2, 12).toUpperCase();
  res.json({
    success: true,
    message: 'Payment initialized',
    data: {
      authorization_url: `https://checkout.paystack.com/simulate/${reference}`,
      access_code: reference,
      reference: reference,
      amount: req.body?.amount || 0
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`OjaConnect Backend listening on port ${PORT}`);
  console.log(`Image Upload: Cloudinary ready with 5MB limit (JPEG/PNG/WEBP)`);
  console.log(`Database: ${MONGODB_URI}`);
});
