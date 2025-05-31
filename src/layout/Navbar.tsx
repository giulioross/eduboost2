import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Brain, Calendar, ChevronDown, ClipboardList, Home, Menu, X, User, Zap } from "lucide-react";

const Navbar: React.FC = () => {
  const user = { role: "ADMIN" }; // Replace with actual user context or state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quizDropdown, setQuizDropdown] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/home", icon: <Home size={20} /> },
    { name: "Dashboard", path: "/dashboard", icon: <ClipboardList size={20} /> },
    { name: "Study Routines", path: "/routines", icon: <Calendar size={20} /> },
    { name: "Mental Maps", path: "/mental-maps", icon: <Brain size={20} /> },
    // QUIZ DROPDOWN SPOSTATO SOTTO
    { name: "Focus Mode", path: "/focus", icon: <Zap size={20} /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm py-3 sticky top-0 z-10">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo e titolo: link alla dashboard */}
          <Link to="/home" className="flex items-center space-x-2 group">
            <span className="text-primary-600 group-hover:scale-110 transition-transform">
              <Brain size={32} />
            </span>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">EduBoost</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path ? "text-primary-600 border-b-2 border-primary-600 pb-1" : "text-gray-600 hover:text-primary-600"
                }`}>
                <span className="inline-block">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* QUIZ DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setQuizDropdown((open) => !open)}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  ["/quizzes", "/quiz-admin"].includes(location.pathname)
                    ? "text-primary-600 border-b-2 border-primary-600 pb-1"
                    : "text-gray-600 hover:text-primary-600"
                }`}>
                <BookOpen size={20} />
                <span>Quiz</span>
                <ChevronDown size={16} />
              </button>
              {quizDropdown && (
                <div className="absolute left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                  <Link to="/quizzes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setQuizDropdown(false)}>
                    Quiz
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link to="/quiz-admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setQuizDropdown(false)}>
                      Gestione Quiz
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200">
                <User size={20} className="mr-1" />
                <span>Account</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profilo
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-2 animate-fade-in">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg ${
                  location.pathname === item.path ? "bg-primary-50 text-primary-600" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}>
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            {/* Quiz Dropdown Mobile */}
            <div className="px-4 py-2">
              <div className="font-semibold text-gray-700 mb-1">Quiz</div>
              <Link to="/quizzes" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded" onClick={() => setIsMenuOpen(false)}>
                Quiz
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  to="/quiz-admin"
                  className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  onClick={() => setIsMenuOpen(false)}>
                  Gestione Quiz
                </Link>
              )}
            </div>
            <div className="border-t border-gray-100 mt-2 pt-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}>
                <User size={20} />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
