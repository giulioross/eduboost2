import React, { useEffect, useState } from "react";

interface Quiz {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctAnswer: string;
}

const QuizPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/quizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  const handleSelect = (quizId: number, answer: string) => {
    setSelectedAnswer((prev) => ({ ...prev, [quizId]: answer }));
  };

  const handleSubmit = () => {
    let points = 0;
    quizzes.forEach((q) => {
      if (selectedAnswer[q.id] === q.correctAnswer) {
        points++;
      }
    });
    setScore(points);
  };

  return (
    <div className="container-custom py-6">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="mb-4 p-4 border rounded shadow">
          <p className="font-medium">{quiz.question}</p>
          {[quiz.optionA, quiz.optionB, quiz.optionC].map((opt) => (
            <label key={opt} className="block mt-1">
              <input
                type="radio"
                name={`quiz-${quiz.id}`}
                value={opt}
                checked={selectedAnswer[quiz.id] === opt}
                onChange={() => handleSelect(quiz.id, opt)}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700">
        Submit
      </button>

      {score !== null && (
        <div className="mt-4 text-lg font-bold">
          You scored {score} out of {quizzes.length}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
