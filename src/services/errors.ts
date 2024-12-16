export class QuizExtractionError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'QuizExtractionError';
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, QuizExtractionError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      details: this.details,
    };
  }
}

// Helper function to ensure errors are properly typed
export const createQuizError = (message: string, details?: unknown): QuizExtractionError => {
  return new QuizExtractionError(message, details);
};