// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authenticate');
const { protect } = require('../middlewares/authMiddleware');

const {registerBidder,registerOrganization,login,logout,} = require('../controllers/authController');


// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.get('/protected', protect, authController.protectedRoute);
router.post('/register/bidder', registerBidder);
router.post('/register/organization', registerOrganization);
router.post('/login', login);
router.post('/logout', logout);


router.get('/profile', authenticate, (req, res) => {
  const user = req.user.toJSON(); // Sequelize instance → plain object
  delete user.password; // Never return hashed password
  res.json(user);
});



module.exports = router;
