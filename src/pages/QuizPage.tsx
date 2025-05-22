import React from "react";
import { useQuery } from 'react-query';
import { fetchQuizzes, Quiz } from '../services/api';

const QuizPage: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});
  const [score, setScore] = React.useState<number | null>(null);

  const { data: quizzes = [], isLoading, error } = useQuery<Quiz[]>('quizzes', fetchQuizzes);

  const handleSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let points = 0;
    quizzes.forEach((quiz) => {
      quiz.questions.forEach((question) => {
        if (selectedAnswers[question.id] === question.correctAnswer) {
          points++;
        }
      });
    });
    setScore(points);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-6 text-red-600">
        Error loading quizzes: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{quiz.title}</h2>
          {quiz.questions.map((question) => (
            <div key={question.id} className="mb-4 p-4 border rounded shadow">
              <p className="font-medium mb-3">{question.question}</p>
              {[question.optionA, question.optionB, question.optionC].map((opt) => (
                <label key={opt} className="block mt-2">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={opt}
                    checked={selectedAnswers[question.id] === opt}
                    onChange={() => handleSelect(question.id, opt)}
                    className="mr-2"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="btn btn-primary"
      >
        Submit
      </button>

      {score !== null && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
          You scored {score} out of {quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)}
        </div>
      )}
    </div>
  );
};

export default QuizPage;