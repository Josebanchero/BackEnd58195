

const express = require('express');
const router = express.Router();
const app = require('../../app')
const authController = require('../controllers/authController'); 
const passport = require('passport');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Ruta de autorización de GitHub
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));


  router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));


module.exports = router;



