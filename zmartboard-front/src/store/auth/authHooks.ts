import { useAppDispatch, useAppSelector } from '../hooks';
import { UserRole } from '../../types/auth.types';
import {
  loginUser,
  registerUser,
  getUserProfile,
  refreshToken,
  logoutUser,
  clearError,
  setUser,
  clearAuth,
} from './authSlice';
import type { LoginDto, RegisterDto, User } from '../../types/auth.types';

// Basic auth state selectors
export const useAuthState = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);
export const useAuthLoading = () => useAppSelector((state) => state.auth.isLoading);
export const useAuthError = () => useAppSelector((state) => state.auth.error);

// Role-based selectors
export const useUserRole = () => {
  const user = useUser();
  return user?.role || null;
};

export const useHasRole = (role: UserRole) => {
  const userRole = useUserRole();
  return userRole === role;
};

export const useHasAnyRole = (roles: (keyof typeof UserRole)[]) => {
  const userRole = useUserRole();
  if (!userRole) return false;
  return roles.some(role => UserRole[role] === userRole);
};

// Specific role checks
export const useIsAdmin = () => useHasRole(UserRole.ADMIN);
export const useIsModerator = () => {
  const userRole = useUserRole();
  if (!userRole) return false;
  return userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;
};
export const useIsSuperAdmin = () => useHasRole(UserRole.SUPER_ADMIN);

// Main auth hook with actions
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAuthState();

  const login = async (credentials: LoginDto) => {
    return dispatch(loginUser(credentials));
  };

  const register = async (userData: RegisterDto) => {
    return dispatch(registerUser(userData));
  };

  const getProfile = async () => {
    return dispatch(getUserProfile());
  };

  const refresh = async () => {
    return dispatch(refreshToken());
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const updateUser = (user: User) => {
    dispatch(setUser(user));
  };

  const clearAuthentication = () => {
    dispatch(clearAuth());
  };

  return {
    // State
    ...authState,
    // Actions
    login,
    register,
    getProfile,
    refresh,
    logout,
    clearError: clearAuthError,
    setUser: updateUser,
    clearAuth: clearAuthentication,
  };
};

// Hook for initializing auth state (e.g., checking for existing session)
export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAuthState();

  const initializeAuth = async () => {
    // Don't initialize if already authenticated or currently loading
    if (isAuthenticated || isLoading) {
      return;
    }

    try {
      const result = await dispatch(getUserProfile());
      if (getUserProfile.rejected.match(result)) {
        // User is not authenticated or session expired
        dispatch(clearAuth());
      }
    } catch (error) {
      // User is not authenticated or session expired
      dispatch(clearAuth());
    }
  };

  return { initializeAuth };
};