import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchQuizzes, createQuiz, deleteQuiz } from "../services/api";

interface Quiz {
  id: number;
  title: string;
}

const QuizPage = () => {
  const [title, setTitle] = React.useState("");
  const queryClient = useQueryClient();

  const { data: quizzes = [], isLoading, error } = useQuery<Quiz[]>("quizzes", fetchQuizzes);

  const createMutation = useMutation(createQuiz, {
    onSuccess: () => {
      queryClient.invalidateQueries("quizzes");
      setTitle("");
    },
  });

  const deleteMutation = useMutation(deleteQuiz, {
    onSuccess: () => queryClient.invalidateQueries("quizzes"),
  });

  if (isLoading) return <div>Loading quizzes...</div>;
  if (error instanceof Error) return <div className="text-red-600">Errore nel caricamento: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4 font-bold">Quizzes</h2>

      <div className="mb-6 space-y-4">
        <input className="input w-full" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button
          disabled={createMutation.isLoading}
          className="btn btn-primary w-full"
          onClick={() =>
            createMutation.mutate({
              title,
              questions: [],
            })
          }>
          {createMutation.isLoading ? "Adding..." : "Add Quiz"}
        </button>
      </div>

      <ul className="space-y-2">
        {quizzes.map((q) => (
          <li key={q.id} className="flex justify-between p-2 border rounded shadow">
            <span>{q.title}</span>
            <button disabled={deleteMutation.isLoading} className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(q.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizPage;
