import { ApiResponse, QuizQuestion } from '../../types/quiz';
import { createQuizError } from '../errors';

export const parseQuizResponse = (responseText: string): QuizQuestion[] => {
  try {
    const parsedData = JSON.parse(responseText) as ApiResponse;
    
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw createQuizError('Invalid quiz data format received.', { parsedData });
    }

    // Validate each question
    parsedData.questions.forEach((question, index) => {
      if (!question.questionText || typeof question.questionText !== 'string') {
        throw createQuizError('Invalid question text.', { 
          questionIndex: index, 
          question 
        });
      }

      if (!Array.isArray(question.options) || question.options.length === 0) {
        throw createQuizError('Invalid options format.', { 
          questionIndex: index, 
          options: question.options 
        });
      }

      if (question.correctAnswer && !question.options.includes(question.correctAnswer)) {
        throw createQuizError('Correct answer not found in options.', {
          questionIndex: index,
          correctAnswer: question.correctAnswer,
          options: question.options
        });
      }
    });

    return parsedData.questions;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw createQuizError('Failed to parse AI response - invalid JSON format.', { 
        error: error.message 
      });
    }
    throw error;
  }
};