import React from 'react';
import { Lock, Shield, Key } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 mr-2" />
              <span className="text-xl font-bold">SecretShare</span>
            </div>
            <p className="text-gray-400 max-w-md">
              A secure way to share sensitive information with end-to-end encryption and one-time viewing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Security Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Shield size={16} className="mr-2 text-blue-400" />
                  <span className="text-gray-300">End-to-End Encryption</span>
                </li>
                <li className="flex items-center">
                  <Key size={16} className="mr-2 text-blue-400" />
                  <span className="text-gray-300">Password Protection</span>
                </li>
                <li className="flex items-center">
                  <Lock size={16} className="mr-2 text-blue-400" />
                  <span className="text-gray-300">One-Time Access</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} SecretShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;