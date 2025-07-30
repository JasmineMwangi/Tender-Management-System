const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

// Create a new bid
router.post('/', bidController.createBid);

// Get all bids
router.get('/', bidController.getAllBids);

// Get a single bid by ID
router.get('/:id', bidController.getBidById);

// Update a bid by ID
router.put('/:id', bidController.updateBid);

// Delete a bid by ID
router.delete('/:id', bidController.deleteBid);

module.exports = router;
