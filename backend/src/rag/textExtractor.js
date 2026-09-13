// using pdf-parse placeholder implementation
async function extractTextFromPDF(filePath) {
  // In a real implementation this would use pdf-parse:
  // const fs = require('fs');
  // const pdf = require('pdf-parse');
  // const dataBuffer = fs.readFileSync(filePath);
  // const data = await pdf(dataBuffer);
  // return { text: data.text, pages: data.numpages, info: data.info };
  
  return {
    text: "This is a sample extracted text from a PDF document. It contains information about company policies and procedures. Casual leave entitles employees to 12 days per year. Sick leave is 15 days.",
    numPages: 5,
    info: { Title: "Sample Document" }
  };
}

module.exports = { extractTextFromPDF };
