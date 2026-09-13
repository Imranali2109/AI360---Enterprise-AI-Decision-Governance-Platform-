const DEMO_RESPONSES = {
  'gpt-4o': {
    response: 'Based on the analysis, the discrepancy in the billing cycle originates from the mid-month prorated adjustment applied during the plan upgrade on the 15th. I recommend issuing a $25 credit to the customer and clarifying the prorated charge in the next statement.',
    qualityScore: 94,
    latencyMs: 1850,
    inputTokens: 245,
    outputTokens: 312,
    reliabilityScore: 96
  },
  'gemini-1.5-pro': {
    response: 'The customer was charged incorrectly due to a system glitch involving the recent plan change mid-cycle. The best course of action is to refund the prorated amount of $25 and send an automated apology email to ensure customer satisfaction.',
    qualityScore: 91,
    latencyMs: 1420,
    inputTokens: 245,
    outputTokens: 280,
    reliabilityScore: 94
  },
  'gpt-4o-mini': {
    response: 'The billing discrepancy is due to a mid-month upgrade. I suggest refunding $25 to the account to resolve the complaint.',
    qualityScore: 87,
    latencyMs: 980,
    inputTokens: 245,
    outputTokens: 150,
    reliabilityScore: 90
  },
  'claude-3-5-sonnet': {
    response: 'Upon reviewing the account details, the billing error occurred when the customer upgraded their plan mid-cycle, causing a double charge for the base rate. Refunding $25 and providing a brief explanation via email will resolve the issue effectively.',
    qualityScore: 93,
    latencyMs: 2100,
    inputTokens: 245,
    outputTokens: 295,
    reliabilityScore: 95
  },
  'gemini-1.5-flash': {
    response: 'Mid-month upgrade caused the billing issue. Refund $25 to the customer.',
    qualityScore: 85,
    latencyMs: 720,
    inputTokens: 245,
    outputTokens: 90,
    reliabilityScore: 88
  },
  'claude-3-haiku': {
    response: 'The issue is related to a prorated charge from the recent upgrade. Issue a $25 refund and notify the customer.',
    qualityScore: 82,
    latencyMs: 650,
    inputTokens: 245,
    outputTokens: 110,
    reliabilityScore: 85
  }
};

exports.getDemoEvaluation = (model, prompt) => {
  const base = DEMO_RESPONSES[model] || DEMO_RESPONSES['gpt-4o-mini'];
  const variation = (Math.random() * 10) - 5;
  return {
    ...base,
    qualityScore: Math.min(100, Math.max(0, Math.round(base.qualityScore + variation))),
    latencyMs: Math.round(base.latencyMs + (variation * 20)),
  };
};
