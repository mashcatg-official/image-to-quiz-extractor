import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerationConfig,
} from '@google/generative-ai';
import { GEMINI_API_KEY } from '../../config/api';
import { createQuizError } from '../errors';
import { logger } from '../../utils/logger';

const MODEL_NAME = 'gemini-pro-vision';
const GENERATION_CONFIG: GenerationConfig = {
  temperature: 0.4,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
};

class GeminiService {
  private model: GenerativeModel;

  constructor() {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: GENERATION_CONFIG,
    });
  }

  async analyzeImage(imageData: string, prompt: string): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      
      // Create image part for the model
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        },
      };

      logger.debug('Initiating Gemini vision analysis');
      
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw createQuizError('Empty response from AI service');
      }

      logger.debug('Successfully received Gemini response');
      return text;
    } catch (error) {
      logger.error('Gemini API error', error);
      if (error instanceof Error) {
        throw createQuizError('Failed to analyze image', {
          cause: error.message,
        });
      }
      throw error;
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();