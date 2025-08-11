import React, { useState } from 'react';
import { useAuth } from '../../store/auth/authHooks';
import type { LoginDto, RegisterDto } from '../../types/auth.types';
import { useToastNotifications } from '../../hooks/useToastNotifications';

interface AuthFormProps {
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const { login, register, isLoading, clearError } = useAuth();
  const toastNotifications = useToastNotifications();
  
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // let loadingToastId: string | undefined;
    
    try {
      if (mode === 'login') {
        const loginData: LoginDto = {
          emailOrUsername: formData.emailOrUsername,
          password: formData.password,
        };
        
        const result = await login(loginData);
        
        
        
        if (result.type.endsWith('/fulfilled')) {
          toastNotifications.auth.loginSuccess();
          resetForm();
        } else {
          // Handle rejected case
          const errorMessage = result.payload as string || 'Login failed. Please check your credentials.';
          toastNotifications.auth.loginError(errorMessage);
        }
      } else {
        
        const registerData: RegisterDto = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        };
        
        const result = await register(registerData);
        
        
        if (result.type.endsWith('/fulfilled')) {
          toastNotifications.auth.registerSuccess();
          resetForm();
        } else {
          // Handle rejected case
          const errorMessage = result.payload as string || 'Registration failed. Please try again.';
          toastNotifications.auth.registerError(errorMessage);
        }
      }
    } catch (error) {
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toastNotifications.auth.authError(errorMessage);
      console.error('Auth error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      emailOrUsername: '',
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
    });
    clearError();
  };

  const handleToggleMode = () => {
    resetForm();
    onToggleMode();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? 'Login' : 'Register'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'login' ? (
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength={mode === 'register' ? 6 : undefined}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Register')}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleToggleMode}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          {mode === 'login' 
            ? "Don't have an account? Register" 
            : 'Already have an account? Login'
          }
        </button>
      </div>
    </div>
  );
};

export default AuthForm;