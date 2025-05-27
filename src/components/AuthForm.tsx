import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateAuthForm } from '../utils/validation';
import { FormErrors } from '../types';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { state, login, signup, clearError } = useAuth();

  // Clear errors when switching between login and signup
  useEffect(() => {
    clearError();
    setErrors({});
  }, [isLogin, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateAuthForm(
      email,
      password,
      !isLogin ? confirmPassword : undefined
    );
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear form errors
    setErrors({});
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form 
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4" 
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        
        {state.error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {state.error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </div>
            <input
              className={`appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              className={`appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
          )}
        </div>
        
        {!isLogin && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                className={`appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
            type="submit"
            disabled={state.loading}
          >
            {state.loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                {isLogin ? (
                  <>
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="mr-2" />
                    Create Account
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;