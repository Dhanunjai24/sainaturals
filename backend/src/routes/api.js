const express = require('express');
const router = express.Router();

const { verifyToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const authCtrl = require('../controllers/authController');
const productCtrl = require('../controllers/productController');
const cartCtrl = require('../controllers/cartController');
const orderCtrl = require('../controllers/orderController');
const adminCtrl = require('../controllers/adminController');
const extraCtrl = require('../controllers/extraController');

// --- AUTH ---
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', verifyToken, authCtrl.getMe);

// --- PRODUCTS ---
router.get('/products', productCtrl.getProducts);
router.get('/products/slug/:slug', productCtrl.getProductBySlug);
router.get('/products/:id', productCtrl.getProductById);
router.post('/products', verifyToken, requireAdmin, productCtrl.createProduct);
router.put('/products/:id', verifyToken, requireAdmin, productCtrl.updateProduct);
router.delete('/products/:id', verifyToken, requireAdmin, productCtrl.deleteProduct);
router.post('/products/:id/stock', verifyToken, requireAdmin, productCtrl.adjustStock);

// --- CATEGORIES ---
router.get('/categories', extraCtrl.getCategories);
router.post('/categories', verifyToken, requireAdmin, extraCtrl.createCategory);
router.put('/categories/:id', verifyToken, requireAdmin, extraCtrl.updateCategory);
router.delete('/categories/:id', verifyToken, requireAdmin, extraCtrl.deleteCategory);

// --- CART ---
router.get('/cart', verifyToken, cartCtrl.getCart);
router.post('/cart', verifyToken, cartCtrl.addToCart);
router.put('/cart/:id', verifyToken, cartCtrl.updateCartItem);
router.delete('/cart', verifyToken, cartCtrl.clearCart);

// --- WISHLIST ---
router.get('/wishlist', verifyToken, extraCtrl.getWishlist);
router.post('/wishlist/toggle', verifyToken, extraCtrl.toggleWishlist);

// --- ADDRESSES ---
router.get('/addresses', verifyToken, extraCtrl.getAddresses);
router.post('/addresses', verifyToken, extraCtrl.addAddress);
router.delete('/addresses/:id', verifyToken, extraCtrl.deleteAddress);

// --- COUPONS ---
router.get('/coupons', extraCtrl.getCoupons);
router.post('/coupons/validate', extraCtrl.validateCoupon);

// --- ORDERS ---
router.post('/orders/checkout', verifyToken, orderCtrl.checkout);
router.get('/orders/my-orders', verifyToken, orderCtrl.getMyOrders);
router.get('/orders/:id', verifyToken, orderCtrl.getOrderDetails);
router.post('/orders/:id/cancel', verifyToken, orderCtrl.cancelOrder);

// --- REVIEWS ---
router.post('/reviews', verifyToken, extraCtrl.addReview);

// --- BANNERS ---
router.get('/banners', extraCtrl.getBanners);

// --- ADMIN PORTAL ---
router.get('/admin/dashboard', verifyToken, requireAdmin, adminCtrl.getDashboard);
router.get('/admin/orders', verifyToken, requireAdmin, adminCtrl.getOrders);
router.put('/admin/orders/:id/status', verifyToken, requireAdmin, adminCtrl.updateOrderStatus);
router.get('/admin/customers', verifyToken, requireAdmin, adminCtrl.getCustomers);
router.get('/admin/inventory', verifyToken, requireAdmin, adminCtrl.getInventory);
router.get('/admin/reports/sales', verifyToken, requireAdmin, adminCtrl.getSalesReport);

module.exports = router;
