// app.js
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs').promises;

const { generateUniqueId } = require('./utils'); // Importar la función desde utils.js
const ProductManager = require('./ProductManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productManager = new ProductManager('productos.json');

// Configuración de Handlebars
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

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
