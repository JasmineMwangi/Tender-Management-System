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

router.get('/user/:userId', bidController.getBidsByUserId);


// routes/bidRoutes.js
router.get('/', async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { userId: req.user.id }, // Make sure req.user is populated from auth middleware
    });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
});


// Delete a bid by ID
router.delete('/:id', bidController.deleteBid);


module.exports = router;
