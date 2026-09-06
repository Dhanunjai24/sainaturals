const { query, getClient, repo } = require('../db');

// Helper to generate unique order number: SSNF-YYYYMMDD-XXXX
function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `SSNF-${dateStr}-${randomPart}`;
}

// ----------------- USERS -----------------
async function findUserByEmail(email) {
  if (repo.isPostgres()) {
    const res = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    return res.rows[0] || null;
  }
  const store = repo.getStore();
  return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

async function findUserById(id) {
  if (repo.isPostgres()) {
    const res = await query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }
  const store = repo.getStore();
  const u = store.users.find(user => user.id === Number(id));
  if (!u) return null;
  const { password_hash, ...rest } = u;
  return rest;
}

async function createUser({ name, email, phone, password_hash, role = 'customer' }) {
  if (repo.isPostgres()) {
    const res = await query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role, created_at`,
      [name, email, phone, password_hash, role]
    );
    return res.rows[0];
  }
  const store = repo.getStore();
  const id = store._autoIncrement.users++;
  const newUser = {
    id,
    name,
    email,
    phone,
    password_hash,
    role,
    created_at: new Date().toISOString()
  };
  store.users.push(newUser);
  repo.saveStore();
  const { password_hash: _, ...rest } = newUser;
  return rest;
}

async function getAllCustomers() {
  if (repo.isPostgres()) {
    const res = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
              COUNT(o.id) as total_orders,
              COALESCE(SUM(o.total_amount), 0) as total_spend
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id
       WHERE u.role = 'customer'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    return res.rows;
  }
  const store = repo.getStore();
  return store.users
    .filter(u => u.role === 'customer')
    .map(u => {
      const userOrders = store.orders.filter(o => o.user_id === u.id);
      const total_spend = userOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
      const { password_hash, ...rest } = u;
      return {
        ...rest,
        total_orders: userOrders.length,
        total_spend
      };
    });
}

// ----------------- CATEGORIES -----------------
async function getCategories() {
  if (repo.isPostgres()) {
    const res = await query('SELECT * FROM categories ORDER BY display_order ASC, id ASC');
    return res.rows;
  }
  const store = repo.getStore();
  return [...store.categories].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

async function createCategory(cat) {
  const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (repo.isPostgres()) {
    const res = await query(
      `INSERT INTO categories (name, local_name, slug, description, icon, image_url, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [cat.name, cat.local_name, slug, cat.description, cat.icon || 'Package', cat.image_url, cat.display_order || 0]
    );
    return res.rows[0];
  }
  const store = repo.getStore();
  const newCat = {
    id: store._autoIncrement.categories++,
    name: cat.name,
    local_name: cat.local_name,
    slug,
    description: cat.description,
    icon: cat.icon || 'Package',
    image_url: cat.image_url,
    display_order: cat.display_order || 0
  };
  store.categories.push(newCat);
  repo.saveStore();
  return newCat;
}

async function updateCategory(id, cat) {
  if (repo.isPostgres()) {
    const res = await query(
      `UPDATE categories
       SET name = COALESCE($1, name),
           local_name = COALESCE($2, local_name),
           description = COALESCE($3, description),
           icon = COALESCE($4, icon),
           image_url = COALESCE($5, image_url),
           display_order = COALESCE($6, display_order)
       WHERE id = $7 RETURNING *`,
      [cat.name, cat.local_name, cat.description, cat.icon, cat.image_url, cat.display_order, id]
    );
    return res.rows[0] || null;
  }
  const store = repo.getStore();
  const idx = store.categories.findIndex(c => c.id === Number(id));
  if (idx === -1) return null;
  store.categories[idx] = { ...store.categories[idx], ...cat };
  repo.saveStore();
  return store.categories[idx];
}

async function deleteCategory(id) {
  if (repo.isPostgres()) {
    await query('DELETE FROM categories WHERE id = $1', [id]);
    return true;
  }
  const store = repo.getStore();
  store.categories = store.categories.filter(c => c.id !== Number(id));
  repo.saveStore();
  return true;
}

// ----------------- PRODUCTS -----------------
async function getProducts({ category, search, inStockOnly, minPrice, maxPrice, sort, featured }) {
  let products = [];
  if (repo.isPostgres()) {
    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
    `;
    const params = [];

    if (category) {
      params.push(category);
      sql += ` AND (c.slug = $${params.length} OR CAST(p.category_id AS TEXT) = $${params.length})`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (p.name ILIKE $${params.length} OR p.local_name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }
    if (inStockOnly) {
      sql += ` AND p.stock_quantity > 0`;
    }
    if (featured) {
      sql += ` AND p.is_featured = TRUE`;
    }
    if (minPrice) {
      params.push(Number(minPrice));
      sql += ` AND p.discount_price >= $${params.length}`;
    }
    if (maxPrice) {
      params.push(Number(maxPrice));
      sql += ` AND p.discount_price <= $${params.length}`;
    }

    if (sort === 'price_asc') sql += ' ORDER BY p.discount_price ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY p.discount_price DESC';
    else if (sort === 'rating') sql += ' ORDER BY p.rating DESC';
    else sql += ' ORDER BY p.is_featured DESC, p.id ASC';

    const res = await query(sql, params);
    return res.rows;
  }

  const store = repo.getStore();
  products = store.products.map(p => {
    const cat = store.categories.find(c => c.id === p.category_id);
    return {
      ...p,
      category_name: cat ? cat.name : 'Groceries',
      category_slug: cat ? cat.slug : 'groceries'
    };
  });

  if (category) {
    products = products.filter(p => p.category_slug === category || String(p.category_id) === String(category));
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.local_name && p.local_name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }
  if (inStockOnly) {
    products = products.filter(p => p.stock_quantity > 0);
  }
  if (featured) {
    products = products.filter(p => p.is_featured);
  }
  if (minPrice) {
    products = products.filter(p => Number(p.discount_price || p.price) >= Number(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => Number(p.discount_price || p.price) <= Number(maxPrice));
  }

  if (sort === 'price_asc') {
    products.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
  } else if (sort === 'price_desc') {
    products.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else {
    products.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  return products;
}

async function getProductById(id) {
  if (repo.isPostgres()) {
    const res = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    return res.rows[0] || null;
  }
  const store = repo.getStore();
  const prod = store.products.find(p => p.id === Number(id));
  if (!prod) return null;
  const cat = store.categories.find(c => c.id === prod.category_id);
  return {
    ...prod,
    category_name: cat ? cat.name : 'Groceries',
    category_slug: cat ? cat.slug : 'groceries'
  };
}

async function getProductBySlug(slug) {
  if (repo.isPostgres()) {
    const res = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    );
    return res.rows[0] || null;
  }
  const store = repo.getStore();
  const prod = store.products.find(p => p.slug === slug);
  if (!prod) return null;
  const cat = store.categories.find(c => c.id === prod.category_id);
  return {
    ...prod,
    category_name: cat ? cat.name : 'Groceries',
    category_slug: cat ? cat.slug : 'groceries'
  };
}

async function createProduct(prod) {
  const slug = prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  if (repo.isPostgres()) {
    const res = await query(
      `INSERT INTO products (category_id, name, local_name, slug, description, price, discount_price, stock_quantity, unit, image_url, is_featured, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [prod.category_id, prod.name, prod.local_name, slug, prod.description, prod.price, prod.discount_price, prod.stock_quantity, prod.unit || '1 Unit', prod.image_url, prod.is_featured || false, prod.is_active !== false]
    );
    return res.rows[0];
  }
  const store = repo.getStore();
  const newProduct = {
    id: store._autoIncrement.products++,
    category_id: Number(prod.category_id),
    name: prod.name,
    local_name: prod.local_name,
    slug,
    description: prod.description,
    price: Number(prod.price),
    discount_price: Number(prod.discount_price || prod.price),
    stock_quantity: Number(prod.stock_quantity || 0),
    unit: prod.unit || '1 Unit',
    image_url: prod.image_url || '/images/store.jpg',
    is_featured: !!prod.is_featured,
    is_active: prod.is_active !== false,
    rating: 5.0,
    review_count: 0,
    created_at: new Date().toISOString()
  };
  store.products.push(newProduct);
  repo.saveStore();
  return newProduct;
}

async function updateProduct(id, prod) {
  if (repo.isPostgres()) {
    const res = await query(
      `UPDATE products
       SET category_id = COALESCE($1, category_id),
           name = COALESCE($2, name),
           local_name = COALESCE($3, local_name),
           description = COALESCE($4, description),
           price = COALESCE($5, price),
           discount_price = COALESCE($6, discount_price),
           stock_quantity = COALESCE($7, stock_quantity),
           unit = COALESCE($8, unit),
           image_url = COALESCE($9, image_url),
           is_featured = COALESCE($10, is_featured),
           is_active = COALESCE($11, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 RETURNING *`,
      [prod.category_id, prod.name, prod.local_name, prod.description, prod.price, prod.discount_price, prod.stock_quantity, prod.unit, prod.image_url, prod.is_featured, prod.is_active, id]
    );
    return res.rows[0] || null;
  }
  const store = repo.getStore();
  const idx = store.products.findIndex(p => p.id === Number(id));
  if (idx === -1) return null;
  store.products[idx] = {
    ...store.products[idx],
    ...prod,
    updated_at: new Date().toISOString()
  };
  repo.saveStore();
  return store.products[idx];
}

async function deleteProduct(id) {
  if (repo.isPostgres()) {
    await query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  }
  const store = repo.getStore();
  store.products = store.products.filter(p => p.id !== Number(id));
  repo.saveStore();
  return true;
}

async function adjustStock(id, qtyDelta, reason = 'manual_adjustment') {
  if (repo.isPostgres()) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const pRes = await client.query('SELECT stock_quantity FROM products WHERE id = $1 FOR UPDATE', [id]);
      if (!pRes.rows.length) throw new Error('Product not found');
      const currentStock = pRes.rows[0].stock_quantity;
      const newStock = Math.max(0, currentStock + qtyDelta);
      await client.query('UPDATE products SET stock_quantity = $1 WHERE id = $2', [newStock, id]);
      await client.query(
        'INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_stock, new_stock, reason) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, qtyDelta < 0 ? 'decrement' : 'increment', qtyDelta, currentStock, newStock, reason]
      );
      await client.query('COMMIT');
      return newStock;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  const store = repo.getStore();
  const p = store.products.find(item => item.id === Number(id));
  if (!p) throw new Error('Product not found');
  const prev = p.stock_quantity;
  p.stock_quantity = Math.max(0, p.stock_quantity + qtyDelta);
  store.inventory_logs.push({
    id: store._autoIncrement.inventory_logs++,
    product_id: p.id,
    change_type: qtyDelta < 0 ? 'decrement' : 'increment',
    quantity_change: qtyDelta,
    previous_stock: prev,
    new_stock: p.stock_quantity,
    reason,
    created_at: new Date().toISOString()
  });
  repo.saveStore();
  return p.stock_quantity;
}

// ----------------- CARTS -----------------
async function getCartByUserId(userId) {
  if (repo.isPostgres()) {
    let cartRes = await query('SELECT * FROM carts WHERE user_id = $1', [userId]);
    let cart = cartRes.rows[0];
    if (!cart) {
      const newCartRes = await query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId]);
      cart = newCartRes.rows[0];
    }
    const itemsRes = await query(
      `SELECT ci.*, p.name, p.local_name, p.price, p.discount_price, p.stock_quantity, p.unit, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1
       ORDER BY ci.id ASC`,
      [cart.id]
    );
    return {
      cartId: cart.id,
      items: itemsRes.rows
    };
  }

  const store = repo.getStore();
  let cart = store.carts.find(c => c.user_id === Number(userId));
  if (!cart) {
    cart = { id: store._autoIncrement.carts++, user_id: Number(userId), created_at: new Date().toISOString() };
    store.carts.push(cart);
  }
  const items = store.cart_items
    .filter(ci => ci.cart_id === cart.id)
    .map(ci => {
      const p = store.products.find(prod => prod.id === ci.product_id) || {};
      return {
        ...ci,
        name: p.name,
        local_name: p.local_name,
        price: p.price,
        discount_price: p.discount_price,
        stock_quantity: p.stock_quantity,
        unit: p.unit,
        image_url: p.image_url
      };
    });
  return {
    cartId: cart.id,
    items
  };
}

