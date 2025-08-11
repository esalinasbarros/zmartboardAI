import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from './store/hooks';
import { useAuthState } from './store/auth/authHooks';
import { getUserProfile, clearAuth } from './store/auth/authSlice';
import Router from './Router';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAuthState();
  const hasInitialized = useRef(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Only initialize once
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // Check for existing authentication on app startup
      dispatch(getUserProfile())
        .then((result: any) => {
          if (getUserProfile.rejected.match(result)) {
            dispatch(clearAuth());
          }
        })
        .finally(() => {
          setIsInitializing(false);
        });
    }
  }, []); // Empty dependency array to run only once

  // Show loading spinner while initializing authentication
  if (isInitializing || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <Router />;
}

export default App;
