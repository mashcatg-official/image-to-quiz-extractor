import React from 'react';
import { QuizQuestion } from '../types/quiz';

interface QuizListProps {
  questions: QuizQuestion[];
}

export function QuizList({ questions }: QuizListProps) {
  if (questions.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6 text-left">
      <h2 className="text-xl font-semibold mb-4">Extracted Questions</h2>
      {questions.map((question, idx) => (
        <div key={idx} className="mb-6 last:mb-0">
          <p className="font-medium text-gray-900 mb-2">
            {idx + 1}. {question.questionText}
          </p>
          <ul className="space-y-2">
            {question.options.map((option, optIdx) => (
              <li
                key={optIdx}
                className={`pl-4 ${
                  question.correctAnswer === option
                    ? 'text-green-600 font-medium'
                    : 'text-gray-600'
                }`}
              >
                {String.fromCharCode(97 + optIdx)}) {option}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}