async function addToCart(userId, productId, quantity = 1) {
  const product = await getProductById(productId);
  if (!product) throw new Error('Product does not exist');
  if (product.stock_quantity <= 0) throw new Error('Product is currently out of stock');

  if (repo.isPostgres()) {
    const { cartId } = await getCartByUserId(userId);
    // Upsert with duplicate check
    await query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id, variant_id)
       DO UPDATE SET quantity = LEAST(cart_items.quantity + $3, $4), updated_at = CURRENT_TIMESTAMP`,
      [cartId, productId, quantity, product.stock_quantity]
    );
    return getCartByUserId(userId);
  }

  const store = repo.getStore();
  let cart = store.carts.find(c => c.user_id === Number(userId));
  if (!cart) {
    cart = { id: store._autoIncrement.carts++, user_id: Number(userId), created_at: new Date().toISOString() };
    store.carts.push(cart);
  }
  let item = store.cart_items.find(ci => ci.cart_id === cart.id && ci.product_id === Number(productId));
  if (item) {
    item.quantity = Math.min(product.stock_quantity, item.quantity + quantity);
  } else {
    store.cart_items.push({
      id: store._autoIncrement.cart_items++,
      cart_id: cart.id,
      product_id: Number(productId),
      quantity: Math.min(product.stock_quantity, quantity),
      created_at: new Date().toISOString()
    });
  }
  repo.saveStore();
  return getCartByUserId(userId);
}

async function updateCartItem(userId, cartItemId, quantity) {
  if (repo.isPostgres()) {
    if (quantity <= 0) {
      await query('DELETE FROM cart_items WHERE id = $1', [cartItemId]);
    } else {
      await query('UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [quantity, cartItemId]);
    }
    return getCartByUserId(userId);
  }
  const store = repo.getStore();
  if (quantity <= 0) {
    store.cart_items = store.cart_items.filter(ci => ci.id !== Number(cartItemId));
  } else {
    const item = store.cart_items.find(ci => ci.id === Number(cartItemId));
    if (item) item.quantity = quantity;
  }
  repo.saveStore();
  return getCartByUserId(userId);
}

async function clearCart(userId) {
  if (repo.isPostgres()) {
    const cartRes = await query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    if (cartRes.rows.length) {
      await query('DELETE FROM cart_items WHERE cart_id = $1', [cartRes.rows[0].id]);
    }
    return true;
  }
  const store = repo.getStore();
  const cart = store.carts.find(c => c.user_id === Number(userId));
  if (cart) {
    store.cart_items = store.cart_items.filter(ci => ci.cart_id !== cart.id);
    repo.saveStore();
  }
  return true;
}

// ----------------- WISHLIST -----------------
async function getWishlist(userId) {
  if (repo.isPostgres()) {
    const res = await query(
      `SELECT w.id, w.product_id, p.name, p.local_name, p.price, p.discount_price, p.stock_quantity, p.unit, p.image_url, p.rating
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1 ORDER BY w.created_at DESC`,
      [userId]
    );
    return res.rows;
  }
  const store = repo.getStore();
  return store.wishlists
    .filter(w => w.user_id === Number(userId))
    .map(w => {
      const p = store.products.find(prod => prod.id === w.product_id) || {};
      return {
        id: w.id,
        product_id: w.product_id,
        name: p.name,
        local_name: p.local_name,
        price: p.price,
        discount_price: p.discount_price,
        stock_quantity: p.stock_quantity,
        unit: p.unit,
        image_url: p.image_url,
        rating: p.rating
      };
    });
}

async function toggleWishlist(userId, productId) {
  if (repo.isPostgres()) {
    const existing = await query('SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    if (existing.rows.length) {
      await query('DELETE FROM wishlists WHERE id = $1', [existing.rows[0].id]);
      return { inWishlist: false };
    }
    await query('INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2)', [userId, productId]);
    return { inWishlist: true };
  }
  const store = repo.getStore();
  const idx = store.wishlists.findIndex(w => w.user_id === Number(userId) && w.product_id === Number(productId));
  if (idx !== -1) {
    store.wishlists.splice(idx, 1);
    repo.saveStore();
    return { inWishlist: false };
  }
  store.wishlists.push({
    id: store._autoIncrement.wishlists++,
    user_id: Number(userId),
    product_id: Number(productId),
    created_at: new Date().toISOString()
  });
  repo.saveStore();
  return { inWishlist: true };
}

// ----------------- ADDRESSES -----------------
async function getAddresses(userId) {
  if (repo.isPostgres()) {
    const res = await query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id DESC', [userId]);
    return res.rows;
  }
  const store = repo.getStore();
  return store.addresses
    .filter(a => a.user_id === Number(userId))
    .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
}

async function addAddress(userId, addr) {
  if (addr.is_default) {
    if (repo.isPostgres()) {
      await query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
    } else {
      const store = repo.getStore();
      store.addresses.filter(a => a.user_id === Number(userId)).forEach(a => a.is_default = false);
    }
  }

  if (repo.isPostgres()) {
    const res = await query(
      `INSERT INTO addresses (user_id, full_name, phone, street_address, landmark, area, city, state, pincode, address_type, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [userId, addr.full_name, addr.phone, addr.street_address, addr.landmark, addr.area, addr.city || 'Hyderabad', addr.state || 'Telangana', addr.pincode, addr.address_type || 'Home', !!addr.is_default]
    );
    return res.rows[0];
  }

  const store = repo.getStore();
  const newAddr = {
    id: store._autoIncrement.addresses++,
    user_id: Number(userId),
    full_name: addr.full_name,
    phone: addr.phone,
    street_address: addr.street_address,
    landmark: addr.landmark || '',
    area: addr.area,
    city: addr.city || 'Hyderabad',
    state: addr.state || 'Telangana',
    pincode: addr.pincode,
    address_type: addr.address_type || 'Home',
    is_default: !!addr.is_default,
    created_at: new Date().toISOString()
  };
  store.addresses.push(newAddr);
  repo.saveStore();
  return newAddr;
}

