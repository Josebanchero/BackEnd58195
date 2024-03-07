const Product = require('../models/productModel');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json({ status: 'success', payload: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const newProduct = await Product.create(req.body);
      res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  // Otras funciones para productos...
};

module.exports = productController;
