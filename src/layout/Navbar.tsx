import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Brain, Calendar, ChevronDown, ClipboardList, Home, Menu, X, User, Zap } from "lucide-react";

const Navbar: React.FC = () => {
  const user = { role: "ADMIN" }; // Replace this with actual user context or state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/home", icon: <Home size={20} /> },
    { name: "Dashboard", path: "/dashboard", icon: <ClipboardList size={20} /> },
    { name: "Study Routines", path: "/routines", icon: <Calendar size={20} /> },
    { name: "Mental Maps", path: "/mental-maps", icon: <Brain size={20} /> },
    { name: "Quizzes", path: "/quizzes", icon: <BookOpen size={20} /> },
    { name: "Focus Mode", path: "/focus", icon: <Zap size={20} /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm py-3 sticky top-0 z-10">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-primary-600">
              <Brain size={32} />
            </span>
            <span className="text-xl font-bold text-gray-900">EduBoost</span>
          </div>

          {/* Desktop Navigation */}
          {/* Replace with actual user role check */}
          {user?.role === "ADMIN" && (
            <Link to="/quiz-admin" className="text-sm text-gray-600 hover:text-primary-600">
              Gestione Quiz
            </Link>
          )}

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
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Impostazioni
                </Link>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
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
            <div className="border-t border-gray-100 mt-2 pt-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}>
                <User size={20} />
                <span>Profile</span>
              </Link>
              <button className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-50 rounded-lg w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm9 2.414L15.414 9H12V5.414zM3 7h5v2H3V7zm0 4h5v2H3v-2zm10 0h-2v2h2v-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
