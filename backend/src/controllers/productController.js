const storeModel = require('../models/storeModel');

async function getProducts(req, res) {
  try {
    const { category, search, inStock, minPrice, maxPrice, sort, featured } = req.query;
    const products = await storeModel.getProducts({
      category,
      search,
      inStockOnly: inStock === 'true' || inStock === '1',
      minPrice,
      maxPrice,
      sort,
      featured: featured === 'true' || featured === '1'
    });
    res.json({ count: products.length, products });
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ message: err.message });
  }
}

async function getProductBySlug(req, res) {
  try {
    const product = await storeModel.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const reviews = await storeModel.getReviewsByProduct(product.id);
    res.json({ product, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getProductById(req, res) {
  try {
    const product = await storeModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const reviews = await storeModel.getReviewsByProduct(product.id);
    res.json({ product, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const { name, category_id, price, stock_quantity } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required.' });
    }
    const product = await storeModel.createProduct(req.body);
    res.status(201).json({ message: 'Product created successfully!', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await storeModel.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ message: 'Product updated successfully!', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    await storeModel.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function adjustStock(req, res) {
  try {
    const { delta, reason } = req.body;
    if (delta === undefined || isNaN(delta)) {
      return res.status(400).json({ message: 'Stock delta number is required.' });
    }
    const newStock = await storeModel.adjustStock(req.params.id, Number(delta), reason);
    res.json({ message: 'Stock updated successfully.', newStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock
};
