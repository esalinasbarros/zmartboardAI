import React, { useState, useEffect, useRef } from 'react';
import { useProjectActions, useUserInvitations, useFetchUserProjects } from '../store/projects/projectsHooks';
import { UserInvitations } from './projects';
import { useToastNotifications } from '../hooks/useToastNotifications';
import type { InvitationResponseDto } from '../types/projects.types';

const NavbarInvitations: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { getUserInvitations, respondToInvitation } = useProjectActions();
  const {fetchProjects} = useFetchUserProjects();
  const userInvitations = useUserInvitations();
  const toast = useToastNotifications();
  const pendingInvitations = userInvitations?.filter(inv => inv.status === 'PENDING') || [];

  useEffect(() => {
    getUserInvitations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRespondToInvitation = async (invitationId: string, response: InvitationResponseDto) => {
    setResponseLoading(true);
    try {
      await respondToInvitation(invitationId, response);
      // getUserInvitations(); // Refresh invitations
      
      if (response.response === 'accept') {
        fetchProjects();
        toast.invitation.acceptSuccess();
      } else {
        toast.invitation.rejectSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      
      if (response.response === 'accept') {
        toast.invitation.acceptError(errorMessage);
      } else {
        toast.invitation.rejectError(errorMessage);
      }
    } finally {
      setResponseLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Envelope Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.95a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        
        {/* Notification Badge */}
        {pendingInvitations?.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {pendingInvitations.length > 9 ? '9+' : pendingInvitations.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Invitaciones de Proyectos
            </h3>
            {pendingInvitations?.length > 0 && (
              <p className="text-sm text-gray-600">
                Tienes {pendingInvitations.length} invitación{pendingInvitations.length !== 1 ? 'es' : ''} pendiente{pendingInvitations.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <UserInvitations
              invitations={userInvitations || []}
              onRespondToInvitation={handleRespondToInvitation}
              isLoading={responseLoading}
            />
          </div>
          
          {pendingInvitations.length === 0 && (
            <div className="p-4">
              <p className="text-sm text-gray-500 text-center">
                No tienes invitaciones pendientes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarInvitations;