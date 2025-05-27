import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Lock, AlertTriangle, Eye, Trash2 } from 'lucide-react';

const ViewSecretForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [secretExists, setSecretExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secretContent, setSecretContent] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check if the secret exists
  useEffect(() => {
    const checkSecret = async () => {
      try {
        await api.get(`/api/secret/${token}`);
        setSecretExists(true);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setSecretExists(false);
        } else {
          setError('An error occurred while checking the secret.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      checkSecret();
    } else {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    setVerifying(true);
    setError(null);
    
    try {
      const response = await api.post(`/api/secret/${token}/view`, { password });
      setSecretContent(response.data.secret);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to view secret';
      setError(message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex justify-center">
          <div className="animate-pulse text-gray-600">Checking secret...</div>
        </div>
      </div>
    );
  }

  if (secretExists === false) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle size={48} className="text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Secret Not Found</h2>
            <p className="text-gray-600 mb-6">
              This secret may have already been viewed or it never existed.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (secretContent) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-col items-center justify-center text-center mb-4">
            <Eye size={48} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Secret Revealed</h2>
            <p className="text-gray-600 mb-6">
              This secret has been revealed and is now permanently deleted.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
            <h3 className="font-bold text-gray-700 mb-2">Secret Message:</h3>
            <div className="whitespace-pre-wrap text-gray-800">{secretContent}</div>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  This secret has been permanently deleted and cannot be viewed again.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form 
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4" 
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">View Secret</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Lock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This secret is protected with a password. Enter the password that was shared with you to view it.
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              className="appearance-none border border-gray-300 rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter the secret password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18} /> : <Lock size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={verifying}
          >
            {verifying ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              "View Secret"
            )}
          </button>
          
          <div className="text-center">
            <span className="text-gray-500 text-sm">
              <Trash2 size={14} className="inline mr-1" />
              This secret will be permanently deleted after viewing
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewSecretForm;