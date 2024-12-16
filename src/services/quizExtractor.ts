import { QuizQuestion } from '../types/quiz';
import { createQuizError } from './errors';
import { geminiService } from './api/geminiService';
import { parseQuizResponse } from './parsers/quizParser';
import { logger } from '../utils/logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    throw createQuizError('Please upload an image file.', { fileType: file.type });
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw createQuizError('File size must be less than 10MB.', { 
      fileSize: file.size,
      maxSize: MAX_FILE_SIZE 
    });
  }
};

const QUIZ_EXTRACTION_PROMPT = `
Analyze this quiz image and extract the following information in JSON format:
- Question text
- All options (typically 4 options)
- Correct answer (if marked or indicated)

Return the data in this EXACT format, with no additional text or explanations:
{
  "questions": [
    {
      "questionText": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": "..." 
    }
  ]
}`;

export const extractQuizData = async (imageBase64: string): Promise<QuizQuestion[]> => {
  try {
    logger.debug('Starting quiz extraction');
    const aiResponse = await geminiService.analyzeImage(imageBase64, QUIZ_EXTRACTION_PROMPT);
    logger.debug('Received AI response', { response: aiResponse });
    
    const questions = parseQuizResponse(aiResponse);
    logger.debug('Successfully parsed questions', { questions });
    
    return questions;
  } catch (error) {
    logger.error('Quiz extraction failed', error);
    throw createQuizError('Failed to extract quiz data.', { 
      cause: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};