-- Sri Sai Natural Foods PostgreSQL Database Schema
-- Normalized e-commerce tables for local supermarket

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  local_name VARCHAR(100),
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  local_name VARCHAR(200),
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  discount_price NUMERIC(10, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL DEFAULT '1 Unit',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  discount_price NUMERIC(10, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id INT REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_cart_item UNIQUE (cart_id, product_id, variant_id)
);

CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_wishlist_item UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  street_address TEXT NOT NULL,
  landmark VARCHAR(150),
  area VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
  state VARCHAR(100) NOT NULL DEFAULT 'Telangana',
  pincode VARCHAR(10) NOT NULL,
  address_type VARCHAR(20) DEFAULT 'Home',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) DEFAULT 0,
  max_discount NUMERIC(10, 2),
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  max_uses INT DEFAULT 1000,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  address_id INT REFERENCES addresses(id) ON DELETE SET NULL,
  coupon_id INT REFERENCES coupons(id) ON DELETE SET NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  delivery_fee NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'upi', 'card')),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  order_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled')),
  delivery_slot VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  variant_id INT REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  variant_name VARCHAR(100),
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100),
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_name VARCHAR(100),
  driver_phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'assigned',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_logs (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  change_type VARCHAR(50) NOT NULL,
  quantity_change INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(150),
  comment TEXT,
  status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  subtitle VARCHAR(250),
  badge VARCHAR(50),
  image_url TEXT NOT NULL,
  link_url VARCHAR(200),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
