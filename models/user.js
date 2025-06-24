const mongoose = require('mongoose');

// Define the embedded schema for pantry items
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// Extend the user schema to include a pantry
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  // This is the embedded array of food items (the pantry)
  pantry: [foodSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
