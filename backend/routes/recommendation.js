const router = require('express').Router();
const ctrl   = require('../controllers/recommendationController');
const auth   = require('../middlewares/authMiddleware').protect;

router.get('/',                      auth, ctrl.getRecommendations);
router.post('/:tenderId/save',       auth, ctrl.saveRecommendation);
router.post('/:tenderId/dismiss',    auth, ctrl.dismissRecommendation);

module.exports = router;