const express = require('express');
const router = express.Router();
const llmController = require('../controllers/llmController');
const auth = require('../middleware/auth');
const { MODEL_PRICING } = require('../config/modelPricing');

router.post('/evaluate', auth, llmController.evaluate);
router.get('/evaluations', auth, llmController.getEvaluations);
router.get('/models', (req, res) => res.json({ success: true, data: MODEL_PRICING }));

module.exports = router;
