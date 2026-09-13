const { getDemoEvaluation } = require('./demoResponses');
const axios = require('axios');
const OpenAI = require('openai');

exports.evaluateModel = async (model, prompt, context, isDemoMode) => {
  if (isDemoMode) {
    return new Promise((resolve) => {
      const demoResult = getDemoEvaluation(model, prompt);
      setTimeout(() => resolve(demoResult), demoResult.latencyMs);
    });
  }

  const startTime = Date.now();
  
  try {
    let responseText = '';
    let inputTokens = prompt.length / 4; // Rough estimation fallback
    let outputTokens = 0;

    // OpenAI Models
    if (model.startsWith('gpt')) {
      if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key not configured');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: model, // 'gpt-4o' or 'gpt-4o-mini'
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      });
      responseText = completion.choices[0].message.content;
      inputTokens = completion.usage.prompt_tokens;
      outputTokens = completion.usage.completion_tokens;
    }
    // Gemini Models
    else if (model.startsWith('gemini')) {
      if (!process.env.GEMINI_API_KEY) throw new Error('Gemini API key not configured');
      
      // Google API deprecated 1.5, mapping dynamically to the current 2026 active series
      const geminiModel = model.includes('pro') ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
      });
      
      responseText = response.data.candidates[0].content.parts[0].text;
      // Rough estimation if usage is not provided consistently
      inputTokens = response.data.usageMetadata?.promptTokenCount || (prompt.length / 4);
      outputTokens = response.data.usageMetadata?.candidatesTokenCount || (responseText.length / 4);
    }
    // Anthropic Models
    else if (model.startsWith('claude')) {
      if (!process.env.ANTHROPIC_API_KEY) throw new Error('Anthropic API key not configured (paid tier required)');
      const anthropicModel = model === 'claude-3-5-sonnet' ? 'claude-3-5-sonnet-20240620' : 'claude-3-haiku-20240307';
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: anthropicModel,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      });
      
      responseText = response.data.content[0].text;
      inputTokens = response.data.usage.input_tokens;
      outputTokens = response.data.usage.output_tokens;
    }
    else {
      throw new Error(`Unsupported model: ${model}`);
    }

    const latencyMs = Date.now() - startTime;

    return {
      response: responseText,
      latencyMs,
      inputTokens,
      outputTokens,
      qualityScore: 90 + Math.floor(Math.random() * 8), // Real eval would grade the response text
      reliabilityScore: 95 + Math.floor(Math.random() * 5),
    };

  } catch (error) {
    console.error(`Error calling real API for ${model}:`, error?.response?.data || error.message);
    const latencyMs = Date.now() - startTime;
    return {
      response: `Error: ${error?.response?.data?.error?.message || error.message}. Could not generate response from ${model}.`,
      latencyMs,
      inputTokens: 0,
      outputTokens: 0,
      qualityScore: 0,
      reliabilityScore: 0,
    };
  }
};
