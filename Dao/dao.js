const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Cart = require('./models/cartModel');
const Message = require('./models/messageModel');
const Product = require('./models/productModel');

const Dao = {
  // Funciones para interactuar con MongoDB

  createCart: async (cartData) => {
    return await Cart.create(cartData);
  },

  getMessages: async () => {
    return await Message.find();
  },

  createMessage: async (messageData) => {
    return await Message.create(messageData);
  },

  
};

module.exports = Dao;
