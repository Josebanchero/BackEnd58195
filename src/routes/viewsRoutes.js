const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

// Rutas para vistas
router.get('/products', viewsController.showAllProducts);
router.get('/carts/:cid', viewsController.showCart);

module.exports = router;


router.get('/products', async (req, res) => {
  });
  
  router.get('/carts/:cid', async (req, res) => {
  });
  
  