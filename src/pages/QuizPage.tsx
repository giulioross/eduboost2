import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchQuizzes, Quiz } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiAward, FiClock, FiList, FiAlertTriangle } from "react-icons/fi";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { toast } from "react-hot-toast";
export interface SubmitQuizResultInput {
  quizId: number;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

export async function submitQuizResult(input: SubmitQuizResultInput): Promise<any> {
  // implementation
}
const QuizPage = () => {
  const { width, height } = useWindowSize();
  const queryClient = useQueryClient();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const {
    data: quizzes = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Quiz[]>("quizzes", fetchQuizzes, {
    select: (data) => data.filter((quiz) => quiz.questions?.length > 0),
    staleTime: 1000 * 60 * 5,
  });

  const submitMutation = useMutation(submitQuizResult, {
    onSuccess: () => {
      queryClient.invalidateQueries("user-stats");
      queryClient.invalidateQueries("quizzes");
    },
    onError: (error: Error) => {
      toast.error(`Errore nell'invio dei risultati: ${error.message}`);
    },
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (selectedQuiz && score === null) {
      timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedQuiz, score]);

  const startQuiz = (quiz: Quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      toast.error("Questo quiz non ha domande disponibili");
      return;
    }
    setSelectedQuiz(quiz);
    setAnswers(Array(quiz.questions.length).fill(-1));
    setScore(null);
    setTimeSpent(0);
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (qIdx: number, optIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = optIdx;
    setAnswers(newAnswers);

    // Auto-advance to next question if not last
    if (qIdx < selectedQuiz!.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(qIdx + 1);
      }, 500);
    }
  };

  const submitQuiz = async () => {
    if (!selectedQuiz) return;

    const unanswered = answers.filter((a) => a === -1).length;
    if (unanswered > 0 && !window.confirm(`Hai ${unanswered} domande senza risposta. Vuoi procedere comunque?`)) {
      return;
    }

    try {
      let s = 0;
      selectedQuiz.questions.forEach((q, i) => {
        if (answers[i] === q.correctIndex) s++;
      });

      setScore(s);

      if (s === selectedQuiz.questions.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      await submitMutation.mutateAsync({
        quizId: selectedQuiz.id,
        score: s,
        totalQuestions: selectedQuiz.questions.length,
        timeSpent,
      });
    } catch (error) {
      toast.error("Errore durante l'invio del quiz");
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setScore(null);
    setAnswers([]);
    setTimeSpent(0);
    setCurrentQuestionIndex(0);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Caricamento quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto mt-8">
        <div className="flex items-center text-red-600 mb-3">
          <FiAlertTriangle className="mr-2" />
          <h3 className="font-medium">Errore nel caricamento</h3>
        </div>
        <p className="text-red-700 mb-4">Impossibile caricare i quiz. Riprova più tardi.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
          Riprova
        </button>
      </div>
    );
  }

  if (!selectedQuiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Scegli un Quiz</h1>
          <p className="text-gray-600 mb-8">Scegli tra i quiz disponibili per testare le tue conoscenze</p>

          {quizzes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <FiList className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Nessun quiz disponibile</h3>
              <p className="text-gray-500 mb-4">Al momento non ci sono quiz disponibili. Riprova più tardi.</p>
              <button onClick={() => refetch()} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                Ricarica
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <FiList className="mr-2 flex-shrink-0" />
                      <span>{quiz.questions?.length || 0} domande</span>
                    </div>
                    <button
                      onClick={() => startQuiz(quiz)}
                      disabled={!quiz.questions || quiz.questions.length === 0}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
                        !quiz.questions || quiz.questions.length === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                      }`}
                      title={!quiz.questions || quiz.questions.length === 0 ? "Quiz non disponibile" : ""}>
                      <span>Inizia</span>
                      <FiChevronRight />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center">
                  <FiList className="mr-1" />
                  <span>{selectedQuiz.questions.length} domande</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{timeSpent}s</span>
                </div>
              </div>
            </div>
            <button onClick={resetQuiz} className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30">
              Esci
            </button>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8">
              <div className="font-semibold text-lg mb-3 text-gray-800">
                <span className="text-blue-600">Domanda {currentQuestionIndex + 1}:</span> {currentQuestion.question}
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    onClick={() => handleAnswer(currentQuestionIndex, oIdx)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      answers[currentQuestionIndex] === oIdx ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}>
                    {opt}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg ${
                currentQuestionIndex === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Precedente
            </button>

            {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Successiva
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                disabled={answers.every((a) => a === -1)}
                className={`px-6 py-2 rounded-lg text-white ${
                  answers.every((a) => a === -1) ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                }`}>
                Completa Quiz
              </button>
            )}
          </div>

          {/* Question Indicators */}
          <div className="flex flex-wrap gap-2 mt-6">
            {selectedQuiz.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  answers[idx] !== -1 ? "bg-blue-500 text-white" : idx === currentQuestionIndex ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                }`}>
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {score !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <FiAward className="text-3xl text-yellow-500 mr-2" />
              <h3 className="text-2xl font-bold text-gray-800">Quiz Completato!</h3>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">
                <span className="text-blue-600">{score}</span>
                <span className="text-gray-500">/{selectedQuiz.questions.length}</span>
              </div>
              <div className="text-gray-600">
                {score === selectedQuiz.questions.length
                  ? "Perfetto! 🎉 Hai risposto correttamente a tutte le domande!"
                  : score >= selectedQuiz.questions.length * 0.7
                  ? "Ottimo lavoro! 👍 Puoi ancora migliorare!"
                  : score >= selectedQuiz.questions.length * 0.4
                  ? "Buon inizio! ✨ Continua a esercitarti!"
                  : "Non preoccuparti! 💪 Continua a studiare e riprova!"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-500 text-sm">Tempo impiegato</div>
                <div className="font-semibold">
                  {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-500 text-sm">Percentuale</div>
                <div className="font-semibold">{Math.round((score / selectedQuiz.questions.length) * 100)}%</div>
              </div>
            </div>

            <button onClick={resetQuiz} className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Torna alla lista dei quiz
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
