const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Rutas para carritos
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid', cartController.clearCart);

module.exports = router;




router.delete('/:cid/products/:pid', async (req, res) => {
  });
  
  router.put('/:cid', async (req, res) => {
  });
  
  router.put('/:cid/products/:pid', async (req, res) => {
  });
  
  router.delete('/:cid', async (req, res) => {
  });
  
  