import React from 'react';
import type { Invitation } from '../../types/projects.types';

interface InvitationsListProps {
  invitations: Invitation[];
  onCancelInvitation: (invitationId: string) => void;
  isLoading?: boolean;
}

const InvitationsList: React.FC<InvitationsListProps> = ({
  invitations,
  onCancelInvitation,
  isLoading = false,
}) => {
  const formatDate = (date: Date) => {
    return date instanceof Date ? date.toLocaleDateString() : new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'ACCEPTED':
        return 'Aceptada';
      case 'REJECTED':
        return 'Rechazada';
      case 'EXPIRED':
        return 'Expirada';
      default:
        return status;
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p className="text-sm">No hay invitaciones pendientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div key={invitation.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {invitation.receiver.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {invitation.receiver.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {invitation.receiver.email}
                  </p>
                </div>
              </div>
              
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>Rol: <span className="font-medium">{invitation.role}</span></span>
                <span>Enviada: {formatDate(invitation.createdAt)}</span>
                <span>Expira: {formatDate(invitation.expiresAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invitation.status)}`}>
                {getStatusText(invitation.status)}
              </span>
              
              {invitation.status === 'PENDING' && (
                <button
                  onClick={() => onCancelInvitation(invitation.id)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1"
                  title="Cancelar invitación"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvitationsList;