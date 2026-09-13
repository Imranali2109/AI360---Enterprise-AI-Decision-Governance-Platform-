const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('file'), documentController.upload);
router.get('/', auth, documentController.getDocuments);
router.delete('/:id', auth, documentController.deleteDocument);
router.get('/:id/status', auth, documentController.getStatus);

module.exports = router;
