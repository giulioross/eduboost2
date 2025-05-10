import React from "react";
import { Routes, Route } from "react-router-dom";

import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import StudyRoutinePage from "./pages/StudyRoutinePage";
import MentalMapsPage from "./pages/MentalMapsPage"; // Ensure the file exists at this path or adjust the path accordingly
import QuizPage from "./pages/QuizPage";
import FocusModePage from "./pages/FocusModePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/routines" element={<StudyRoutinePage />} />
          <Route path="/mental-maps" element={<MentalMapsPage />} />
          <Route path="/quizzes" element={<QuizPage />} />
          <Route path="/focus" element={<FocusModePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
