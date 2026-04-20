import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

/**
 * Parse resume file (PDF or DOCX) and extract raw text
 */
export const parseResumeFile = async (buffer, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    }

    if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    throw new Error('Unsupported file type');
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};
