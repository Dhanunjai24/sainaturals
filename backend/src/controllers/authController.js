const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const storeModel = require('../models/storeModel');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await storeModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await storeModel.createUser({
      name,
      email,
      phone: phone || '',
      password_hash,
      role: 'customer'
    });

    const token = generateToken(user);
    res.status(201).json({
      message: 'Registration successful!',
      user,
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message || 'Error registering account' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await storeModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const { password_hash, ...userProfile } = user;
    const token = generateToken(user);

    res.json({
      message: 'Login successful!',
      user: userProfile,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Error logging in' });
  }
}

async function getMe(req, res) {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  register,
  login,
  getMe
};
