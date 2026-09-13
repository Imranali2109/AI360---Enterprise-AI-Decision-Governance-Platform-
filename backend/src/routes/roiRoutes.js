const express = require('express');
const router = express.Router();
const roiController = require('../controllers/roiController');
const auth = require('../middleware/auth');

router.post('/calculate', auth, roiController.calculate);
router.get('/calculations', auth, roiController.getCalculations);

module.exports = router;
