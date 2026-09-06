const storeModel = require('../models/storeModel');

async function checkout(req, res) {
  try {
    const { addressId, couponCode, paymentMethod, deliverySlot, notes } = req.body;
    if (!addressId) {
      return res.status(400).json({ message: 'Delivery address is required.' });
    }

    const order = await storeModel.createOrder({
      userId: req.user.id,
      addressId,
      couponCode,
      paymentMethod: paymentMethod || 'cod',
      deliverySlot,
      notes
    });

    res.status(201).json({
      message: 'Order placed successfully! 🌿',
      order
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(400).json({ message: err.message || 'Could not place order.' });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await storeModel.getOrdersByUserId(req.user.id);
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getOrderDetails(req, res) {
  try {
    const order = await storeModel.getOrderDetails(req.params.id, req.user.role === 'admin' ? null : req.user.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found or access denied.' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function cancelOrder(req, res) {
  try {
    const order = await storeModel.getOrderDetails(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    // Only order owner or admin can cancel
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to cancel this order.' });
    }

    const result = await storeModel.cancelOrderWithStockRestoration(req.params.id, req.body.reason);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  checkout,
  getMyOrders,
  getOrderDetails,
  cancelOrder
};
