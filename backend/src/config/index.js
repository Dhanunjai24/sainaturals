const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_sainaturals_2026',
  databaseUrl: process.env.DATABASE_URL,
  store: {
    name: process.env.STORE_NAME || 'Sri Sai Natural Foods',
    phone: process.env.STORE_PHONE || '+91 77995 49977',
    address: process.env.STORE_ADDRESS || 'Plot 718, Kaman Main Road, Hafeezpet, Hyderabad, Telangana 500085'
  }
};
