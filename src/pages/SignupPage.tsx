import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const SignupPage: React.FC = () => {
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
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-gray-600 mt-2">
              Join SecretShare to start sharing sensitive information securely
            </p>
          </div>
          
          <AuthForm isLogin={false} />
          
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;