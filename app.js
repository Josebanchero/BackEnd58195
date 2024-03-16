// app.js
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const { generateUniqueId } = require('./utils');
const ProductManager = require('./ProductManager');
const Dao = require('./Dao/dao');


const server = http.createServer(app);
const io = socketIO(server);

const port = 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const productManager = new ProductManager(new Dao());

// Configuración de Handlebars
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views'); // Establecer la carpeta de vistas

// Rutas para productos
app.post('/addProduct', async (req, res) => {
  try {
    // ... (código para agregar productos)
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el producto.');
  }
});

// Ruta para la vista home
app.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos.');
  }
});

// Ruta para la vista realTimeProducts
app.get('/realTimeProducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos en tiempo real.');
  }
});

// Ruta para la vista chat
app.get('/chat', (req, res) => {
  res.render('chat');
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

// app.js
const express = require('express');
const app = express();

// Importar las rutas
const authRoutes = require('./routes/authRoutes');

// Configurar el motor de plantillas Handlebars
app.set('view engine', 'handlebars');

// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', authRoutes); // Rutas de autenticación

// Escuchar en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor en ejecución en el puerto 3000');
});
