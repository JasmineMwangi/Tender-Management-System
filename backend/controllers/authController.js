// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env. JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Helper: Generate token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

exports.registerAdmin = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    console.log('🧪 User Model Attributes:', User.getAttributes());

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      id: uuidv4(), // ensure unique ID
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'admin', // force admin role
      status: 'active',
      emailVerified: 0
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('❌ Admin Registration Error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};



// POST /api/auth/register/bidder
// exports.registerBidder = async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   try {
//     const existing = await User.findOne({ where: { email } });
//     if (existing) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       role: 'bidder',
//       status: 'active',
//       emailVerified: 0
//     });

//     const token = generateToken(user);
//     res.status(201).json({ token, user });
//   } catch (error) {
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//   }
// };


exports.registerBidder = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    console.log('🧪 User Model Attributes:', User.getAttributes());

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'bidder',
      status: 'active',
      emailVerified: 0
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('❌ Registration Error:', error); // full trace
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const { v4: uuidv4 } = require('uuid');
//const bcrypt = require('bcrypt');
//const { User } = require('../models');
//const { generateToken } = require('../utils/jwt'); // Adjust based on your structure


// POST /api/auth/register/organization
exports.registerOrganization = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check for existing email
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      id: uuidv4(),               // 👈 char(36) UUID
      name,         // 👈 maps to DB's `name`
      email,
      phone,
      password: hashedPassword,
      role: 'organization',       // 👈 must match ENUM in DB
      status: 'active',           // 👈 optional but safe default
      emailVerified: false        // 👈 matches default of 0
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
};


// // POST /api/auth/register/organization
// exports.registerOrganization = async (req, res) => {
//   const { organization,first_name,last_name, email, phone, password } = req.body;

//   try {
//     const existing = await User.findOne({ where: { email } });
//     if (existing) {
//       return res.status(400).json({ message: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       organization,
//       email,
//       first_name,
//       last_name,
//       phone,
//       password: hashedPassword,
//       role: 'organisation'
//     });

//     const token = generateToken(user);
//     res.status(201).json({ token, user });
//   } catch (error) {
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//   }
// };

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// GET /api/auth/protected (example route)
exports.protectedRoute = (req, res) => {
  res.json({ message: 'This is protected', user: req.user });
};

// POST /api/auth/logout (client handles token removal)
exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
