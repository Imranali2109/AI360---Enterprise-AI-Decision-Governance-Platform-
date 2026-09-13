const { processQuery } = require('../rag/ragPipeline');

exports.chat = async (req, res, next) => {
  try {
    const { question, conversationHistory } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const result = await processQuery(question);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
