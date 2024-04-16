
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'TU_SECRET_KEY'
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        // Aquí deberías comparar el password con el hash almacenado en la base de datos
        if (password !== user.password) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use(new GitHubStrategy({
    clientID: 'TU_CLIENT_ID',
    clientSecret: 'TU_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Aquí deberías verificar si el usuario ya existe en la base de datos o crearlo si no existe
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            return done(null, user);
        } else {
            // Crea un nuevo usuario con los datos de GitHub
            const newUser = new User({
                first_name: profile.displayName,
                email: profile.emails[0].value,
                // Otros campos
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error);
    }
}));

// Serializa y deserializa el usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
