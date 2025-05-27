import React, { useState } from "react";
import { useQuery } from "react-query";
import { fetchQuizzes, Quiz } from "../services/api";

const QuizPage = () => {
  const { data: quizzes = [] } = useQuery<Quiz[]>("quizzes", fetchQuizzes);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setAnswers(Array(quiz.questions.length).fill(-1));
    setScore(null);
  };

  const handleAnswer = (qIdx: number, optIdx: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const submitQuiz = () => {
    if (!selectedQuiz) return;
    let s = 0;
    selectedQuiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) s++;
    });
    setScore(s);
    // Qui puoi anche salvare il punteggio sul backend per la dashboard
  };

  if (!selectedQuiz)
    return (
      <div className="p-4">
        <h2 className="text-2xl mb-4 font-bold">Scegli un quiz</h2>
        <ul className="space-y-2">
          {quizzes.map((q) => (
            <li key={q.id}>
              <button className="btn btn-primary" onClick={() => startQuiz(q)}>
                {q.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">{selectedQuiz.title}</h2>
      {selectedQuiz.questions.map((q, qIdx) => (
        <div key={qIdx} className="mb-6">
          <div className="font-semibold mb-2">
            {qIdx + 1}. {q.question}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt, oIdx) => (
              <label key={oIdx} className="flex items-center">
                <input type="radio" name={`q${qIdx}`} checked={answers[qIdx] === oIdx} onChange={() => handleAnswer(qIdx, oIdx)} className="mr-2" />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      {score === null ? (
        <button className="btn btn-primary" onClick={submitQuiz}>
          Invia quiz
        </button>
      ) : (
        <div className="mt-4 text-xl font-bold text-green-700">
          Punteggio: {score} / {selectedQuiz.questions.length}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
