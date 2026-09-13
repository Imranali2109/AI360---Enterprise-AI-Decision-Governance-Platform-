function chunkText(text, chunkSize = 500, overlap = 50) {
  const words = text.split(/\s+/);
  const chunks = [];
  let index = 0;
  
  while (index < words.length) {
    const chunkWords = words.slice(index, index + chunkSize);
    chunks.push({
      content: chunkWords.join(' '),
      chunkIndex: chunks.length
    });
    index += (chunkSize - overlap);
  }
  
  return chunks;
}

module.exports = { chunkText };
