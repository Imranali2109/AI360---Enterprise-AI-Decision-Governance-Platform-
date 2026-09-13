async function generateEmbedding(text) {
  // Mock embedding generator - deterministic hash based approach to simulate embeddings
  const length = 1536;
  const embedding = new Array(length).fill(0);
  
  // Simple deterministic pseudo-embedding based on character codes
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  
  for (let i = 0; i < length; i++) {
    embedding[i] = Math.sin(hash + i) * 0.1; 
  }
  
  return embedding;
}

async function findSimilarChunks(queryEmbedding, topK = 5) {
  // Mock finding similar chunks since pgvector may not be installed
  return [
    { content: 'Employees are entitled to 12 casual leaves per year, which can be taken in single or half days.', documentName: 'Leave Policy.pdf', pageNumber: 4, similarity: 0.92 },
    { content: 'Medical certificate is required for sick leave exceeding 3 consecutive days.', documentName: 'Leave Policy.pdf', pageNumber: 5, similarity: 0.85 },
  ];
}

module.exports = { generateEmbedding, findSimilarChunks };
