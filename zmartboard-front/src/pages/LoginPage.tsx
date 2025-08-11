import React, { useState } from 'react';
import { useAuth } from '../store/auth/authHooks';
import AuthForm from '../components/Auth/AuthForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Logged In</h2>
          <p className="text-gray-600 mb-6">You are already authenticated.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900">Sign In to ZmartBoard</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Welcome Message */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account to continue
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <AuthForm 
              mode={authMode} 
              onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
            />
          </div>

          {/* Additional Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                {authMode === 'login' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
            <p className="text-sm text-gray-600">
              <button className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Forgot your password?
              </button>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Why ZmartBoard?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Secure authentication with JWT tokens
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Role-based access control
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Modern Redux state management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Responsive design with Tailwind CSS
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;