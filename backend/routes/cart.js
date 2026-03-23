const express = require('express');
const router  = express.Router();
const Cart    = require('../models/Cart');

// GET cart by sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    res.json(cart || { sessionId: req.params.sessionId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add item to cart
router.post('/:sessionId/add', async (req, res) => {
  try {
    const { productId, name, price } = req.body;
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });

    if (!cart) {
      cart = new Cart({ sessionId: req.params.sessionId, items: [] });
    }

    const existing = cart.items.find(i => i.productId.toString() === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({ productId, name, price, qty: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE remove item from cart
router.delete('/:sessionId/remove/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE clear entire cart
router.delete('/:sessionId/clear', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;