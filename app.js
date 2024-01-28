const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

app.use(express.json());

const productManager = new ProductManager('productos.json');

// Rutas para productos
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);
    res.json({ message: 'Producto agregado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto.' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    await productManager.updateProduct(productId, updatedProduct);
    res.json({ message: 'Producto actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

app.use('/api/products', productsRouter);

// Rutas para carritos
const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = req.body;
    const carts = await loadCartsFromFile();
    const existingCart = carts.find(cart => cart.id === newCart.id);

    if (existingCart) {
      res.status(400).json({ error: 'Ya existe un carrito con el mismo ID.' });
    } else {
      carts.push(newCart);
      await saveCartsToFile(carts);
      res.json({ message: 'Carrito creado correctamente.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el carrito.' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const carts = await loadCartsFromFile();
    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito.' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;

    const carts = await loadCartsFromFile();
    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
      const existingProduct = cart.products.find(product => product.id === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }

      await saveCartsToFile(carts);
      res.json({ message: 'Producto agregado al carrito correctamente.' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
  }
});

// Funciones auxiliares para cargar y guardar carritos
async function loadCartsFromFile() {
  try {
    const fileContent = await fs.readFile('carritos.json', 'utf8');
    return JSON.parse(fileContent) || [];
  } catch (error) {
    return [];
  }
}

async function saveCartsToFile(carts) {
  const jsonCarts = JSON.stringify(carts, null, 2);
  await fs.writeFile('carritos.json', jsonCarts, 'utf8');
}

app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
