import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createQuizWithQuestions, deleteQuiz, fetchQuizzes, Quiz, QuizQuestion } from "../services/api";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiCheck, FiX, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";

const emptyQuestion = (): QuizQuestion => ({
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});

const QuizAdminPage = () => {
  const queryClient = useQueryClient();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "create">("list");

  const loadQuizzes = async () => {
    try {
      const data = await fetchQuizzes();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Errore nel caricamento dei quiz");
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const createQuizMutation = useMutation(createQuizWithQuestions, {
    onSuccess: () => {
      queryClient.invalidateQueries("quizzes");
      toast.success("Quiz creato con successo!");
      setViewMode("list");
    },
    onError: (error: Error) => {
      toast.error(`Errore: ${error.message}`);
    },
  });

  const deleteQuizMutation = useMutation(deleteQuiz, {
    onSuccess: () => {
      queryClient.invalidateQueries("quizzes");
      toast.success("Quiz eliminato con successo");
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione del quiz");
    },
  });

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
    if (!title.trim()) {
      toast.error("Inserisci un titolo per il quiz");
      return;
    }
    if (questions.some((q) => !q.question.trim() || q.options.length !== 4 || q.options.some((opt) => !opt.trim()))) {
      toast.error("Tutte le domande devono avere testo e 4 opzioni compilate");
      return;
    }

    setIsSubmitting(true);

    try {
      const quizData = {
        title,
        quizType: "MULTIPLE_CHOICE", // o altro tipo se vuoi
        questions: questions.map((q) => ({
          questionText: q.question,
          questionType: "MULTIPLE_CHOICE",
          options: q.options.map((opt, idx) => ({
            optionText: opt,
            isCorrect: idx === q.correctIndex,
          })),
        })),
      };

      await createQuizWithQuestions(quizData);

      setTitle("");
      setQuestions([emptyQuestion()]);
      setViewMode("list");
      toast.success("Quiz creato con successo!");
      loadQuizzes();
    } catch (error) {
      toast.error("Errore durante la creazione del quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Sei sicuro di voler eliminare questo quiz?")) {
      await deleteQuizMutation.mutateAsync(id);
    }
  };

  if (viewMode === "list") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Gestione Quiz</h1>
          <button onClick={() => setViewMode("create")} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
            <FiPlus className="mr-2" />
            Nuovo Quiz
          </button>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-4">Nessun quiz disponibile</div>
            <button onClick={() => setViewMode("create")} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Crea il tuo primo quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <motion.div key={quiz.id} whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span>{quiz.questions.length} domande</span>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center">
                      <FiTrash2 className="mr-1" />
                      Elimina
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => setViewMode("list")} className="flex items-center text-blue-500 mb-6 hover:text-blue-700">
        <FiArrowLeft className="mr-2" />
        Torna alla lista
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Crea Nuovo Quiz</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Titolo del Quiz</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Es: Quiz di Matematica"
          />
        </div>

        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <motion.div key={qIdx} layout className="border border-gray-200 p-5 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Domanda {qIdx + 1}</h3>
                {questions.length > 1 && (
                  <button onClick={() => handleRemoveQuestion(qIdx)} className="text-red-500 hover:text-red-700">
                    <FiX />
                  </button>
                )}
              </div>

              <div className="mb-4">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Testo della domanda"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center">
                      <button
                        onClick={() => handleCorrectChange(qIdx, oIdx)}
                        className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          q.correctIndex === oIdx ? "border-blue-500 bg-blue-500 text-white" : "border-gray-400"
                        }`}>
                        {q.correctIndex === oIdx && <FiCheck size={12} />}
                      </button>
                      <input
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Opzione ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {questions.length < 10 && (
            <button onClick={handleAddQuestion} className="flex items-center text-blue-500 hover:text-blue-700">
              <FiPlus className="mr-2" />
              Aggiungi un'altra domanda
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAddQuiz}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg text-white flex items-center ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}>
          {isSubmitting ? "Salvataggio..." : "Salva Quiz"}
        </button>
      </div>
    </div>
  );
};

export default QuizAdminPage;
