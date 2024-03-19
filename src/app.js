
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs').promises;
const path = require('path');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const passportConfig = require('./config/passport-config');




const { generateUniqueId } = require('./utils'); // Importar la función desde utils.js
const ProductManager = require('./ProductManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);

app.listen(3000, () => {
    console.log('Servidor en ejecución en el puerto 3000');
});


const productManager = new ProductManager('productos.json');

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Rutas para productos
app.post('/addProduct', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const product = {
      id: generateUniqueId(), // Utilizar la función para generar un ID único
      title,
      description,
      price
    };

    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el producto.');
  }
});

// Ruta a la vista home
app.get('/', (req, res) => {
  res.render('home');
});

// Ruta a la vista realtimeproducts
app.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts');
});

// Configuración de la carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Manejo de WebSockets
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });

  // Evento para crear un nuevo producto desde la vista realTimeProducts.handlebars
  socket.on('createProduct', async (newProduct) => {
    try {
      newProduct.id = generateUniqueId(); // Asignar un ID único al nuevo producto
      await productManager.addProduct(newProduct);
      const products = await productManager.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error(error);
    }
  });

  // Evento para eliminar un producto desde la vista realTimeProducts.handlebars
  socket.on('deleteProduct', async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const products = await productManager.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error(error);
    }
  });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
