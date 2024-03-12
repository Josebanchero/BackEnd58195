const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Definir las rutas para servir las vistas
app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts');
});

// Otras rutas de tu aplicación...

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
