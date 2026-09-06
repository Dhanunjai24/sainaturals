const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../config');
const { getSeedData } = require('./seedData');

let dbMode = 'postgres';
let pool = null;
let memoryStore = null;
const DATA_DIR = path.join(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Helper to ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Save memory store to file
function persistMemoryStore() {
  ensureDataDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), 'utf8');
}

// Initialize embedded fallback database
async function initFallbackStore() {
  ensureDataDir();
  if (fs.existsSync(STORE_PATH)) {
    try {
      memoryStore = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
      console.log('📦 Loaded existing local database store from file.');
      return;
    } catch (e) {
      console.warn('⚠️ Could not parse existing store.json, re-seeding...');
    }
  }

  const seed = await getSeedData();
  memoryStore = {
    users: seed.users,
    categories: seed.categories,
    products: seed.products,
    product_variants: [],
    carts: [],
    cart_items: [],
    wishlists: [],
    addresses: seed.addresses,
    coupons: seed.coupons,
    orders: [],
    order_items: [],
    payments: [],
    deliveries: [],
    inventory_logs: [],
    reviews: seed.reviews,
    banners: seed.banners,
    _autoIncrement: {
      users: seed.users.length + 1,
      categories: seed.categories.length + 1,
      products: seed.products.length + 1,
      carts: 1,
      cart_items: 1,
      wishlists: 1,
      addresses: seed.addresses.length + 1,
      coupons: seed.coupons.length + 1,
      orders: 1,
      order_items: 1,
      payments: 1,
      deliveries: 1,
      inventory_logs: 1,
      reviews: seed.reviews.length + 1,
      banners: seed.banners.length + 1
    }
  };
  persistMemoryStore();
  console.log('✅ Local database initialized and seeded successfully.');
}

