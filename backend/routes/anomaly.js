const router = require('express').Router();
const ctrl   = require('../controllers/anomalyController');
const auth   = require('../middlewares/authMiddleware').protect;

router.post('/:tenderId/detect',  auth, ctrl.detect);     // run detection
router.get('/:tenderId/flags',    auth, ctrl.getFlags);   // get all flags
router.patch('/flag/:id/review',  auth, ctrl.reviewFlag); // review a flag

module.exports = router;