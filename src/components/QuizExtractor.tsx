import React, { useState } from 'react';
import { FileUploader } from './ui/FileUploader';
import { ErrorMessage } from './ui/ErrorMessage';
import { QuizList } from './QuizList';
import { imageToBase64 } from '../utils/imageToBase64';
import { extractQuizData, validateFile } from '../services/quizExtractor';
import { QuizExtractionError } from '../services/errors';
import { logger } from '../utils/logger';
import { QuizQuestion } from '../types/quiz';

export default function QuizExtractor() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      
      validateFile(file);
      const base64 = await imageToBase64(file);
      const extractedQuestions = await extractQuizData(base64);
      setQuestions(extractedQuestions);
    } catch (err) {
      if (err instanceof QuizExtractionError) {
        setError(err.message);
        logger.error('Quiz extraction failed', err);
      } else {
        setError('An unexpected error occurred. Please try again.');
        logger.error('Unexpected error during quiz extraction', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Quiz Image Extractor</h1>
          
          <div className="mb-8">
            <FileUploader onFileSelect={handleFileUpload} loading={loading} />
          </div>

          {error && <ErrorMessage message={error} />}
          <QuizList questions={questions} />
        </div>
      </div>
    </div>
  );
}