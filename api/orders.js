
const orders = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const order = req.body || {};
    order.id = 'OJA-' + Math.floor(100000 + Math.random() * 900000);
    order.createdAt = new Date().toISOString();
    order.status = 'confirmed';
    orders.push(order);
    return res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
  }

  res.status(200).json({ success: true, count: orders.length, data: orders });
};
