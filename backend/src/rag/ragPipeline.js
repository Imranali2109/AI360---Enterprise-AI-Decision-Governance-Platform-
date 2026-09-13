const { generateEmbedding, findSimilarChunks } = require('./embeddings');
const { extractTextFromPDF } = require('./textExtractor');
const { chunkText } = require('./textChunker');
const prisma = require('../config/database');
const { isDemoMode } = require('../config/env');
const OpenAI = require('openai');

const DEMO_QA = [
  { patterns: ['casual leave', 'cl'], answer: 'Employees are entitled to 12 casual leaves per year, which can be taken in single or half days. Casual leaves cannot be carried forward to the next year.', source: 'Leave Policy.pdf', page: 4 },
  { patterns: ['sick leave', 'medical leave'], answer: 'Employees are entitled to 15 sick leaves per year. Medical certificate is required for sick leave exceeding 3 consecutive days.', source: 'Leave Policy.pdf', page: 5 },
  { patterns: ['work from home', 'wfh', 'remote'], answer: 'Employees may work from home up to 2 days per week with manager approval. WFH requests must be submitted at least 24 hours in advance.', source: 'HR Policy.pdf', page: 12 },
  { patterns: ['travel', 'reimbursement'], answer: 'Domestic travel reimbursements must be submitted within 30 days of travel. Economy class is applicable for flights under 4 hours.', source: 'Travel Policy.pdf', page: 3 },
  { patterns: ['onboarding', 'new hire'], answer: 'New hires must complete their compliance training within the first 14 days of joining.', source: 'HR Policy.pdf', page: 8 },
  { patterns: ['hardware', 'laptop'], answer: 'Laptops are refreshed every 3 years. Requests for hardware upgrades require VP approval.', source: 'IT Security Policy.pdf', page: 7 },
  { patterns: ['password', 'security'], answer: 'Passwords must be at least 12 characters long and changed every 90 days. MFA is mandatory for all internal systems.', source: 'IT Security Policy.pdf', page: 2 },
  { patterns: ['expense', 'meal'], answer: 'Meal expenses during travel are capped at 1500 INR per day. Receipts are mandatory for all expenses above 500 INR.', source: 'Travel Policy.pdf', page: 6 }
];

async function processQuery(question, topK = 5) {
  const demo = isDemoMode();
  let answer = 'I could not find information related to your query in the provided documents.';
  let sources = [];
  
  if (demo || !process.env.OPENAI_API_KEY) {
    const lowerQ = question.toLowerCase();
    for (const qa of DEMO_QA) {
      if (qa.patterns.some(p => lowerQ.includes(p))) {
        answer = qa.answer;
        sources = [{ title: qa.source, pageNumber: qa.page }];
        break;
      }
    }
    return { answer, sources, isDemoMode: demo };
  } 

  // Real LLM RAG Mode using OpenAI
  try {
    const queryEmbedding = await generateEmbedding(question);
    const similarChunks = await findSimilarChunks(queryEmbedding, topK);
    
    if (similarChunks.length > 0) {
      // Pass the context to GPT-4o-mini to generate a smart response
      const contextText = similarChunks.map(c => `[From Document: ${c.documentName}]: ${c.content}`).join('\n\n');
      
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an internal enterprise knowledge assistant. Answer the user\'s question using ONLY the provided document context. If the context does not contain the answer, politely state that you cannot find the information. Be concise and professional.' },
          { role: 'user', content: `Context:\n${contextText}\n\nQuestion: ${question}` }
        ],
        temperature: 0.2,
      });

      answer = completion.choices[0].message.content;
      sources = similarChunks.map(c => ({ title: c.documentName, pageNumber: c.pageNumber }));
      
      // Deduplicate sources
      sources = sources.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title))===i);
    }
  } catch (error) {
    console.error('RAG Error:', error);
    answer = `Error connecting to AI: ${error.message}`;
  }

  return { answer, sources, isDemoMode: false };
}

async function ingestDocument(documentId, filePath, documentName) {
  try {
    const { text, numPages } = await extractTextFromPDF(filePath);
    const chunks = chunkText(text, 500, 50);
    
    // In a real app we'd save embeddings to DB here. For now just update status.
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'Ready', chunkCount: chunks.length, pageCount: numPages }
    });
  } catch (err) {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'Failed' }
    });
    console.error('Document ingestion failed', err);
  }
}

module.exports = { processQuery, ingestDocument };
