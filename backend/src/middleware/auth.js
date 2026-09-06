const jwt = require('jsonwebtoken');
const config = require('../config');
const storeModel = require('../models/storeModel');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await storeModel.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }
  next();
}

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await storeModel.findUserById(decoded.id);
      if (user) req.user = user;
    } catch (e) {
      // ignore expired optional token
    }
  }
  next();
}

module.exports = {
  verifyToken,
  requireAdmin,
  optionalAuth
};
