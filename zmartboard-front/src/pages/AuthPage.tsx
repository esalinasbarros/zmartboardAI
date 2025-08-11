import React from 'react';
import { useAuth } from '../store/auth/authHooks';
import Auth from '../components/Auth/Auth';

const AuthPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.username}!</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Logged in as</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Authentication Successful
                </h2>
                <p className="text-gray-600 mb-8">
                  You have successfully authenticated with the system. Your session is active and secure.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* User Info */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">User Information</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Username:</strong> {user.username}</p>
                      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Account Status</h3>
                    <div className="space-y-2 text-sm text-green-800">
                      <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
                      <p><strong>Role:</strong> {user.role}</p>
                      <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Session Info</h3>
                    <div className="space-y-2 text-sm text-purple-800">
                      <p><strong>Authenticated:</strong> Yes</p>
                      <p><strong>Login Time:</strong> {new Date().toLocaleTimeString()}</p>
                      <p><strong>Security:</strong> JWT Token</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors">
                    Go to Dashboard
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-900">Authentication</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Auth />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure Authentication System</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our authentication system provides secure access control with role-based permissions, 
              JWT token management, and modern Redux state management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Login</h3>
              <p className="text-gray-600 text-sm">JWT-based authentication with HTTP-only cookies for maximum security.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Management</h3>
              <p className="text-gray-600 text-sm">Comprehensive role-based access control with User, Moderator, Admin, and Super Admin roles.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">State Management</h3>
              <p className="text-gray-600 text-sm">Modern Redux Toolkit implementation with TypeScript for predictable state updates.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast & Responsive</h3>
              <p className="text-gray-600 text-sm">Built with React, TypeScript, and Tailwind CSS for optimal performance and user experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;