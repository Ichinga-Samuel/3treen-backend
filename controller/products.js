exports.getAddProduct = (req, res) => {
  res.status(200).json({ succsess: 'added product/listing' });
};

exports.postAddProduct = (req, res) => {
  res.status(200).json({ succsess: 'adding a product' });
};