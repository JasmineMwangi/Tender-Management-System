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

// =============================================
// BASIC BID CRUD OPERATIONS
// =============================================

/**
 * Create a new bid
 * POST /api/bids/
 */
router.post('/', bidController.createBid);

/**
 * Get all bids (admin/general purpose)
 * GET /api/bids/
 */
router.get('/', bidController.getAllBids);

// =============================================
// SPECIFIC STATIC ROUTES (Must come before parameterized routes)
// =============================================

/**
 * Get received bids for organization (protected route)
 * GET /api/bids/received
 * Middleware: protect (authentication required)
 * Only accessible by users with role 'organisation'
 */
router.get('/received', protect, bidController.getReceivedBids);

/**
 * Get bids for currently authenticated user
 * GET /api/bids/user-bids
 * Requires authentication to access req.user
 */
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

// =============================================
// BID HISTORY ROUTES (Specific multi-segment paths)
// These handle bidder-specific functionality
// =============================================

/**
 * Get bid history for a specific user
 * GET /api/bids/history/user/:userId
 */
router.get('/history/user/:userId', bidController.getBidHistory);

/**
 * Get bid history statistics for dashboard
 * GET /api/bids/history/user/:userId/stats
 */
router.get('/history/user/:userId/stats', bidController.getBidHistoryStats);

/**
 * Get detailed bid information (bidder view)
 * GET /api/bids/history/:id/details
 */
router.get('/history/:id/details', bidController.getBidDetailsForBidder);

/**
 * Get bid timeline/activity log
 * GET /api/bids/history/:id/timeline
 */
router.get('/history/:id/timeline', bidController.getBidTimeline);

/**
 * Withdraw a pending bid
 * PATCH /api/bids/history/:id/withdraw
 */
router.patch('/history/:id/withdraw', bidController.withdrawBid);

// =============================================
// USER-SPECIFIC ROUTES (Single parameter routes)
// =============================================

/**
 * Get bids by specific user ID
 * GET /api/bids/user/:userId
 */
router.get('/user/:userId', bidController.getBidsByUserId);

// =============================================
// PARAMETERIZED ROUTES (Must come LAST)
// These routes use :id parameter and will match any single segment
// If placed earlier, they would intercept specific routes like /received
// =============================================

/**
 * Get a single bid by ID
 * GET /api/bids/:id
 * WARNING: This route matches any single path segment
 * Must be placed after all specific routes
 */
router.get('/:id', bidController.getBidById);

/**
 * Update a bid by ID
 * PUT /api/bids/:id
 */
router.put('/:id', bidController.updateBid);

/**
 * Delete a bid by ID
 * DELETE /api/bids/:id
 */
router.delete('/:id', bidController.deleteBid);

// =============================================
// ROUTE ORDERING EXPLANATION
// =============================================
/*
 * CRITICAL: Route order matters in Express.js!
 * 
 * Routes are matched in the order they are defined.
 * More specific routes must come before more general ones.
 * 
 * CORRECT ORDER:
 * 1. Static routes (exact matches): /received, /user-bids
 * 2. Multi-segment specific: /history/user/:userId, /history/:id/details
 * 3. Single parameter routes: /user/:userId
 * 4. Generic parameter routes: /:id (catches everything else)
 * 
 * WRONG ORDER EXAMPLE:
 * If router.get('/:id', ...) came before router.get('/received', ...)
 * then '/received' would be treated as an ID parameter and routed
 * to the getBidById controller instead of getReceivedBids.
 * 
 * This is why the original issue occurred - /:id was matching /received
 */

module.exports = router;