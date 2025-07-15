// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const {registerBidder,registerOrganization,login,logout,} = require('../controllers/authController');


// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.get('/protected', protect, authController.protectedRoute);
router.post('/register/bidder', registerBidder);
router.post('/register/organization', registerOrganization);
router.post('/login', login);
router.post('/logout', logout);


module.exports = router;
