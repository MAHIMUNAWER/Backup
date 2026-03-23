const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');

// POST checkout — converts cart to order
router.post('/checkout/:sessionId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart || !cart.items.length) return res.status(400).json({ error: 'Cart is empty' });

    const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      sessionId: req.params.sessionId,
      items: cart.items,
      totalAmount,
    });

    // Clear cart after checkout
    await Cart.findOneAndDelete({ sessionId: req.params.sessionId });

    res.status(201).json({ message: 'Order placed!', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all orders for a session
router.get('/:sessionId', async (req, res) => {
  try {
    const orders = await Order.find({ sessionId: req.params.sessionId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;