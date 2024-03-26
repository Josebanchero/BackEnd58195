const mongoose = require('mongoose');

// Define el esquema de tu modelo de datos
const productoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
});

// Define el modelo de mongoose para el producto
const Producto = mongoose.model('Producto', productoSchema);

// URL de conexión a MongoDB
const mongoURI = 'mongodb://localhost:3000/josefina-banchero';

// Conexión a MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Manejo de errores de conexión
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

// Exporta el modelo de Producto para que pueda ser utilizado en otros archivos
module.exports = Producto;
