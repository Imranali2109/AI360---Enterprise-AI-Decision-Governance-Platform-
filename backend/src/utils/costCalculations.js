const { MODEL_PRICING, USD_TO_INR } = require('../config/modelPricing');

function calculateCost(inputs) {
  const {
    numUsers = 0,
    requestsPerDay = 0,
    workingDaysPerMonth = 22,
    avgInputTokens = 0,
    avgOutputTokens = 0,
    model = 'gpt-4o'
  } = inputs;

  const pricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-4o'];
  const monthlyRequests = numUsers * requestsPerDay * workingDaysPerMonth;
  const monthlyInputTokens = monthlyRequests * avgInputTokens;
  const monthlyOutputTokens = monthlyRequests * avgOutputTokens;
  
  const monthlyCostUsd = (monthlyInputTokens / 1000 * pricing.inputPer1k) + (monthlyOutputTokens / 1000 * pricing.outputPer1k);
  const monthlyCostInr = monthlyCostUsd * USD_TO_INR;
  const annualCostInr = monthlyCostInr * 12;

  return {
    monthlyRequests,
    monthlyInputTokens,
    monthlyOutputTokens,
    monthlyCostInr,
    annualCostInr,
    model,
    modelName: pricing.name
  };
}

module.exports = { calculateCost };