async function deleteAddress(userId, addressId) {
  if (repo.isPostgres()) {
    await query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [addressId, userId]);
    return true;
  }
  const store = repo.getStore();
  store.addresses = store.addresses.filter(a => !(a.id === Number(addressId) && a.user_id === Number(userId)));
  repo.saveStore();
  return true;
}

// ----------------- COUPONS -----------------
async function getCoupons(activeOnly = true) {
  if (repo.isPostgres()) {
    let sql = 'SELECT * FROM coupons';
    if (activeOnly) sql += ' WHERE is_active = TRUE AND valid_until > CURRENT_TIMESTAMP';
    sql += ' ORDER BY id ASC';
    const res = await query(sql);
    return res.rows;
  }
  const store = repo.getStore();
  let list = store.coupons;
  if (activeOnly) {
    const now = new Date().toISOString();
    list = list.filter(c => c.is_active && c.valid_until > now);
  }
  return list;
}

async function validateCoupon(code, subtotal) {
  let coupon = null;
  if (repo.isPostgres()) {
    const res = await query(
      'SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) AND is_active = TRUE AND valid_until > CURRENT_TIMESTAMP',
      [code]
    );
    coupon = res.rows[0];
  } else {
    const store = repo.getStore();
    const now = new Date().toISOString();
    coupon = store.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active && c.valid_until > now);
  }

  if (!coupon) {
    return { valid: false, message: 'Invalid or expired coupon code.' };
  }

  if (coupon.min_order_amount && subtotal < Number(coupon.min_order_amount)) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${coupon.min_order_amount} required to use this coupon.`
    };
  }

  let discount = 0;
  if (coupon.discount_type === 'percent') {
    discount = (subtotal * Number(coupon.discount_value)) / 100;
    if (coupon.max_discount && discount > Number(coupon.max_discount)) {
      discount = Number(coupon.max_discount);
    }
  } else {
    discount = Number(coupon.discount_value);
  }

  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discount_amount: Math.round(discount)
    }
  };
}

// ----------------- ORDERS & TRANSACTIONS -----------------
async function createOrder({ userId, addressId, couponCode, paymentMethod, deliverySlot, notes }) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // 1. Fetch user's cart items
    let cartItems = [];
    if (repo.isPostgres()) {
      const cartRes = await client.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (!cartRes.rows.length) throw new Error('Cart not found');
      const itemsRes = await client.query(
        `SELECT ci.*, p.name, p.price, p.discount_price, p.stock_quantity
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = $1`,
        [cartRes.rows[0].id]
      );
      cartItems = itemsRes.rows;
    } else {
      const store = repo.getStore();
      const cart = store.carts.find(c => c.user_id === Number(userId));
      if (!cart) throw new Error('Cart not found');
      cartItems = store.cart_items
        .filter(ci => ci.cart_id === cart.id)
        .map(ci => {
          const p = store.products.find(prod => prod.id === ci.product_id);
          return {
            ...ci,
            name: p.name,
            price: p.price,
            discount_price: p.discount_price,
            stock_quantity: p.stock_quantity
          };
        });
    }

    if (!cartItems.length) {
      throw new Error('Your cart is empty. Please add products before checking out.');
    }

    // 2. Stock Verification & Decrement
    let subtotal = 0;
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for "${item.name}". Only ${item.stock_quantity} available.`);
      }
      const unitPrice = Number(item.discount_price || item.price);
      subtotal += unitPrice * item.quantity;
    }

    // 3. Coupon Calculation
    let discountAmount = 0;
    let couponId = null;
    if (couponCode) {
      const couponCheck = await validateCoupon(couponCode, subtotal);
      if (couponCheck.valid) {
        discountAmount = couponCheck.coupon.discount_amount;
        couponId = couponCheck.coupon.id;
      }
    }

    // 4. Delivery Fee (Free above ₹500, else ₹40)
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);
    const orderNumber = generateOrderNumber();

    // 5. Insert Order
    let newOrder = null;
    if (repo.isPostgres()) {
      const orderRes = await client.query(
        `INSERT INTO orders (order_number, user_id, address_id, coupon_id, subtotal, discount_amount, delivery_fee, total_amount, payment_method, payment_status, order_status, delivery_slot, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [orderNumber, userId, addressId, couponId, subtotal, discountAmount, deliveryFee, totalAmount, paymentMethod || 'cod', paymentMethod === 'upi' ? 'pending' : 'pending', 'confirmed', deliverySlot || 'Morning (8:00 AM - 11:00 AM)', notes || '']
      );
      newOrder = orderRes.rows[0];

      // Insert Order Items & Decrement Stock
      for (const item of cartItems) {
        const unitPrice = Number(item.discount_price || item.price);
        const totalPrice = unitPrice * item.quantity;
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [newOrder.id, item.product_id, item.name, unitPrice, item.quantity, totalPrice]
        );
        await client.query(
          `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
          [item.quantity, item.product_id]
        );
        await client.query(
          `INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_stock, new_stock, reason)
           VALUES ($1, 'order_placed', $2, $3, $3 - $2, $4)`,
          [item.product_id, -item.quantity, item.stock_quantity, `Order placed: ${orderNumber}`]
        );
      }

      // Record Payment
      await client.query(
        `INSERT INTO payments (order_id, user_id, payment_method, amount, status)
         VALUES ($1, $2, $3, $4, 'pending')`,
        [newOrder.id, userId, paymentMethod || 'cod', totalAmount]
      );

      // Record Delivery
      await client.query(
        `INSERT INTO deliveries (order_id, driver_name, driver_phone, status, estimated_delivery)
         VALUES ($1, 'Sri Sai Fast Delivery', '+91 77995 49977', 'assigned', CURRENT_TIMESTAMP + INTERVAL '2 hours')`,
        [newOrder.id]
      );

      // Clear Cart
      const cartRes = await client.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartRes.rows.length) {
        await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartRes.rows[0].id]);
      }
    } else {
      const store = repo.getStore();
      const orderId = store._autoIncrement.orders++;
      newOrder = {
        id: orderId,
        order_number: orderNumber,
        user_id: Number(userId),
        address_id: Number(addressId),
        coupon_id: couponId,
        subtotal,
        discount_amount: discountAmount,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        payment_method: paymentMethod || 'cod',
        payment_status: 'pending',
        order_status: 'confirmed',
        delivery_slot: deliverySlot || 'Morning (8:00 AM - 11:00 AM)',
        notes: notes || '',
        created_at: new Date().toISOString()
      };
      store.orders.push(newOrder);

      for (const item of cartItems) {
        const unitPrice = Number(item.discount_price || item.price);
        const totalPrice = unitPrice * item.quantity;
        store.order_items.push({
          id: store._autoIncrement.order_items++,
          order_id: orderId,
          product_id: item.product_id,
          product_name: item.name,
          unit_price: unitPrice,
          quantity: item.quantity,
          total_price: totalPrice,
          created_at: new Date().toISOString()
        });

        const prod = store.products.find(p => p.id === item.product_id);
        if (prod) {
          const prev = prod.stock_quantity;
          prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
          store.inventory_logs.push({
            id: store._autoIncrement.inventory_logs++,
            product_id: prod.id,
            change_type: 'order_placed',
            quantity_change: -item.quantity,
            previous_stock: prev,
            new_stock: prod.stock_quantity,
            reason: `Order placed: ${orderNumber}`,
            created_at: new Date().toISOString()
          });
        }
      }

      store.payments.push({
        id: store._autoIncrement.payments++,
        order_id: orderId,
        user_id: Number(userId),
        payment_method: paymentMethod || 'cod',
        amount: totalAmount,
        status: 'pending',
        created_at: new Date().toISOString()
      });

      store.deliveries.push({
        id: store._autoIncrement.deliveries++,
        order_id: orderId,
        driver_name: 'Sri Sai Fast Delivery',
        driver_phone: '+91 77995 49977',
        status: 'assigned',
        created_at: new Date().toISOString()
      });

      // Clear Cart
      const cart = store.carts.find(c => c.user_id === Number(userId));
      if (cart) {
        store.cart_items = store.cart_items.filter(ci => ci.cart_id !== cart.id);
      }
    }

    await client.query('COMMIT');
    return newOrder;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function cancelOrderWithStockRestoration(orderId, reason = 'Customer requested cancellation') {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    let order = null;
    let items = [];

    if (repo.isPostgres()) {
      const oRes = await client.query('SELECT * FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
      if (!oRes.rows.length) throw new Error('Order not found');
      order = oRes.rows[0];

      if (['delivered', 'cancelled'].includes(order.order_status)) {
        throw new Error(`Cannot cancel order in "${order.order_status}" status.`);
      }

      const itemsRes = await client.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
      items = itemsRes.rows;

      // Restore stock for all products
      for (const item of items) {
        if (item.product_id) {
          await client.query('UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2', [item.quantity, item.product_id]);
          await client.query(
            `INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_stock, new_stock, reason)
             SELECT id, 'order_cancelled', $1, stock_quantity - $1, stock_quantity, $2
             FROM products WHERE id = $3`,
            [item.quantity, `Restored from cancelled order: ${order.order_number}`, item.product_id]
          );
        }
      }

      await client.query("UPDATE orders SET order_status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [orderId]);
    } else {
      const store = repo.getStore();
      order = store.orders.find(o => o.id === Number(orderId));
      if (!order) throw new Error('Order not found');
      if (['delivered', 'cancelled'].includes(order.order_status)) {
        throw new Error(`Cannot cancel order in "${order.order_status}" status.`);
      }
      items = store.order_items.filter(oi => oi.order_id === Number(orderId));

      for (const item of items) {
        const p = store.products.find(prod => prod.id === item.product_id);
        if (p) {
          const prev = p.stock_quantity;
          p.stock_quantity += item.quantity;
          store.inventory_logs.push({
            id: store._autoIncrement.inventory_logs++,
            product_id: p.id,
            change_type: 'order_cancelled',
            quantity_change: item.quantity,
            previous_stock: prev,
            new_stock: p.stock_quantity,
            reason: `Restored from cancelled order: ${order.order_number}`,
            created_at: new Date().toISOString()
          });
        }
      }
      order.order_status = 'cancelled';
      order.updated_at = new Date().toISOString();
    }

    await client.query('COMMIT');
    return { success: true, message: 'Order cancelled successfully and stock restored.' };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getOrdersByUserId(userId) {
  if (repo.isPostgres()) {
    const ordersRes = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const orders = ordersRes.rows;
    for (const o of orders) {
      const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [o.id]);
      o.items = itemsRes.rows;
    }
    return orders;
  }
  const store = repo.getStore();
  return store.orders
    .filter(o => o.user_id === Number(userId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(o => {
      const items = store.order_items.filter(oi => oi.order_id === o.id);
      return { ...o, items };
    });
}

async function getAllOrders({ status, search }) {
  let orders = [];
  if (repo.isPostgres()) {
    let sql = `
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
             a.street_address, a.area, a.city, a.pincode
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses a ON o.address_id = a.id
    `;
    const params = [];
    if (status && status !== 'all') {
      params.push(status);
      sql += ` WHERE o.order_status = $${params.length}`;
    }
    sql += ' ORDER BY o.created_at DESC';
    const res = await query(sql, params);
    orders = res.rows;
    for (const o of orders) {
      const items = await query('SELECT * FROM order_items WHERE order_id = $1', [o.id]);
      o.items = items.rows;
    }
    return orders;
  }

  const store = repo.getStore();
  orders = store.orders.map(o => {
    const u = store.users.find(user => user.id === o.user_id) || {};
    const a = store.addresses.find(addr => addr.id === o.address_id) || {};
    const items = store.order_items.filter(oi => oi.order_id === o.id);
    return {
      ...o,
      customer_name: u.name || 'Customer',
      customer_email: u.email || '',
      customer_phone: u.phone || '',
      street_address: a.street_address || '',
      area: a.area || '',
      city: a.city || 'Hyderabad',
      pincode: a.pincode || '',
      items
    };
  });

  if (status && status !== 'all') {
    orders = orders.filter(o => o.order_status === status);
  }
  return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function getOrderDetails(orderId, userId = null) {
  let order = null;
  if (repo.isPostgres()) {
    let sql = `
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
             a.full_name as shipping_name, a.phone as shipping_phone, a.street_address, a.landmark, a.area, a.city, a.pincode
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.id = $1
    `;
    const params = [orderId];
    if (userId) {
      params.push(userId);
      sql += ` AND o.user_id = $2`;
    }
    const res = await query(sql, params);
    order = res.rows[0];
    if (order) {
      const items = await query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      const delivery = await query('SELECT * FROM deliveries WHERE order_id = $1', [order.id]);
      order.items = items.rows;
      order.delivery = delivery.rows[0] || null;
    }
    return order;
  }

  const store = repo.getStore();
  order = store.orders.find(o => o.id === Number(orderId));
  if (!order) return null;
  if (userId && order.user_id !== Number(userId)) return null;

  const u = store.users.find(user => user.id === order.user_id) || {};
  const a = store.addresses.find(addr => addr.id === order.address_id) || {};
  const items = store.order_items.filter(oi => oi.order_id === order.id);
  const delivery = store.deliveries.find(d => d.order_id === order.id) || null;

  return {
    ...order,
    customer_name: u.name,
    customer_email: u.email,
    customer_phone: u.phone,
    shipping_name: a.full_name,
    shipping_phone: a.phone,
    street_address: a.street_address,
    landmark: a.landmark,
    area: a.area,
    city: a.city,
    pincode: a.pincode,
    items,
    delivery
  };
}

async function updateOrderStatus(orderId, status) {
  if (repo.isPostgres()) {
    const res = await query(
      'UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    return res.rows[0];
  }
  const store = repo.getStore();
  const order = store.orders.find(o => o.id === Number(orderId));
  if (order) {
    order.order_status = status;
    order.updated_at = new Date().toISOString();
    repo.saveStore();
  }
  return order;
}

// ----------------- REVIEWS -----------------
async function getReviewsByProduct(productId) {
  if (repo.isPostgres()) {
    const res = await query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1 AND r.status = 'approved'
       ORDER BY r.created_at DESC`,
      [productId]
    );
    return res.rows;
  }
  const store = repo.getStore();
  return store.reviews
    .filter(r => r.product_id === Number(productId) && r.status === 'approved')
    .map(r => {
      const u = store.users.find(user => user.id === r.user_id);
      return { ...r, user_name: u ? u.name : 'Customer' };
    });
}

async function addReview({ productId, userId, rating, title, comment }) {
  if (repo.isPostgres()) {
    const res = await query(
      `INSERT INTO reviews (product_id, user_id, rating, title, comment, status)
       VALUES ($1, $2, $3, $4, $5, 'approved') RETURNING *`,
      [productId, userId, rating, title, comment]
    );
    // Recalculate product rating
    const avgRes = await query(
      'SELECT AVG(rating)::numeric(3,2) as avg_rating, COUNT(*) as total FROM reviews WHERE product_id = $1 AND status = \'approved\'',
      [productId]
    );
    if (avgRes.rows.length) {
      await query(
        'UPDATE products SET rating = $1, review_count = $2 WHERE id = $3',
        [avgRes.rows[0].avg_rating, avgRes.rows[0].total, productId]
      );
    }
    return res.rows[0];
  }

  const store = repo.getStore();
  const newRev = {
    id: store._autoIncrement.reviews++,
    product_id: Number(productId),
    user_id: Number(userId),
    rating: Number(rating),
    title,
    comment,
    status: 'approved',
    created_at: new Date().toISOString()
  };
  store.reviews.push(newRev);

  // Update product avg
  const pReviews = store.reviews.filter(r => r.product_id === Number(productId) && r.status === 'approved');
  const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
  const prod = store.products.find(p => p.id === Number(productId));
  if (prod) {
    prod.rating = Number(avg.toFixed(1));
    prod.review_count = pReviews.length;
  }
  repo.saveStore();
  return newRev;
}

// ----------------- BANNERS -----------------
async function getBanners(activeOnly = true) {
  if (repo.isPostgres()) {
    let sql = 'SELECT * FROM banners';
    if (activeOnly) sql += ' WHERE is_active = TRUE';
    sql += ' ORDER BY display_order ASC, id ASC';
    const res = await query(sql);
    return res.rows;
  }
  const store = repo.getStore();
  let list = store.banners;
  if (activeOnly) list = list.filter(b => b.is_active);
  return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

// ----------------- ADMIN DASHBOARD & REPORTS -----------------
async function getAdminDashboardStats() {
  if (repo.isPostgres()) {
    const revenueRes = await query("SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE order_status != 'cancelled'");
    const ordersRes = await query('SELECT COUNT(*) as total_orders FROM orders');
    const customersRes = await query("SELECT COUNT(*) as total_customers FROM users WHERE role = 'customer'");
    const lowStockRes = await query('SELECT COUNT(*) as low_stock_count FROM products WHERE stock_quantity <= 10');
    const recentOrders = await getAllOrders({ status: 'all' });
    const topProducts = await query(
      `SELECT p.id, p.name, p.image_url, p.price, p.discount_price, p.stock_quantity,
              COALESCE(SUM(oi.quantity), 0) as total_sold
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT 5`
    );

    return {
      totalRevenue: Number(revenueRes.rows[0].total_revenue),
      totalOrders: Number(ordersRes.rows[0].total_orders),
      totalCustomers: Number(customersRes.rows[0].total_customers),
      lowStockCount: Number(lowStockRes.rows[0].low_stock_count),
      recentOrders: recentOrders.slice(0, 5),
      topProducts: topProducts.rows
    };
  }

  const store = repo.getStore();
  const validOrders = store.orders.filter(o => o.order_status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalOrders = store.orders.length;
  const totalCustomers = store.users.filter(u => u.role === 'customer').length;
  const lowStockCount = store.products.filter(p => p.stock_quantity <= 10).length;
  const recentOrders = (await getAllOrders({ status: 'all' })).slice(0, 5);

  const productSales = {};
  store.order_items.forEach(item => {
    productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
  });

  const topProducts = store.products
    .map(p => ({
      id: p.id,
      name: p.name,
      image_url: p.image_url,
      price: p.price,
      discount_price: p.discount_price,
      stock_quantity: p.stock_quantity,
      total_sold: productSales[p.id] || 0
    }))
    .sort((a, b) => b.total_sold - a.total_sold)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    lowStockCount,
    recentOrders,
    topProducts
  };
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getAllCustomers,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  getCartByUserId,
  addToCart,
  updateCartItem,
  clearCart,
  getWishlist,
  toggleWishlist,
  getAddresses,
  addAddress,
  deleteAddress,
  getCoupons,
  validateCoupon,
  createOrder,
  cancelOrderWithStockRestoration,
  getOrdersByUserId,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  getReviewsByProduct,
  addReview,
  getBanners,
  getAdminDashboardStats
};
