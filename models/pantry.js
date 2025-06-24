const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Pantry', pantrySchema);
