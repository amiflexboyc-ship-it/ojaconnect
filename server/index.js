const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 5000;

// Seed Data
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

let products = [
  {
    id: 1,
    name: '50kg Bag of Mama Gold Rice',
    category: 'rice-grains',
    price: 85000,
    unit: '50kg Bag',
    seller: 'Alhaji Bello Grains',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-rice.jpg',
    available: true,
    delivery: true,
    description: 'Direct stone-free Nigerian parboiled rice sourced directly from Kebbi farmers to Mile 12.'
  },
  {
    id: 2,
    name: '50kg Bag of Oloyin Beans',
    category: 'beans-legumes',
    price: 65000,
    unit: '50kg Bag',
    seller: 'Mama Nkechi Foodstuffs',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-beans.jpg',
    available: true,
    delivery: true,
    description: 'Sweet honey beans clean of weevils, perfectly stored in dry bags.'
  },
  {
    id: 3,
    name: 'Ijebu Garri (Bag)',
    category: 'garri-cassava',
    price: 32000,
    unit: 'Bag (50kg)',
    seller: 'Iya Moria Provisions',
    location: 'Oyingbo Market',
    area: 'Lagos Mainland',
    image: '/images/cat-garri.jpg',
    available: true,
    delivery: true,
    description: 'Authentic sharp and crispy white Ijebu Garri directly from Ogun/Ijebu farms.'
  },
  {
    id: 4,
    name: 'Tubers of Abuja Yam (5 pcs)',
    category: 'yam-potatoes',
    price: 28000,
    unit: '5 Tubers',
    seller: 'Mallam Sani Yam Depot',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-yam.jpg',
    available: true,
    delivery: true,
    description: 'Large, firm sweet white Abuja yams, ideal for pounding and boiling.'
  },
  {
    id: 5,
    name: '25L Jerrycan Pure Palm Oil',
    category: 'palm-oil-groundnut',
    price: 45000,
    unit: '25L Jerrycan',
    seller: 'Ondo Fresh Oil Depot',
    location: 'Mushin Market',
    area: 'Lagos Mainland',
    image: '/images/cat-palmoil.jpg',
    available: true,
    delivery: true,
    description: 'First-press unadulterated red palm oil with rich aroma and natural red pigment.'
  },
  {
    id: 6,
    name: 'Fresh Lagos Basket Tomatoes',
    category: 'peppers-onions-tomatoes',
    price: 38000,
    unit: 'Large Raffia Basket',
    seller: 'Alhaji Danladi Produce',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-vegetables.jpg',
    available: true,
    delivery: true,
    description: 'Direct Northern Jos farm tomatoes, firm and fresh without bruises.'
  }
];

let orders = [
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

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { status: 'healthy', service: 'OjaConnect Node API', uptime: process.uptime() });
  }

  if (method === 'GET' && pathname === '/api/categories') {
    return sendJson(res, 200, { success: true, count: categories.length, data: categories });
  }

  if (method === 'GET' && pathname === '/api/products') {
    let result = [...products];
    const { category, location, search } = parsedUrl.query;
    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    if (location && location !== 'all') {
      result = result.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q));
    }
    return sendJson(res, 200, { success: true, count: result.length, data: result });
  }

  if (method === 'GET' && pathname.startsWith('/api/products/')) {
    const id = pathname.split('/')[3];
    const prod = products.find(p => String(p.id) === String(id));
    if (!prod) return sendJson(res, 404, { success: false, message: 'Product not found' });
    return sendJson(res, 200, { success: true, data: prod });
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let payload = {};
    if (body) {
      try { payload = JSON.parse(body); } catch (e) {}
    }

    if (method === 'POST' && pathname === '/api/products') {
      if (!payload.name || !payload.price) {
        return sendJson(res, 400, { success: false, message: 'Name and price required' });
      }
      const newProd = {
        id: Date.now(),
        name: payload.name,
        category: payload.category || 'rice-grains',
        price: Number(payload.price),
        unit: payload.unit || 'Unit',
        seller: payload.seller || 'Mama Nkechi Foodstuffs',
        location: payload.location || 'Mile 12 Market',
        area: payload.location?.includes('Lekki') || payload.location?.includes('Island') ? 'Lagos Island' : 'Lagos Mainland',
        image: payload.image || '/images/cat-rice.jpg',
        available: true,
        delivery: true,
        description: payload.description || 'Fresh produce direct from Lagos market stall.'
      };
      products.unshift(newProd);
      return sendJson(res, 201, { success: true, data: newProd });
    }

    if (method === 'GET' && pathname === '/api/orders') {
      return sendJson(res, 200, { success: true, count: orders.length, data: orders });
    }

    if (method === 'POST' && pathname === '/api/orders') {
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
      orders.unshift(newOrder);
      return sendJson(res, 201, { success: true, data: newOrder });
    }

    if (method === 'POST' && pathname === '/api/payments/initialize') {
      const reference = 'PAY_' + Math.random().toString(36).substring(2, 12).toUpperCase();
      return sendJson(res, 200, {
        success: true,
        message: 'Payment initialized',
        data: {
          authorization_url: `https://checkout.paystack.com/simulate/${reference}`,
          access_code: reference,
          reference: reference,
          amount: payload.amount
        }
      });
    }

    sendJson(res, 404, { success: false, message: 'API Endpoint not found' });
  });
});

server.listen(PORT, () => {
  console.log(`OjaConnect Zero-Dependency API Server listening on port ${PORT}`);
});
