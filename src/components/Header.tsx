import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Lock className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold tracking-tight">SecretShare</span>
          </Link>
          
          <nav>
            <ul className="flex space-x-4 items-center">
              {state.user ? (
                <>
                  <li className="hidden md:block">
                    <div className="flex items-center text-sm">
                      <User size={16} className="mr-1" />
                      <span>{state.user.email}</span>
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded transition-colors duration-300"
                    >
                      <LogOut size={16} className="mr-1" />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login"
                      className="text-white hover:text-blue-200 transition-colors duration-300"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/signup"
                      className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-2 rounded transition-colors duration-300"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;