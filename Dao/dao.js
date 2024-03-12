
const mongoose = require('mongoose');

// URL de conexión a MongoDB
const mongoURI = 'mongodb://localhost:27017/nombre-de-tu-base-de-datos';

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

module.exports = db;
