const storeModel = require('../models/storeModel');
const { repo } = require('../db');

// Categories
async function getCategories(req, res) {
  try {
    const categories = await storeModel.getCategories();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required.' });
    const category = await storeModel.createCategory(req.body);
    res.status(201).json({ message: 'Category created!', category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateCategory(req, res) {
  try {
    const category = await storeModel.updateCategory(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category updated!', category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteCategory(req, res) {
  try {
    await storeModel.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Wishlist
async function getWishlist(req, res) {
  try {
    const wishlist = await storeModel.getWishlist(req.user.id);
    res.json({ wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function toggleWishlist(req, res) {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required.' });
    const result = await storeModel.toggleWishlist(req.user.id, productId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Addresses
async function getAddresses(req, res) {
  try {
    const addresses = await storeModel.getAddresses(req.user.id);
    res.json({ addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addAddress(req, res) {
  try {
    const { full_name, phone, street_address, area, pincode } = req.body;
    if (!full_name || !phone || !street_address || !area || !pincode) {
      return res.status(400).json({ message: 'Please provide full name, phone, street address, area, and pincode.' });
    }
    const address = await storeModel.addAddress(req.user.id, req.body);
    res.status(201).json({ message: 'Address saved successfully!', address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteAddress(req, res) {
  try {
    await storeModel.deleteAddress(req.user.id, req.params.id);
    res.json({ message: 'Address deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Coupons
async function getCoupons(req, res) {
  try {
    const activeOnly = req.query.all !== 'true';
    const coupons = await storeModel.getCoupons(activeOnly);
    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function validateCoupon(req, res) {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required.' });
    const result = await storeModel.validateCoupon(code, Number(subtotal || 0));
    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Reviews
async function addReview(req, res) {
  try {
    const { productId, rating, title, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ message: 'Product ID and rating (1-5) are required.' });
    }
    const review = await storeModel.addReview({
      productId,
      userId: req.user.id,
      rating: Math.min(5, Math.max(1, Number(rating))),
      title,
      comment
    });
    res.status(201).json({ message: 'Review submitted successfully! Thank you.', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Banners
async function getBanners(req, res) {
  try {
    const banners = await storeModel.getBanners();
    res.json({ banners });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getWishlist,
  toggleWishlist,
  getAddresses,
  addAddress,
  deleteAddress,
  getCoupons,
  validateCoupon,
  addReview,
  getBanners
};
