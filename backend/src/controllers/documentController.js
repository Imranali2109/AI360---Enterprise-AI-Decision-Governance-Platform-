const prisma = require('../config/database');
const { ingestDocument } = require('../rag/ragPipeline');

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const doc = await prisma.document.create({
      data: {
        name: req.file.originalname,
        filename: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        status: 'Processing',
        uploadedBy: req.user.userId
      }
    });

    // Run async
    ingestDocument(doc.id, req.file.path, req.file.originalname);

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

exports.getDocuments = async (req, res, next) => {
  try {
    const docs = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id }, select: { status: true, chunkCount: true } });
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};
