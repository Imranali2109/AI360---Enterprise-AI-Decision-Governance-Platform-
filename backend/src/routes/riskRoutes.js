const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');
const auth = require('../middleware/auth');

router.post('/assess', auth, riskController.assess);
router.get('/assessments', auth, riskController.getAssessments);
router.get('/use-case/:useCaseId', auth, riskController.getByUseCase);

module.exports = router;
