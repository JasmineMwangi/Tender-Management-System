//tenderRoutes.js
const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');

// POST /api/tenders → create a new tender
router.post('/', tenderController.createTender);

// You can also include other CRUD routes like:
router.get('/', tenderController.getAllTenders);
router.get('/:id', tenderController.getTenderById);
router.put('/:id', tenderController.updateTender);
router.delete('/:id', tenderController.deleteTender);
router.post('/tenders', tenderController.createTender);

module.exports = router;
