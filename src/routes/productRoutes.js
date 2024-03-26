const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas para productos
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);

module.exports = router;



router.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort || '';
      const query = req.query.query || '';
      const filterCategory = req.query.category || ''; 
      const filterAvailability = req.query.availability || ''; 
  
      const filter = {}; // Objeto para almacenar los filtros
  
      // Aplicar filtros según los parámetros recibidos
      if (filterCategory) {
        filter.category = filterCategory;
      }
  
      if (filterAvailability) {
        filter.availability = filterAvailability;
      }
  
     
  
      // Calcular información de paginación
      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;
  
      // Construir objeto de respuesta
      const response = {
        status: 'success',
        payload: 'valor_especifico',
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null,
        nextLink: hasNextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null,
      };
  
      // Enviar respuesta al cliente
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });
  
  