
const products = [
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
    seller: 'Iya Moria Provisions',
    location: 'Oyingbo Market',
    area: 'Lagos Mainland',
    image: '/images/cat-beans.jpg',
    available: true,
    delivery: true,
    description: 'Sweet honey beans carefully handpicked and free of weevils.'
  },
  {
    id: 3,
    name: 'Paint Bucket of Ijebu Garri (4kg)',
    category: 'garri-cassava',
    price: 5200,
    unit: 'Paint Bucket (4kg)',
    seller: 'Mama Nkechi Foodstuffs',
    location: 'Mushin Olosha Market',
    area: 'Lagos Mainland',
    image: '/images/cat-garri.jpg',
    available: true,
    delivery: true,
    description: 'Very dry and crispy sour Ijebu Garri. Excellent for soaking with ice water, milk, and groundnut.'
  },
  {
    id: 4,
    name: '5 Large Abuja Tubers of Yam',
    category: 'yam-potatoes',
    price: 18500,
    unit: '5 Large Tubers',
    seller: 'Baba Segun Yam Depot',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-yam.jpg',
    available: true,
    delivery: true,
    description: 'Firm and sweet old Abuja yams, ideal for smooth pounded yam or fried yam chips.'
  },
  {
    id: 5,
    name: '25-Litre Jerrycan of Pure Nsukka Palm Oil',
    category: 'palm-oil-groundnut',
    price: 42000,
    unit: '25L Jerrycan',
    seller: 'Mama Chioma Palm Oil',
    location: 'Jakande Market',
    area: 'Lagos Island',
    image: '/images/cat-palmoil.jpg',
    available: true,
    delivery: true,
    description: 'Unadulterated thick red palm oil from the heart of eastern palm plantations.'
  },
  {
    id: 6,
    name: 'Big Basket of Fresh Ripe Tomatoes',
    category: 'peppers-onions-tomatoes',
    price: 24000,
    unit: 'Large Rafia Basket',
    seller: 'Mallam Sani Vegetable Stall',
    location: 'Mile 12 Market',
    area: 'Lagos Mainland',
    image: '/images/cat-vegetables.jpg',
    available: true,
    delivery: true,
    description: 'Fresh, firm Jos tomatoes delivered this morning to Mile 12. Great for rich Nigerian party jollof.'
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { category, search } = req.query || {};

  let result = products;
  if (category) {
    result = result.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
  }

  res.status(200).json({ success: true, count: result.length, data: result });
};
