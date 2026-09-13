const prisma = require('../config/database');
const { evaluateModel } = require('../ai/llmService');
const { isDemoMode } = require('../config/env');
const { MODEL_PRICING, USD_TO_INR } = require('../config/modelPricing');
const { v4: uuidv4 } = require('uuid');

exports.evaluate = async (req, res, next) => {
  try {
    const { prompt, models, context } = req.body;
    if (!prompt || !models || !Array.isArray(models) || models.length === 0) {
      return res.status(400).json({ success: false, message: 'Prompt and models array are required' });
    }

    const sessionId = uuidv4();
    const demoMode = isDemoMode();
    const results = [];

    for (const model of models) {
      const evalResult = await evaluateModel(model, prompt, context, demoMode);

      // Calculate cost based on token usage and model pricing
      const pricing = MODEL_PRICING[model];
      let estimatedCostInr = 0;
      if (pricing && evalResult.inputTokens && evalResult.outputTokens) {
        const costUsd = (evalResult.inputTokens / 1000 * pricing.inputPer1k) +
          (evalResult.outputTokens / 1000 * pricing.outputPer1k);
        estimatedCostInr = costUsd * USD_TO_INR;
      }

      // Normalize latency for scoring (lower latency = higher score)
      const latencyMs = evalResult.latencyMs || 1000;
      const latencyScore = Math.max(0, 100 - (latencyMs / 50)); // 5000ms = 0 score

      // Normalize cost for scoring (lower cost = higher score)
      const maxCostInr = 10; // ₹10 per call = 0 score
      const costScore = Math.max(0, 100 - (estimatedCostInr / maxCostInr * 100));

      const qualityScore = evalResult.qualityScore || 85;
      const reliabilityScore = evalResult.reliabilityScore || 90;
      const overallScore = Math.round(
        qualityScore * 0.50 +
        costScore * 0.20 +
        latencyScore * 0.15 +
        reliabilityScore * 0.15
      );

      // Save to DB
      await prisma.lLMEvaluation.create({
        data: {
          sessionId,
          prompt,
          model,
          response: evalResult.response || '',
          qualityScore,
          latencyMs,
          inputTokens: evalResult.inputTokens || 0,
          outputTokens: evalResult.outputTokens || 0,
          estimatedCostInr: Math.round(estimatedCostInr * 100) / 100,
          reliabilityScore,
          overallScore,
          isDemoMode: demoMode,
        }
      });

      results.push({
        model,
        modelName: MODEL_PRICING[model]?.name || model,
        provider: MODEL_PRICING[model]?.provider || 'Unknown',
        response: evalResult.response,
        qualityScore,
        latencyMs,
        inputTokens: evalResult.inputTokens || 0,
        outputTokens: evalResult.outputTokens || 0,
        estimatedCostInr: Math.round(estimatedCostInr * 100) / 100,
        reliabilityScore,
        overallScore,
        isDemoMode: demoMode,
      });
    }

    // Find best model by overall score
    const winner = results.reduce((best, r) => r.overallScore > best.overallScore ? r : best, results[0]);

    res.json({
      success: true,
      data: {
        sessionId,
        results,
        winner: winner?.model,
        isDemoMode: demoMode,
        recommendation: `Based on this evaluation, ${winner?.modelName} offers the best overall balance of quality, cost, and speed.`
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getEvaluations = async (req, res, next) => {
  try {
    const evals = await prisma.lLMEvaluation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: evals });
  } catch (error) {
    next(error);
  }
};

exports.getModels = (req, res) => {
  const models = Object.entries(MODEL_PRICING).map(([id, data]) => ({
    id,
    name: data.name,
    provider: data.provider,
  }));
  res.json({ success: true, data: models });
};
