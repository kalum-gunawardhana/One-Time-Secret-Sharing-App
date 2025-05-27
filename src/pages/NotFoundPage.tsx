import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex p-4 bg-amber-100 rounded-full text-amber-600 mb-6">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;