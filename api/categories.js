
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

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ success: true, count: categories.length, data: categories });
};
