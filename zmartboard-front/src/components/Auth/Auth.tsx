import React, { useState, useEffect } from 'react';
import { useAuth, useInitializeAuth } from '../../store/auth/authHooks';
import AuthForm from './AuthForm';
import UserProfile from './UserProfile';

const Auth: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { initializeAuth } = useInitializeAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Initialize authentication on component mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  // Show loading state while checking authentication
  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {isAuthenticated && user ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="mt-2 text-gray-600">
                You are successfully authenticated
              </p>
            </div>
            <UserProfile />
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Authentication Demo
              </h1>
              <p className="mt-2 text-gray-600">
                Please {authMode} to continue
              </p>
            </div>
            <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;