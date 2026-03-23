const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  tag:   { type: String, required: true },
  stock: { type: Boolean, default: true },
  image: { type: String, default: '' },       // image URL or emoji
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);