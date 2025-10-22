// Thin controller for direct response endpoints (optional)
exports.response = (req, res) => {
  const data = Object.keys(req.body || {}).length ? req.body : req.query;
  console.log('PayU response:', data);
  res.send('<html><body><h3>Thank you. Payment processed.</h3></body></html>');
};
