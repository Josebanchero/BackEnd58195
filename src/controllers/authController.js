
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', { errorMessage: 'Error al registrar el usuario' });
    }
};

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.postLogin = passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
});

exports.getLogout = (req, res) => {
    req.logout();
    res.redirect('/login');
};
