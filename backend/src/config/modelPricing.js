const USD_TO_INR = 83.5;
const MODEL_PRICING = {
  'gpt-4o': { inputPer1k: 0.005, outputPer1k: 0.015, name: 'GPT-4o (OpenAI)', provider: 'OpenAI' },
  'gpt-4o-mini': { inputPer1k: 0.00015, outputPer1k: 0.0006, name: 'GPT-4o Mini (OpenAI)', provider: 'OpenAI' },
  'gemini-1.5-pro': { inputPer1k: 0.0035, outputPer1k: 0.0105, name: 'Gemini 1.5 Pro (Google)', provider: 'Google' },
  'gemini-1.5-flash': { inputPer1k: 0.000075, outputPer1k: 0.0003, name: 'Gemini 1.5 Flash (Google)', provider: 'Google' },
  'claude-3-5-sonnet': { inputPer1k: 0.003, outputPer1k: 0.015, name: 'Claude 3.5 Sonnet (Anthropic)', provider: 'Anthropic' },
  'claude-3-haiku': { inputPer1k: 0.00025, outputPer1k: 0.00125, name: 'Claude 3 Haiku (Anthropic)', provider: 'Anthropic' }
};
module.exports = { MODEL_PRICING, USD_TO_INR };
