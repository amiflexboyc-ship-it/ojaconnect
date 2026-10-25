
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'healthy',
    service: 'OjaConnect Vercel Serverless API',
    timestamp: new Date().toISOString()
  });
};
