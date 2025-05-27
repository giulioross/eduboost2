import { useEffect, useState } from "react";
import { fetchQuizzes, createQuiz, deleteQuiz, Quiz, QuizQuestion } from "../services/api";

const emptyQuestion = (): QuizQuestion => ({
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});

const QuizAdminPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()]);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = async () => {
    try {
      const data = await fetchQuizzes();
      setQuizzes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Errore nel caricamento quiz");
      setQuizzes([]);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleAddQuestion = () => {
    if (questions.length < 10) setQuestions([...questions, emptyQuestion()]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length > 1) setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, value: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, question: value } : q)));
  };

  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIdx ? { ...q, options: q.options.map((opt, j) => (j === oIdx ? value : opt)) } : q)));
  };

  const handleCorrectChange = (qIdx: number, correctIdx: number) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIdx ? { ...q, correctIndex: correctIdx } : q)));
  };

  const handleAddQuiz = async () => {
    try {
      await createQuiz({ title, questions });
      setTitle("");
      setQuestions([emptyQuestion()]);
      loadQuizzes();
    } catch (err: any) {
      setError(err.message || "Errore durante la creazione");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuiz(id);
      loadQuizzes();
    } catch (err: any) {
      setError(err.message || "Errore durante l'eliminazione");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestione Quiz</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="mb-4">
        <input className="border p-2 mr-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo quiz" />
      </div>
      <div className="mb-4 space-y-6">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold">Domanda {qIdx + 1}</label>
              {questions.length > 1 && (
                <button className="text-red-500 text-xs" onClick={() => handleRemoveQuestion(qIdx)} type="button">
                  Rimuovi
                </button>
              )}
            </div>
            <input
              className="input w-full mb-2"
              placeholder="Testo domanda"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center">
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.correctIndex === oIdx}
                    onChange={() => handleCorrectChange(qIdx, oIdx)}
                    className="mr-2"
                  />
                  <input
                    className="input w-full"
                    placeholder={`Risposta ${oIdx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {questions.length < 10 && (
          <button className="btn btn-secondary" type="button" onClick={handleAddQuestion}>
            + Aggiungi domanda
          </button>
        )}
      </div>
      <button onClick={handleAddQuiz} className="bg-blue-600 text-white px-4 py-2 rounded">
        Salva Quiz
      </button>
      <ul className="space-y-2 mt-8">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="flex justify-between items-center border p-3 rounded">
            <span>{quiz.title}</span>
            <button onClick={() => handleDelete(quiz.id)} className="bg-red-500 text-white px-2 py-1 rounded">
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizAdminPage;
