const prisma = require('../config/database');

exports.getDashboard = async (req, res, next) => {
  try {
    const totalUseCases = await prisma.useCase.count();
    const highPriorityCount = await prisma.useCase.count({ where: { priority: 'High' } });
    const activePoCsCount = await prisma.useCase.count({ where: { stage: 'PoC' } });

    const aggr = await prisma.useCase.aggregate({
      _sum: { operatingCost: true, annualSavings: true }
    });
    
    const highRiskCount = await prisma.riskAssessment.count({ where: { riskLevel: 'High' } });

    const priorityGroup = await prisma.useCase.groupBy({ by: ['priority'], _count: { id: true } });
    const priorityDistribution = { High: 0, Medium: 0, Low: 0 };
    priorityGroup.forEach(g => priorityDistribution[g.priority] = g._count.id);

    const stageGroup = await prisma.useCase.groupBy({ by: ['stage'], _count: { id: true } });
    const stageDistribution = { Idea: 0, Assessment: 0, PoC: 0, Pilot: 0, Production: 0, Rejected: 0 };
    stageGroup.forEach(g => stageDistribution[g.stage] = g._count.id);

    const riskGroup = await prisma.riskAssessment.groupBy({ by: ['riskLevel'], _count: { id: true } });
    const riskDistribution = { Low: 0, Medium: 0, High: 0 };
    riskGroup.forEach(g => riskDistribution[g.riskLevel] = g._count.id);

    const topUseCases = await prisma.useCase.findMany({
      orderBy: { priorityScore: 'desc' },
      take: 5
    });

    const recentUseCases = await prisma.useCase.findMany({
      include: { riskAssessments: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      success: true,
      data: {
        totalUseCases,
        highPriorityCount,
        activePoCsCount,
        totalProjectedCost: aggr._sum.operatingCost || 0,
        totalProjectedBenefit: aggr._sum.annualSavings || 0,
        highRiskCount,
        priorityDistribution,
        stageDistribution,
        riskDistribution,
        topUseCases,
        recentUseCases
      }
    });
  } catch (error) {
    next(error);
  }
};