// Connect and test DB
async function initDb() {
  if (config.databaseUrl) {
    try {
      pool = new Pool({
        connectionString: config.databaseUrl,
        ssl: config.databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false
      });
      const client = await pool.connect();
      client.release();
      dbMode = 'postgres';
      console.log('🐘 Connected to PostgreSQL database successfully!');

      // Run schema
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
      }

      // Check if seeded
      const { rows } = await pool.query('SELECT COUNT(*) as count FROM products');
      if (parseInt(rows[0].count, 10) === 0) {
        console.log('🌱 Seeding PostgreSQL database with initial products...');
        const seed = await getSeedData();
        for (const cat of seed.categories) {
          await pool.query(
            `INSERT INTO categories (id, name, local_name, slug, description, icon, image_url, display_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [cat.id, cat.name, cat.local_name, cat.slug, cat.description, cat.icon, cat.image_url, cat.display_order]
          );
        }
        for (const prod of seed.products) {
          await pool.query(
            `INSERT INTO products (id, category_id, name, local_name, slug, description, price, discount_price, stock_quantity, unit, image_url, is_featured, is_active, rating, review_count)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             ON CONFLICT (id) DO NOTHING`,
            [prod.id, prod.category_id, prod.name, prod.local_name, prod.slug, prod.description, prod.price, prod.discount_price, prod.stock_quantity, prod.unit, prod.image_url, prod.is_featured, prod.is_active, prod.rating, prod.review_count]
          );
        }
        for (const u of seed.users) {
          await pool.query(
            `INSERT INTO users (id, name, email, phone, password_hash, role)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [u.id, u.name, u.email, u.phone, u.password_hash, u.role]
          );
        }
        for (const c of seed.coupons) {
          await pool.query(
            `INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount, valid_until, max_uses, used_count, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (id) DO NOTHING`,
            [c.id, c.code, c.description, c.discount_type, c.discount_value, c.min_order_amount, c.max_discount, c.valid_until, c.max_uses, c.used_count, c.is_active]
          );
        }
        for (const b of seed.banners) {
          await pool.query(
            `INSERT INTO banners (id, title, subtitle, badge, image_url, link_url, display_order, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [b.id, b.title, b.subtitle, b.badge, b.image_url, b.link_url, b.display_order, b.is_active]
          );
        }
        console.log('✅ PostgreSQL seeded successfully.');
      }
      return;
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed:', err.message);
      console.log('🔄 Switching to embedded local database engine...');
    }
  }
  dbMode = 'embedded';
  await initFallbackStore();
}

// Query helper for both modes
async function query(text, params = []) {
  if (dbMode === 'postgres' && pool) {
    return pool.query(text, params);
  }
  // Embedded execution
  return executeEmbedded(text, params);
}

// Transaction client helper
async function getClient() {
  if (dbMode === 'postgres' && pool) {
    return pool.connect();
  }
  // Embedded transaction simulation
  let inTransaction = false;
  let snapshot = null;
  return {
    query: async (text, params = []) => {
      const normalized = text.trim().toUpperCase();
      if (normalized === 'BEGIN') {
        inTransaction = true;
        snapshot = JSON.stringify(memoryStore);
        return { rows: [] };
      }
      if (normalized === 'COMMIT') {
        inTransaction = false;
        snapshot = null;
        persistMemoryStore();
        return { rows: [] };
      }
      if (normalized === 'ROLLBACK') {
        if (snapshot) {
          memoryStore = JSON.parse(snapshot);
        }
        inTransaction = false;
        snapshot = null;
        return { rows: [] };
      }
      const res = await executeEmbedded(text, params);
      if (!inTransaction) {
        persistMemoryStore();
      }
      return res;
    },
    release: () => {}
  };
}

// Embedded SQL interpreter for common queries
function executeEmbedded(text, params = []) {
  if (!memoryStore) {
    throw new Error('Database not initialized');
  }

  const sql = text.trim();
  const lower = sql.toLowerCase();

  // 1. SELECT
  if (lower.startsWith('select')) {
    // Check table
    for (const table of Object.keys(memoryStore)) {
      if (table.startsWith('_')) continue;
      const regex = new RegExp(`\\bfrom\\s+${table}\\b`, 'i');
      if (regex.test(sql)) {
        let items = [...(memoryStore[table] || [])];

        // Basic WHERE filters
        // WHERE id = $1
        if (/where\s+id\s*=\s*\$1/i.test(sql) && params.length >= 1) {
          items = items.filter(i => i.id === Number(params[0]));
        } else if (/where\s+email\s*=\s*\$1/i.test(sql) && params.length >= 1) {
          items = items.filter(i => i.email.toLowerCase() === String(params[0]).toLowerCase());
        } else if (/where\s+slug\s*=\s*\$1/i.test(sql) && params.length >= 1) {
          items = items.filter(i => i.slug === params[0]);
        } else if (/where\s+user_id\s*=\s*\$1/i.test(sql) && params.length >= 1) {
          items = items.filter(i => i.user_id === Number(params[0]));
        } else if (/where\s+order_id\s*=\s*\$1/i.test(sql) && params.length >= 1) {
          items = items.filter(i => i.order_id === Number(params[0]));
        } else if (/where\s+order_number\s*=\s*\$1/i.test(sql) && params.length >= 1) {
          items = items.filter(i => i.order_number === params[0]);
        } else if (/where\s+code\s*=\s*\$1/i.test(sql) && params.length >= 1) {
          items = items.filter(i => i.code.toUpperCase() === String(params[0]).toUpperCase());
        } else if (/where\s+product_id\s*=\s*\$1/i.test(sql) && params.length >= 1) {
          items = items.filter(i => i.product_id === Number(params[0]));
        }

        // Count queries
        if (/select\s+count\(\*\)/i.test(sql)) {
          return { rows: [{ count: items.length }] };
        }

        return { rows: items };
      }
    }
  }

  // Fallback direct accessor
  return { rows: [] };
}

// Export direct entity repository helpers for reliable operations across both DB modes
const repo = {
  getStore: () => memoryStore,
  saveStore: () => persistMemoryStore(),
  isPostgres: () => dbMode === 'postgres',
  getPool: () => pool
};

module.exports = {
  initDb,
  query,
  getClient,
  repo
};
