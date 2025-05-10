import React, { useState } from "react";
import { BookOpen, CheckCircle2, Clock, Filter, BarChart3, Brain, Award, ArrowRight, Plus, Search, Tag, Timer } from "lucide-react";

const QuizPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"available" | "completed">("available");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);

  // Mock data
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Computer Science", "Languages"];

  const difficulties = ["Easy", "Medium", "Hard", "Expert"];

  const availableQuizzes = [
    {
      id: 1,
      title: "Calculus Fundamentals",
      subject: "Mathematics",
      difficulty: "Medium",
      questions: 25,
      timeLimit: 45,
      description: "Test your understanding of basic calculus concepts including limits, derivatives, and integrals.",
      topics: ["Limits", "Derivatives", "Integrals", "Applications"],
    },
    {
      id: 2,
      title: "Classical Mechanics",
      subject: "Physics",
      difficulty: "Hard",
      questions: 30,
      timeLimit: 60,
      description: "Comprehensive quiz covering Newton's laws, energy conservation, and mechanical systems.",
      topics: ["Newton's Laws", "Energy", "Momentum", "Rotational Motion"],
    },
    {
      id: 3,
      title: "Organic Chemistry Basics",
      subject: "Chemistry",
      difficulty: "Medium",
      questions: 20,
      timeLimit: 40,
      description: "Test your knowledge of organic compounds, reactions, and nomenclature.",
      topics: ["Nomenclature", "Reactions", "Mechanisms", "Functional Groups"],
    },
  ];

  const completedQuizzes = [
    {
      id: 101,
      title: "Linear Algebra Fundamentals",
      subject: "Mathematics",
      score: 85,
      completedAt: "2024-03-15T14:30:00",
      timeSpent: 38,
      correctAnswers: 21,
      totalQuestions: 25,
    },
    {
      id: 102,
      title: "Quantum Mechanics Introduction",
      subject: "Physics",
      score: 92,
      completedAt: "2024-03-14T10:15:00",
      timeSpent: 55,
      correctAnswers: 27,
      totalQuestions: 30,
    },
    {
      id: 103,
      title: "Cell Biology Overview",
      subject: "Biology",
      score: 78,
      completedAt: "2024-03-13T16:45:00",
      timeSpent: 42,
      correctAnswers: 18,
      totalQuestions: 25,
    },
  ];

  // Toggle subject filter
  const toggleSubjectFilter = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Toggle difficulty filter
  const toggleDifficultyFilter = (difficulty: string) => {
    if (selectedDifficulty.includes(difficulty)) {
      setSelectedDifficulty(selectedDifficulty.filter((d) => d !== difficulty));
    } else {
      setSelectedDifficulty([...selectedDifficulty, difficulty]);
    }
  };

  // Filter quizzes based on selected filters
  const filteredAvailableQuizzes = availableQuizzes.filter((quiz) => {
    const subjectMatch = selectedSubjects.length === 0 || selectedSubjects.includes(quiz.subject);
    const difficultyMatch = selectedDifficulty.length === 0 || selectedDifficulty.includes(quiz.difficulty);
    return subjectMatch && difficultyMatch;
  });

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Smart Quizzes</h1>
          <p className="text-gray-600 mt-1">Test your knowledge and track your progress</p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="btn btn-outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Filter by Subject</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => toggleSubjectFilter(subject)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedSubjects.includes(subject)
                        ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                    }`}>
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Filter by Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => toggleDifficultyFilter(difficulty)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedDifficulty.includes(difficulty)
                        ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                    }`}>
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Quiz List */}
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === "available" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("available")}>
                Available Quizzes
              </button>
              <button
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === "completed" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("completed")}>
                Completed Quizzes
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quiz Cards */}
            <div className="p-4">
              <div className="space-y-4">
                {activeTab === "available"
                  ? filteredAvailableQuizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{quiz.title}</h3>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className="text-sm bg-primary-50 text-primary-700 px-2 py-0.5 rounded">{quiz.subject}</span>
                              <span
                                className={`text-sm px-2 py-0.5 rounded ${
                                  quiz.difficulty === "Easy"
                                    ? "bg-green-50 text-green-700"
                                    : quiz.difficulty === "Medium"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : quiz.difficulty === "Hard"
                                    ? "bg-orange-50 text-orange-700"
                                    : "bg-red-50 text-red-700"
                                }`}>
                                {quiz.difficulty}
                              </span>
                            </div>
                          </div>
                          <button className="btn btn-primary py-1.5 px-3 text-sm">Start Quiz</button>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {quiz.questions} questions
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {quiz.timeLimit} minutes
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {quiz.topics.map((topic, index) => (
                              <span key={index} className="flex items-center text-xs bg-gray-100 px-2 py-0.5 rounded">
                                <Tag className="h-3 w-3 mr-1" />
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  : completedQuizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{quiz.title}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm bg-primary-50 text-primary-700 px-2 py-0.5 rounded">{quiz.subject}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">{quiz.score}%</div>
                            <div className="text-sm text-gray-500">Score</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500">Time Spent</div>
                            <div className="font-medium">{quiz.timeSpent} min</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500">Correct</div>
                            <div className="font-medium">
                              {quiz.correctAnswers}/{quiz.totalQuestions}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500">Completed</div>
                            <div className="font-medium">{new Date(quiz.completedAt).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-1 inline" />
                          </button>
                          <button className="btn btn-outline py-1.5 px-3 text-sm">Retake Quiz</button>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Your Progress</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">85%</div>
                  <p className="text-sm text-gray-500">Average Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">24</div>
                  <p className="text-sm text-gray-500">Quizzes Completed</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Performance by Subject</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mathematics</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Physics</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Chemistry</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Recent Achievements</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <Brain className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium">Knowledge Master</h3>
                  <p className="text-sm text-gray-500">Completed 20 quizzes</p>
                </div>
              </div>
              <div className="p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Perfect Score</h3>
                  <p className="text-sm text-gray-500">100% on Physics Quiz</p>
                </div>
              </div>
              <div className="p-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <Timer className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium">Speed Demon</h3>
                  <p className="text-sm text-gray-500">Completed quiz in record time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Study Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Quiz Tips</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-1">Read Carefully</h3>
                  <p className="text-sm text-gray-700">Take time to understand each question before answering.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-1">Review Mistakes</h3>
                  <p className="text-sm text-gray-700">Learn from incorrect answers to improve future performance.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-1">Practice Regularly</h3>
                  <p className="text-sm text-gray-700">Consistent practice leads to better retention and understanding.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
