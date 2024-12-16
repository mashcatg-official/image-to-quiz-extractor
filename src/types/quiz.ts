export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer?: string;
}

export interface ApiResponse {
  questions: QuizQuestion[];
}