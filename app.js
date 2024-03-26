const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const path = require('path'); 
const { generateUniqueId } = require('./utils/utils');
const ProductManager = require('./ProductManager');
const Dao = require('./Dao/dao');

// Crear la instancia de Express
const app = express();

// Crear el servidor HTTP y el socket
const server = http.createServer(app);
const io = socketIO(server);

// Configurar el puerto
const port = process.env.PORT || 3000;

// Configurar Express
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de Handlebars
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rutas para productos
const productManager = new ProductManager(new Dao());

app.post('/addProduct', async (req, res) => {
    try {
        // ... (código para agregar productos)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el producto.');
    }
});

app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos.');
    }
});

app.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos en tiempo real.');
    }
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

// Middleware para evitar acceder a 'node_modules'
app.use((req, res, next) => {
    if (req.url.includes('node_modules')) {
        return res.status(404).send('Resource not found');
    }
    next();
});

// Configuración de Passport y sesión
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// Importar las rutas para autenticación y productos
const authRoutes = require('./src/routes/authRoutes')
const productRoutes = require('./src/routes/productRoutes');
const authController = require('./src/controllers/authController');
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Ruta de retorno después de la autorización en GitHub
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Redirige a la página de inicio u otra página de tu aplicación
    res.redirect('/');
  });


// Configurar el motor de plantillas Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Escuchar en el puerto 3000
server.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});

// Ruta de login
app.get('/login', (req, res) => {
    res.render('login'); // Renderiza la vista de login
});


module.exports = app;