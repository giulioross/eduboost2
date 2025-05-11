import React, { useState } from "react";
import { BookOpen, CheckCircle2, Clock, Filter, BarChart3, Brain, Award, ArrowRight, Plus, Search, Tag, Timer } from "lucide-react";

const QuizPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"disponibili" | "completati">("disponibili");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);

  // Dati simulati
  const subjects = ["Matematica", "Fisica", "Chimica", "Biologia", "Storia", "Letteratura", "Informatica", "Lingue"];

  const difficulties = ["Facile", "Medio", "Difficile", "Esperto"];

  const availableQuizzes = [
    {
      id: 1,
      title: "Fondamenti di Calcolo",
      subject: "Matematica",
      difficulty: "Medio",
      questions: 25,
      timeLimit: 45,
      description: "Metti alla prova la tua comprensione dei concetti base del calcolo, inclusi limiti, derivate e integrali.",
      topics: ["Limiti", "Derivate", "Integrali", "Applicazioni"],
    },
    {
      id: 2,
      title: "Meccanica Classica",
      subject: "Fisica",
      difficulty: "Difficile",
      questions: 30,
      timeLimit: 60,
      description: "Quiz completo sulle leggi di Newton, conservazione dell'energia e sistemi meccanici.",
      topics: ["Leggi di Newton", "Energia", "Quantità di moto", "Moto Rotazionale"],
    },
    {
      id: 3,
      title: "Basi di Chimica Organica",
      subject: "Chimica",
      difficulty: "Medio",
      questions: 20,
      timeLimit: 40,
      description: "Metti alla prova le tue conoscenze sui composti organici, reazioni e nomenclatura.",
      topics: ["Nomenclatura", "Reazioni", "Meccanismi", "Gruppi Funzionali"],
    },
  ];

  const completedQuizzes = [
    {
      id: 101,
      title: "Fondamenti di Algebra Lineare",
      subject: "Matematica",
      score: 85,
      completedAt: "2024-03-15T14:30:00",
      timeSpent: 38,
      correctAnswers: 21,
      totalQuestions: 25,
    },
    {
      id: 102,
      title: "Introduzione alla Meccanica Quantistica",
      subject: "Fisica",
      score: 92,
      completedAt: "2024-03-14T10:15:00",
      timeSpent: 55,
      correctAnswers: 27,
      totalQuestions: 30,
    },
    {
      id: 103,
      title: "Panoramica di Biologia Cellulare",
      subject: "Biologia",
      score: 78,
      completedAt: "2024-03-13T16:45:00",
      timeSpent: 42,
      correctAnswers: 18,
      totalQuestions: 25,
    },
  ];

  // Funzione per alternare il filtro per materia
  const toggleSubjectFilter = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Funzione per alternare il filtro per difficoltà
  const toggleDifficultyFilter = (difficulty: string) => {
    if (selectedDifficulty.includes(difficulty)) {
      setSelectedDifficulty(selectedDifficulty.filter((d) => d !== difficulty));
    } else {
      setSelectedDifficulty([...selectedDifficulty, difficulty]);
    }
  };

  // Filtra i quiz disponibili in base ai filtri selezionati
  const filteredAvailableQuizzes = availableQuizzes.filter((quiz) => {
    const subjectMatch = selectedSubjects.length === 0 || selectedSubjects.includes(quiz.subject);
    const difficultyMatch = selectedDifficulty.length === 0 || selectedDifficulty.includes(quiz.difficulty);
    return subjectMatch && difficultyMatch;
  });

  return <div className="container-custom py-8">{/* Contenuto tradotto */}</div>;
};

export default QuizPage;
