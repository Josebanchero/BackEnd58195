// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para mostrar el formulario de registro
router.get('/register', authController.getRegister);

// Ruta para procesar el formulario de registro
router.post('/register', authController.postRegister);

module.exports = router;
