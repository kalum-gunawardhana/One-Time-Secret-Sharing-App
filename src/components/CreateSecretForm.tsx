import React, { useState } from 'react';
import { api } from '../utils/api';
import { validateSecretForm } from '../utils/validation';
import { FormErrors } from '../types';
import { Lock, FileText, Copy, CheckCircle } from 'lucide-react';

const CreateSecretForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [secretUrl, setSecretUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateSecretForm(message, password);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear form errors
    setErrors({});
    setLoading(true);
    
    try {
      const response = await api.post('/api/secret', { message, password });
      const baseUrl = window.location.origin;
      setSecretUrl(`${baseUrl}${response.data.secretUrl}`);
      // Clear form after successful creation
      setMessage('');
      setPassword('');
    } catch (error) {
      console.error('Create secret error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (secretUrl) {
      navigator.clipboard.writeText(secretUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateNew = () => {
    setSecretUrl(null);
    setMessage('');
    setPassword('');
    setErrors({});
  };

  return (
    <div className="w-full max-w-md">
      {secretUrl ? (
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-center mb-6">Secret Created!</h2>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Share this link with the recipient:</p>
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded-l-md bg-gray-50"
                value={secretUrl}
                readOnly
              />
              <button
                onClick={handleCopyLink}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-r-md border border-l-0 border-gray-300"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle className="text-green-600\" size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Remember to share the password separately through a different channel for maximum security.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Create Another Secret
          </button>
        </div>
      ) : (
        <form 
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4" 
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Create a Secret</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Secret Message
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FileText size={18} />
              </div>
              <textarea
                className={`appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                id="message"
                rows={5}
                placeholder="Enter your secret message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            {errors.message && (
              <p className="text-red-500 text-xs italic mt-1">{errors.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password Protection
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                className={`appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.secretPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                id="secretPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password for this secret"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <CheckCircle size={18} /> : <Lock size={18} />}
              </button>
            </div>
            {errors.secretPassword && (
              <p className="text-red-500 text-xs italic mt-1">{errors.secretPassword}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              The recipient will need this password to view the secret.
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Creating Secret...</span>
              ) : (
                "Create Secret"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateSecretForm;