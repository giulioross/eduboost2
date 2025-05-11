import React from "react";
import { Brain, Mail, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-primary-600">
                <Brain size={28} />
              </span>
              <span className="text-lg font-bold text-gray-900">EduBoost</span>
            </div>
            <p className="text-sm text-gray-600 mb-6">Aumenta il tuo potenziale di approfondimento con strumenti e tecniche di studio intelligenti</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/routines" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Study Routines
                </Link>
              </li>
              <li>
                <Link to="/mental-maps" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Mappe Mentali
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Quiz Intelligenti
                </Link>
              </li>
              <li>
                <Link to="/focus" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Modalità Focus
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Supporto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Carriere
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} EduBoost. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
