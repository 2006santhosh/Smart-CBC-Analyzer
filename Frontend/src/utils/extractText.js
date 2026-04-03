import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractText(file, onProgress) {
  try {
    let rawText = '';
    
    if (file.type === 'application/pdf') {
      if (onProgress) onProgress('Extracting text from PDF...');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        rawText += pageText + ' ';
      }
    } else if (file.type.startsWith('image/')) {
      if (onProgress) onProgress('Extracting text from image...');
      // Convert file to URL for Tesseract
      const url = URL.createObjectURL(file);
      const result = await Tesseract.recognize(url, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text' && onProgress) {
             onProgress(`Extracting text... ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      URL.revokeObjectURL(url);
      rawText = result.data.text;
    } else {
      return { text: '', success: false, error: 'Unsupported file type' };
    }

    const text = rawText.toLowerCase().replace(/[^\S\r\n]+/g, ' ').trim();

    if (!text || text.length < 5) {
      return { text: '', success: false, error: 'File is empty or unreadable' };
    }

    return { text, success: true };
    
  } catch (error) {
    console.error('OCR Error:', error);
    return { text: '', success: false, error: 'Could not extract text' };
  }
}
