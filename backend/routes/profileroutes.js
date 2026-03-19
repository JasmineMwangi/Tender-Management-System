// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
// const { authenticateToken } = require('../middlewares/auth');
const { protect: authenticateToken } = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profilecontroller');
// const upload = require('../middlewares/upload'); // Assuming you have multer setup

// Admin Profile Routes
router.get('/admin', authenticateToken, profileController.getAdminProfile);
router.post('/admin', authenticateToken, profileController.createAdminProfile);
router.put('/admin', authenticateToken, profileController.updateAdminProfile);
// router.post('/admin/upload-image', authenticateToken, upload.single('profileImage'), profileController.uploadAdminImage);

// Bidder Profile Routes
router.get('/bidder', authenticateToken, profileController.getBidderProfile);
router.post('/bidder', authenticateToken, profileController.createBidderProfile);
router.put('/bidder', authenticateToken, profileController.updateBidderProfile);
//router.post('/bidder/upload-image', authenticateToken, upload.single('profileImage'), profileController.uploadBidderImage);
router.post('/bidder/verify', authenticateToken, profileController.verifyBidderProfile);

// Organization Profile Routes
router.get('/organization', authenticateToken, profileController.getOrganizationProfile);
router.post('/organization', authenticateToken, profileController.createOrganizationProfile);
router.put('/organization', authenticateToken, profileController.updateOrganizationProfile);
//router.post('/organization/upload-logo', authenticateToken, upload.single('logo'), profileController.uploadOrganizationLogo);
router.post('/organization/verify', authenticateToken, profileController.verifyOrganizationProfile);

// Get profile by user ID (admin use)
router.get('/user/:userId', authenticateToken, profileController.getProfileByUserId);

module.exports = router;