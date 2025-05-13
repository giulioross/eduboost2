import React, { useEffect, useState } from "react";

interface Quiz {
  id: number;
  title: string;
  questions: string[];
}

const QuizAdminPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState("");

  const fetchQuizzes = async () => {
    const res = await fetch("http://localhost:8080/api/quizzes");
    const data = await res.json();
    setQuizzes(data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAddQuiz = async () => {
    await fetch("http://localhost:8080/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchQuizzes();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8080/api/quizzes/${id}`, {
      method: "DELETE",
    });
    fetchQuizzes();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gestione Quiz</h2>
      <div className="mb-4">
        <input className="border p-2 mr-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo quiz" />
        <button onClick={handleAddQuiz} className="bg-blue-600 text-white px-4 py-2 rounded">
          Aggiungi
        </button>
      </div>
      <ul className="space-y-2">
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
