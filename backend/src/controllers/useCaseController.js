const prisma = require('../config/database');
const { calculateOpportunityScore } = require('../utils/scoring');

exports.getAll = async (req, res, next) => {
  try {
    const { search, department, priority, stage } = req.query;
    let where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (department) where.department = department;
    if (priority) where.priority = priority;
    if (stage) where.stage = stage;

    const useCases = await prisma.useCase.findMany({
      where,
      include: { riskAssessments: true },
      orderBy: { priorityScore: 'desc' },
    });
    res.json({ success: true, data: useCases });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const useCase = await prisma.useCase.findUnique({
      where: { id: req.params.id },
      include: { riskAssessments: true },
    });
    if (!useCase) return res.status(404).json({ success: false, message: 'Use case not found' });
    res.json({ success: true, data: useCase });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const scoreData = calculateOpportunityScore(data);
    const newUseCase = await prisma.useCase.create({
      data: {
        ...data,
        priorityScore: scoreData.score,
        priority: scoreData.priority,
        recommendation: scoreData.recommendation,
      },
    });
    res.status(201).json({ success: true, data: newUseCase });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = req.body;
    const existing = await prisma.useCase.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Use case not found' });
    
    const mergedData = { ...existing, ...data };
    const scoreData = calculateOpportunityScore(mergedData);
    
    const updatedUseCase = await prisma.useCase.update({
      where: { id: req.params.id },
      data: {
        ...data,
        priorityScore: scoreData.score,
        priority: scoreData.priority,
        recommendation: scoreData.recommendation,
      },
    });
    res.json({ success: true, data: updatedUseCase });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await prisma.useCase.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Use case deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await prisma.useCase.groupBy({
      by: ['priority', 'stage', 'department'],
      _count: { id: true },
    });
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
