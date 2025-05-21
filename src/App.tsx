import React from "react";
import { Routes, Route } from "react-router-dom";

import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import RoutinePage from "./pages/RoutinePage";
import MindMap from "./pages/MindMap"; // Ensure the file exists at this path or adjust the path accordingly
import QuizPage from "./pages/QuizPage";
import FocusModePage from "./pages/FocusModePage";
import ProfilePage from "./pages/ProfilePage";
import QuizAdminPage from "./pages/QuizAdminPage";
import FocusHistory from "./pages/FocusHistory";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Define your routes here */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/routines" element={<RoutinePage />} />
          <Route path="/mental-maps" element={<MindMap />} />
          <Route path="/quizzes" element={<QuizPage />} />
          <Route path="/quiz-admin" element={<QuizAdminPage />} />
          <Route path="/focus" element={<FocusModePage />} />
          <Route path="/focus-history" element={<FocusHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
