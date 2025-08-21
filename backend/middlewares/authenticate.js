// const jwt = require('jsonwebtoken');
// //const { User } = require('../models');
// const db = require('../models');
// const User = db.User || db.user;   // handle both cases



// const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     } 
//     console.log('🔑 Authenticating with token:', token);

//     const decoded = jwt.verify(token, JWT_SECRET);

//     const user = await User.findByPk(decoded.id);
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
//   }
// };

// // ✅ Export as an object with 'authenticate' key
// module.exports = { authenticate };
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User || db.user;   // ✅ flexible import

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    console.log('🔑 Authenticating with token:', token);

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = { authenticate };
