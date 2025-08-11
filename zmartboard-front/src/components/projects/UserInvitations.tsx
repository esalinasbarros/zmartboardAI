import React from 'react';
import type { Invitation, InvitationResponseDto } from '../../types/projects.types';

interface UserInvitationsProps {
  invitations: Invitation[];
  onRespondToInvitation: (invitationId: string, response: InvitationResponseDto) => void;
  isLoading?: boolean;
}

const UserInvitations: React.FC<UserInvitationsProps> = ({
  invitations,
  onRespondToInvitation,
  isLoading = false,
}) => {
  const formatDate = (date: Date) => {
    return date instanceof Date ? date.toLocaleDateString() : new Date(date).toLocaleDateString();
  };

  const handleAccept = (invitationId: string) => {
    onRespondToInvitation(invitationId, { response: 'accept' });
  };

  const handleReject = (invitationId: string) => {
    onRespondToInvitation(invitationId, { response: 'reject' });
  };

  const pendingInvitations = (invitations || []).filter(inv => inv.status === 'PENDING');

  if (pendingInvitations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm">No tienes invitaciones pendientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingInvitations.map((invitation) => (
        <div key={invitation.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invitación a "{invitation.projectTitle}"
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">{invitation.sender.username}</span> te ha invitado a unirte a este proyecto.
                </p>
                <p>
                  Rol asignado: <span className="font-medium text-orange-600">{invitation.role}</span>
                </p>
                <p>
                  Enviada: {formatDate(invitation.createdAt)}
                </p>
                <p>
                  Expira: {formatDate(invitation.expiresAt)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleAccept(invitation.id)}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : 'Aceptar'}
            </button>
            <button
              onClick={() => handleReject(invitation.id)}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : 'Rechazar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserInvitations;