import React, { useState } from 'react';
import type { CreateInvitationDto, ProjectRole } from '../../types/projects.types';
import { useUserSearch } from '../../hooks/useUserSearch';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invitationData: CreateInvitationDto) => void;
  isLoading?: boolean;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateInvitationDto>({
    email: '',
    role: 'DEVELOPER' as ProjectRole,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ email: string; username: string } | null>(null);
  const { searchResults, isSearching, searchError, search, clearResults } = useUserSearch(300);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToSend = selectedUser?.email || formData.email;
    if (!emailToSend.trim()) return;
    
    onSubmit({ email: emailToSend, role: formData.role });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setFormData({ email: '', role: 'DEVELOPER' as ProjectRole });
    setSearchQuery('');
    setSelectedUser(null);
    clearResults();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedUser(null);
    setFormData({ ...formData, email: value });
    search(value);
  };

  const handleUserSelect = (user: { email: string; username: string }) => {
    setSelectedUser(user);
    setSearchQuery(user.username);
    setFormData({ ...formData, email: user.email });
    clearResults();
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Invitar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Usuario *
            </label>
            <div className="relative">
              <input
                type="text"
                id="userSearch"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                placeholder="Buscar por nombre de usuario o email..."
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <svg className="animate-spin h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults && searchQuery && !selectedUser && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {searchResults.user ? (
                  <button
                    type="button"
                    onClick={() => handleUserSelect({
                      email: searchResults.user!.email,
                      username: searchResults.user!.username
                    })}
                    className="w-full px-4 py-2 text-left hover:bg-orange-50 focus:bg-orange-50 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900">{searchResults.user.username}</div>
                    <div className="text-sm text-gray-600">{searchResults.user.email}</div>
                  </button>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    {searchResults.message || 'Usuario no encontrado'}
                  </div>
                )}
              </div>
            )}
            
            {/* Search Error */}
            {searchError && (
              <div className="mt-1 text-sm text-red-600">
                {searchError}
              </div>
            )}
            
            {/* Selected User */}
            {selectedUser && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{selectedUser.username}</div>
                    <div className="text-sm text-gray-600">{selectedUser.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchQuery('');
                      setFormData({ ...formData, email: '' });
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Rol del Proyecto
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as ProjectRole })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="DEVELOPER">Desarrollador - Puede editar tareas</option>
              <option value="ADMIN">Administrador - Control total</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || (!selectedUser && !formData.email.trim())}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar Invitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;