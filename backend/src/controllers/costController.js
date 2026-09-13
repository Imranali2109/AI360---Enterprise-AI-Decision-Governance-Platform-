const { calculateCost } = require('../utils/costCalculations');
const { MODEL_PRICING } = require('../config/modelPricing');
const prisma = require('../config/database');

exports.calculate = async (req, res, next) => {
  try {
    const { models, ...params } = req.body;

    if (!models || !Array.isArray(models) || models.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one model must be selected' });
    }

    // Map frontend field names to calculator function names
    const mappedParams = {
      numUsers: params.users || params.numUsers || 0,
      requestsPerDay: params.requestsPerUserPerDay || params.requestsPerDay || 0,
      avgInputTokens: params.avgInputTokens || 0,
      avgOutputTokens: params.avgOutputTokens || 0,
      workingDaysPerMonth: params.workingDaysPerMonth || 22,
    };

    const results = models.map(model => calculateCost({ ...mappedParams, model }));

    // Find cheapest model for comparison
    const sorted = [...results].sort((a, b) => a.annualCostInr - b.annualCostInr);
    const cheapest = sorted[0];
    const mostExpensive = sorted[sorted.length - 1];
    const savingsPercent = mostExpensive.annualCostInr > 0
      ? Math.round((1 - cheapest.annualCostInr / mostExpensive.annualCostInr) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        results,
        comparison: {
          cheapestModel: cheapest.modelName,
          mostExpensiveModel: mostExpensive.modelName,
          savingsPercent,
          message: savingsPercent > 0
            ? `${cheapest.modelName} is approximately ${savingsPercent}% cheaper than ${mostExpensive.modelName}.`
            : 'All selected models have similar costs.'
        },
        pricingNote: 'Pricing based on published rates as of 2024. Actual costs may vary. Exchange rate: 1 USD = ₹83.5'
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCalculations = async (req, res, next) => {
  res.json({ success: true, data: [] });
};

exports.getModels = (req, res) => {
  const models = Object.entries(MODEL_PRICING).map(([id, data]) => ({
    id,
    name: data.name,
    provider: data.provider,
    inputPer1k: data.inputPer1k,
    outputPer1k: data.outputPer1k,
  }));
  res.json({ success: true, data: models });
};
