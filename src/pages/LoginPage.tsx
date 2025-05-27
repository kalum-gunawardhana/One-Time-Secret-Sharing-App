import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { state } = useAuth();
  
  // Redirect if user is already logged in
  if (state.user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Sign in to your account to create and manage secrets
            </p>
          </div>
          
          <AuthForm isLogin={true} />
          
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;