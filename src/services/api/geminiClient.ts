import { GEMINI_API_KEY, GEMINI_API_URL } from '../../config/api';
import { createQuizError } from '../errors';
import { logger } from '../../utils/logger';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export const callGeminiAPI = async (imageBase64: string, prompt: string): Promise<string> => {
  try {
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageBase64.split(',')[1]
            }
          }
        ]
      }]
    };

    logger.debug('Sending request to Gemini API', { prompt });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();

    if (!response.ok) {
      logger.error('Gemini API error response', responseData);
      throw createQuizError('Failed to communicate with the AI service.', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
    }

    logger.debug('Received response from Gemini API', responseData);

    const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw createQuizError('Invalid response format from AI service.', { responseData });
    }

    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw createQuizError('AI service error', { 
        message: error.message,
        name: error.name,
        cause: error
      });
    }
    throw error;
  }
};