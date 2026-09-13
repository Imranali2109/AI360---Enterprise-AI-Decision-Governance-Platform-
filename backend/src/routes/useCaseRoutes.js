const express = require('express');
const router = express.Router();
const useCaseController = require('../controllers/useCaseController');
const auth = require('../middleware/auth');

router.get('/', auth, useCaseController.getAll);
router.post('/', auth, useCaseController.create);
router.get('/stats', useCaseController.getStats);
router.get('/:id', auth, useCaseController.getById);
router.put('/:id', auth, useCaseController.update);
router.delete('/:id', auth, useCaseController.delete);

module.exports = router;
