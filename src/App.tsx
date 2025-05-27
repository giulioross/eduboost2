import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import RoutinePage from "./pages/RoutinePage";
import MindMap from "./pages/MindMap";
import QuizPage from "./pages/QuizPage";
import FocusModePage from "./pages/FocusModePage";
import ProfilePage from "./pages/ProfilePage";
import QuizAdminPage from "./pages/QuizAdminPage";
import FocusHistory from "./pages/FocusHistory";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const isLoginOrRegisterPage = location.pathname === "/login" || location.pathname === "/register";

  // Aggiorna il token quando cambia in localStorage (login/logout anche da altre tab)
  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  // Aggiorna il token dopo login/logout nella stessa tab
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      setToken((prev) => (prev !== currentToken ? currentToken : prev));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isLoginOrRegisterPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={token ? <DashboardPage /> : <Navigate to="/login" replace />} />
          <Route path="/home" element={token ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" replace />} />
          <Route path="/routines" element={token ? <RoutinePage /> : <Navigate to="/login" replace />} />
          <Route path="/mental-maps" element={token ? <MindMap /> : <Navigate to="/login" replace />} />
          <Route path="/quizzes" element={token ? <QuizPage /> : <Navigate to="/login" replace />} />
          <Route path="/quiz-admin" element={token ? <QuizAdminPage /> : <Navigate to="/login" replace />} />
          <Route path="/focus" element={token ? <FocusModePage /> : <Navigate to="/login" replace />} />
          <Route path="/focus-history" element={token ? <FocusHistory /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
      {!isLoginOrRegisterPage && <Footer />}
    </div>
  );
}

export default App;
