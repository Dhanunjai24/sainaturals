const storeModel = require('../models/storeModel');

async function getCart(req, res) {
  try {
    const data = await storeModel.getCartByUserId(req.user.id);
    const subtotal = data.items.reduce((sum, i) => sum + (Number(i.discount_price || i.price) * i.quantity), 0);
    const totalItems = data.items.reduce((sum, i) => sum + i.quantity, 0);
    res.json({
      cartId: data.cartId,
      items: data.items,
      subtotal,
      totalItems,
      freeDeliveryThreshold: 500
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }
    const data = await storeModel.addToCart(req.user.id, productId, Number(quantity));
    const subtotal = data.items.reduce((sum, i) => sum + (Number(i.discount_price || i.price) * i.quantity), 0);
    const totalItems = data.items.reduce((sum, i) => sum + i.quantity, 0);

    res.json({
      message: 'Item added to cart!',
      cartId: data.cartId,
      items: data.items,
      subtotal,
      totalItems
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function updateCartItem(req, res) {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.id;
    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required.' });
    }
    const data = await storeModel.updateCartItem(req.user.id, cartItemId, Number(quantity));
    const subtotal = data.items.reduce((sum, i) => sum + (Number(i.discount_price || i.price) * i.quantity), 0);
    const totalItems = data.items.reduce((sum, i) => sum + i.quantity, 0);

    res.json({
      message: 'Cart updated.',
      cartId: data.cartId,
      items: data.items,
      subtotal,
      totalItems
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function clearCart(req, res) {
  try {
    await storeModel.clearCart(req.user.id);
    res.json({ message: 'Cart cleared.', items: [], subtotal: 0, totalItems: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  clearCart
};
