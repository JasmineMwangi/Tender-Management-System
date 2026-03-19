const router = require('express').Router();
const ctrl   = require('../controllers/bidEvaluation');
const auth   = require('../middlewares/authMiddleware').protect;

router.post('/:tenderId/evaluate', auth, ctrl.evaluate);       // run evaluation
router.get('/:tenderId/matrix',    auth, ctrl.getMatrix);      // get scored matrix
router.patch('/:id/status',        auth, ctrl.updateStatus);   // award/reject

module.exports = router;