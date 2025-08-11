
// const express = require('express');
// const router = express.Router();
// const bidController = require('../controllers/bidController');
// const { Bid } = require('../models'); // Ensure this is correctly imported

// console.log('bidController:', bidController); // Check the output

// // Create a new bid
// router.post('/', bidController.createBid); // Ensure createBid is defined

// // Get all bids
// router.get('/api/bids', bidController.getAllBids); // Ensure getAllBids is defined

// // Get a single bid by ID
// router.get('/:id', bidController.getBidById); // Ensure getBidById is defined

// // Update a bid by ID
// router.put('/:id', bidController.updateBid); // Ensure updateBid is defined

// // Get bids by user ID
// router.get('/user/:userId', bidController.getBidsByUserId); // Ensure getBidsByUser Id is defined

// // Get user-specific bids
// router.get('/user-bids', async (req, res) => {
//   try {
//     const bids = await Bid.findAll({
//       where: { userId: req.user.id }, // Ensure req.user is populated
//     });
//     res.json(bids);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch bids' });
//   }
// });

// // Delete a bid by ID
// router.delete('/:id', bidController.deleteBid); // Ensure deleteBid is defined

// module.exports = router;
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
