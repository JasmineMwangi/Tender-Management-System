// routes/bidRoutes.js
const { protect } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const { Bid } = require('../models');

// Debug middleware to track all incoming requests
router.use((req, res, next) => {
    console.log(`=== BID ROUTE HIT ===`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Full URL: ${req.originalUrl}`);
    console.log(`Headers:`, req.headers);
    next();
});

router.post('/', bidController.createBid);



router.get('/received', protect, bidController.getReceivedBids);
router.get('/', bidController.getAllBids);

router.get('/user-bids', protect, async (req, res) => {
    try {
        console.log('🔍 Fetching user-bids for user:', req.user?.id);
        const bids = await Bid.findAll({
            where: { userId: req.user.id },
        });
        res.json({ success: true, data: bids });
    } catch (err) {
        console.error('Error fetching user bids:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch bids' });
    }
});



router.get('/history/user/:userId', bidController.getBidHistory);


router.get('/history/user/:userId/stats', bidController.getBidHistoryStats);

router.get('/history/:id/details', bidController.getBidDetailsForBidder);


router.get('/history/:id/timeline', bidController.getBidTimeline);


router.patch('/history/:id/withdraw', bidController.withdrawBid);



router.get('/user/:userId', bidController.getBidsByUserId);




router.get('/:id', bidController.getBidById);


router.put('/:id', bidController.updateBid);


router.delete('/:id', bidController.deleteBid);



module.exports = router;