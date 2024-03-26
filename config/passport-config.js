const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();

// Configurar sesión
app.use(session({
  secret: 'secreto', // Cambiar esto por una clave secreta más segura
  resave: false,
  saveUninitialized: false
}));

// Inicializar Passport y sesión
app.use(passport.initialize());
app.use(passport.session());

// Configurar estrategia de autenticación de GitHub
passport.use(new GitHubStrategy({
    clientID: 't2c82cf5216686c128b48',
    clientSecret: 'f6df8b032af2879a0a198aacaca802aba54bcc26',
    callbackURL: 'http://localhost:3000/auth/github/callback',
    
    function (accessToken, refreshToken, profile, done) {
    // Aquí puedes hacer lo que necesites con el perfil de usuario
    return done(null, profile);}
  }),

);

// Serializar y deserializar usuario
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Ruta de inicio de sesión
app.get('/login', function(req, res) {
  res.send('Página de inicio de sesión');
});

// Ruta de autenticación de GitHub
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de retorno después de la autorización en GitHub
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Redirige a la página de inicio u otra página de tu aplicación
    res.redirect('/');
  });

// Ruta principal
app.get('/', function(req, res) {
  res.send('Página principal');
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Servidor iniciado en http://localhost3000:' + port);
});
