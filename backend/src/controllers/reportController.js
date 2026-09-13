const prisma = require('../config/database');
const { calculateOpportunityScore } = require('../utils/scoring');
const { calculateROI } = require('../utils/roiCalculations');
const { MODEL_PRICING } = require('../config/modelPricing');

exports.generateReport = async (req, res, next) => {
  try {
    const useCase = await prisma.useCase.findUnique({
      where: { id: req.params.useCaseId },
      include: {
        riskAssessments: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    if (!useCase) return res.status(404).json({ success: false, message: 'Not found' });

    const risk = useCase.riskAssessments[0] || null;
    const oppScore = calculateOpportunityScore(useCase);
    const roiData = calculateROI(useCase);

    res.json({
      success: true,
      data: {
        useCase,
        latestRiskAssessment: risk,
        latestRoiCalculation: roiData,
        opportunityScoreBreakdown: oppScore.breakdown,
        recommendation: oppScore.recommendation,
        governanceControls: risk ? risk.recommendations : [],
        suggestedModel: MODEL_PRICING['gpt-4o-mini']
      }
    });
  } catch (error) {
    next(error);
  }
};
