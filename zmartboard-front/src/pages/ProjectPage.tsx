import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth/authHooks';
import { 
  useProjectActions, 
  useCurrentProject, 
  useProjectsLoading, 
  useProjectsError,
  useProjectInvitations
} from '../store/projects/projectsHooks';
import { Layout, InviteUserModal, InvitationsList } from '../components';
import { BoardsList } from '../components/boards';
import { useToastNotifications } from '../hooks/useToastNotifications';
import type { CreateInvitationDto } from '../types/projects.types';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    getProjectById, 
    sendInvitation, 
    getProjectInvitations,
    cancelInvitation 
  } = useProjectActions();
  const currentProject = useCurrentProject();
  const projectInvitations = useProjectInvitations();
  const isLoading = useProjectsLoading();
  const error = useProjectsError();
  const toast = useToastNotifications();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'boards' | 'members' | 'invitations'>('boards');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      getProjectById(id);
    }
  }, [id, isAuthenticated]);

  const isProjectMember = currentProject?.members.find(m => m.user.id === user?.id);
  const isAdmin = isProjectMember?.role === 'ADMIN' || currentProject?.owner?.id === user?.id;

  // Load invitations only if user is admin
  useEffect(() => {
    if (id && isAdmin) {
      getProjectInvitations(id);
    }
  }, [id, isAdmin]);

  const handleSendInvitation = async (invitationData: CreateInvitationDto) => {
    if (!id) return;

    setInviteLoading(true);
    try {
      await sendInvitation(id, invitationData);
      setShowInviteModal(false);
      getProjectInvitations(id); // Refresh invitations
      toast.invitation.sendSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.invitation.sendError(errorMessage);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!id) return;

    try {
      await cancelInvitation(invitationId);
      getProjectInvitations(id); // Refresh invitations
      toast.invitation.cancelSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.invitation.cancelError(errorMessage);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Cargando proyecto...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentProject) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Proyecto no encontrado</h2>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </Layout>
    );
  }


  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-orange-500 hover:text-orange-600 mb-4 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Volver a Proyectos</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{currentProject.title}</h1>
              {currentProject.description && (
                <p className="mt-2 text-gray-600">{currentProject.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('boards')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'boards'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tableros
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'members'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Miembros ({currentProject.members.length})
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('invitations')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'invitations'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Invitaciones ({projectInvitations?.length || 0})
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'boards' && (
            <BoardsList projectId={currentProject.id} isAdmin={isAdmin} />
          )}

          {activeTab === 'members' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Details */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Proyecto</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <p className="mt-1 text-gray-900">{currentProject.title}</p>
                  </div>
                  {currentProject.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descripción</label>
                      <p className="mt-1 text-gray-900">{currentProject.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Creado</label>
                    <p className="mt-1 text-gray-900">
                      {currentProject.createdAt instanceof Date 
                        ? currentProject.createdAt.toLocaleDateString()
                        : new Date(currentProject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Miembros del Proyecto</h2>
                <div className="space-y-3">
                  {currentProject.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {member.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.user.username}</p>
                          <p className="text-xs text-gray-500">{member.user.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.role === 'ADMIN' 
                          ? 'bg-red-100 text-red-800' 
                          : member.role === 'DEVELOPER'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invitations' && isAdmin && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Invitaciones Pendientes</h2>
              <InvitationsList
                invitations={projectInvitations || []}
                onCancelInvitation={handleCancelInvitation}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones de Administrador</h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowInviteModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Invitar Miembro</span>
              </button>
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                Configuración
              </button>
            </div>
          </div>
        )}



        {/* Invite User Modal */}
        <InviteUserModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleSendInvitation}
          isLoading={inviteLoading}
        />
      </div>
    </Layout>
  );
};export default ProjectPage;

