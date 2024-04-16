const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  },
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String, // Este campo debería ser un hash
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

