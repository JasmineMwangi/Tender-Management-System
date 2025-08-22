//middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
//const  User  = require('../models/user.js');
const { User } = require('../models');


const protect = asyncHandler(async (req, res, next) => {
  console.log("🔑 JWT_SECRET being used:", process.env.JWT_SECRET);

  console.log('🔒 PROTECT MIDDLEWARE CALLED');
  console.log('URL:', req.originalUrl);
  console.log('Authorization header:', req.headers.authorization);
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      console.log('Token extracted:', token ? 'YES' : 'NO');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Token decoded, user ID:', decoded.id);
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      console.log('User found:', req.user ? req.user.id : 'NOT FOUND');
      console.log('User role:', req.user?.role);

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // This was correctly placed
    } catch (error) {
      console.error('Token verification error:', error.message);
      // console.error('Token verification error:', error);
      //return res.status(401).json({ message: 'Not authorized, token failed, error: error.message' });
      return res.status(401).json({
        message: 'Not authorized, token failed',
        error: error.message
      });

    }
  } else {
    console.log('No Bearer token found');
    // This block was unreachable before - moved outside the if statement
    //return res.status(401).json({ message: 'Not authorized, no token, error: error.message' });
    return res.status(401).json({
      message: 'Not authorized, token failed',
      error: error.message
    });

  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };