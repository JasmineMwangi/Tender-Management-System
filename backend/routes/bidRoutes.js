// routes/bidRoutes.js
const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const { Bid } = require('../models');

// Create a new bid
router.post('/', bidController.createBid);

// Get all bids
router.get('/', bidController.getAllBids);

// Get a single bid by ID
router.get('/:id', bidController.getBidById);

// Update a bid by ID
router.put('/:id', bidController.updateBid);

// Get bids by user ID
router.get('/user/:userId', bidController.getBidsByUserId);

// Bid History Routes (for bidders)
// Get bid history for a specific user
router.get('/history/user/:userId', bidController.getBidHistory);

// Get bid history statistics for dashboard
router.get('/history/user/:userId/stats', bidController.getBidHistoryStats);

// Get detailed bid information (bidder view)
router.get('/history/:id/details', bidController.getBidDetailsForBidder);

// Get bid timeline/activity log
router.get('/history/:id/timeline', bidController.getBidTimeline);

// Withdraw a pending bid
router.patch('/history/:id/withdraw', bidController.withdrawBid);

// Get user-specific bids
router.get('/user-bids', async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { userId: req.user.id }, // Ensure req.user is populated
    });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
});

// Delete a bid by ID
router.delete('/:id', bidController.deleteBid);

module.exports = router;
