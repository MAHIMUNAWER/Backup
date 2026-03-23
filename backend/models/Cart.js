const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  qty:       { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true }, // browser session ID
  items:     [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);