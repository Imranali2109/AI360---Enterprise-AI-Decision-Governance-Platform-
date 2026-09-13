const prisma = require('../config/database');
const { calculateRiskScore } = require('../utils/riskScoring');

exports.assess = async (req, res, next) => {
  try {
    const data = req.body;
    const { useCaseId } = data;
    if (!useCaseId) {
      return res.status(400).json({ success: false, message: 'useCaseId is required' });
    }

    const result = calculateRiskScore(data);
    const riskAssessment = await prisma.riskAssessment.create({
      data: {
        useCaseId,
        dataSensitivity: data.dataSensitivity || 'Internal',
        dataLeakageRisk: data.dataLeakageRisk || 0,
        promptInjectionRisk: data.promptInjectionRisk || 0,
        unauthorizedAccessRisk: data.unauthorizedAccessRisk || 0,
        excessivePermissionsRisk: data.excessivePermissionsRisk || 0,
        hallucinationRisk: data.hallucinationRisk || 0,
        biasRisk: data.biasRisk || 0,
        reliabilityRisk: data.reliabilityRisk || 0,
        explainabilityRisk: data.explainabilityRisk || 0,
        financialImpactRisk: data.financialImpactRisk || 0,
        customerImpactRisk: data.customerImpactRisk || 0,
        regulatoryImpactRisk: data.regulatoryImpactRisk || 0,
        humanOversightRequired: data.humanOversightRequired || false,
        ...result.breakdown,
        totalRiskScore: result.totalRiskScore,
        riskLevel: result.riskLevel,
        recommendations: result.recommendations,
      }
    });

    res.status(201).json({ success: true, data: riskAssessment });
  } catch (error) {
    next(error);
  }
};

exports.getAssessments = async (req, res, next) => {
  try {
    const assessments = await prisma.riskAssessment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: assessments });
  } catch (error) {
    next(error);
  }
};

exports.getByUseCase = async (req, res, next) => {
  try {
    const assessment = await prisma.riskAssessment.findFirst({
      where: { useCaseId: req.params.useCaseId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};
