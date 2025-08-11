import React from 'react';
import { useAuth, useIsAdmin, useIsModerator, useIsSuperAdmin } from '../../store/auth/authHooks';
import { UserRole } from '../../types/auth.types';

const UserProfile: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const isModerator = useIsModerator();
  const isSuperAdmin = useIsSuperAdmin();

  if (!user) {
    return null;
  }
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (!result.type.endsWith('/fulfilled')) {
        console.error('Logout error:', result.payload);
      } 
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.MODERATOR:
        return 'bg-yellow-100 text-yellow-800';
      case UserRole.USER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-600">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-600">@{user.username}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
            {user.role.replace('_', ' ')}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <p className="mt-1 text-sm text-gray-500 font-mono">{user.id}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Account Status</label>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Role-based information */}
        {isSuperAdmin && (
          <div className="p-3 bg-purple-50 rounded-md">
            <p className="text-sm text-purple-700">
              🔑 Super Admin: Full system access
            </p>
          </div>
        )}

        {isAdmin && !isSuperAdmin && (
          <div className="p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">
              👑 Admin: Administrative privileges
            </p>
          </div>
        )}

        {isModerator && !isAdmin && (
          <div className="p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-700">
              🛡️ Moderator: Content moderation access
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;