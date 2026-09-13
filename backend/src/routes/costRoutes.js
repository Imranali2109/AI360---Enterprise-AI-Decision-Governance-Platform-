const express = require('express');
const router = express.Router();
const costController = require('../controllers/costController');
const auth = require('../middleware/auth');
const { MODEL_PRICING } = require('../config/modelPricing');

router.post('/calculate', auth, costController.calculate);
router.get('/calculations', auth, costController.getCalculations);
router.get('/models', (req, res) => res.json({ success: true, data: MODEL_PRICING }));

module.exports = router;
