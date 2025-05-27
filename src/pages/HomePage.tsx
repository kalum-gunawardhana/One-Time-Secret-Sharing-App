import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Lock, Shield, RefreshCw, Key, ChevronRight, UserPlus } from 'lucide-react';
import CreateSecretForm from '../components/CreateSecretForm';

const HomePage: React.FC = () => {
  const { state } = useAuth();
  const isLoggedIn = !!state.user;

  return (
    <div>
      {isLoggedIn ? (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Create a Secure Secret</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share sensitive information securely with password protection and one-time viewing.
            </p>
          </div>
          
          <div className="flex justify-center">
            <CreateSecretForm />
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    Share Secrets Securely, One Time Only
                  </h1>
                  <p className="text-xl mb-8 opacity-90">
                    Password-protected messages that self-destruct after viewing.
                    The secure way to share sensitive information.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link 
                      to="/signup" 
                      className="bg-white text-blue-600 hover:bg-blue-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                      <UserPlus size={18} className="mr-2" />
                      Get Started
                    </Link>
                    <Link 
                      to="/login" 
                      className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg border border-blue-500 transition-colors duration-300 flex items-center justify-center"
                    >
                      <Lock size={18} className="mr-2" />
                      Login
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-white/20">
                    <div className="flex items-center mb-4">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="bg-white/10 rounded p-4 mb-4">
                      <p className="text-sm font-mono">
                        🔒 This is a secure message that will self-destruct after viewing.
                      </p>
                    </div>
                    <div className="bg-blue-600/30 p-4 rounded flex items-center">
                      <Lock size={18} className="mr-2" />
                      <span className="text-sm">Password protected • One-time access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-transform duration-300 hover:transform hover:-translate-y-2">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Lock size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">Create</h3>
                  <p className="text-gray-600 text-center">
                    Write your message and protect it with a password of your choice.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-transform duration-300 hover:transform hover:-translate-y-2">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Key size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">Share</h3>
                  <p className="text-gray-600 text-center">
                    Send the generated link and share the password through a different channel.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-transform duration-300 hover:transform hover:-translate-y-2">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <RefreshCw size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center">Self-Destruct</h3>
                  <p className="text-gray-600 text-center">
                    After viewing, the message is permanently deleted from our servers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h2 className="text-3xl font-bold mb-6">Bank-Level Security</h2>
                  <p className="text-gray-600 mb-6">
                    Your secrets are secured with industry-standard encryption and best practices:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-blue-100 rounded-full text-blue-600 mt-1">
                        <Shield size={18} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold">End-to-End Encryption</h3>
                        <p className="text-gray-600 text-sm">All data is encrypted in transit and at rest.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-blue-100 rounded-full text-blue-600 mt-1">
                        <Lock size={18} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold">Zero Knowledge</h3>
                        <p className="text-gray-600 text-sm">Passwords are securely hashed, never stored in plaintext.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1 bg-blue-100 rounded-full text-blue-600 mt-1">
                        <RefreshCw size={18} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold">Automatic Deletion</h3>
                        <p className="text-gray-600 text-sm">Messages are permanently deleted after viewing.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-md w-full">
                    <div className="text-center mb-6">
                      <div className="inline-flex p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                        <Shield size={32} />
                      </div>
                      <h3 className="text-xl font-bold">Ready to get started?</h3>
                      <p className="text-gray-600 mt-2">
                        Create an account to start sharing secrets securely.
                      </p>
                    </div>
                    <Link 
                      to="/signup" 
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                    >
                      Sign Up Free
                      <ChevronRight size={16} className="inline ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;