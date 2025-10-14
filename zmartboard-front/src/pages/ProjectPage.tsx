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
import { useAppDispatch } from '../store/hooks';
import { getBoardById } from '../store/boards/boardsSlice';
import { Layout, InviteUserModal, InvitationsList } from '../components';
import { BoardsSidebar, BoardView, EditBoardModal } from '../components/boards';
import { useBoardActions } from '../store/boards/boardsHooks';
import { useToastNotifications } from '../hooks/useToastNotifications';
import type { CreateInvitationDto } from '../types/projects.types';
import type { Board, UpdateBoardDto } from '../types/boards.types';

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
  const { updateBoard, deleteBoard } = useBoardActions();
  const currentProject = useCurrentProject();
  const projectInvitations = useProjectInvitations();
  const isLoading = useProjectsLoading();
  const error = useProjectsError();
  const toast = useToastNotifications();
  const dispatch = useAppDispatch();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'boards' | 'members' | 'invitations'>('boards');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

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

  const handleSelectBoard = async (board: Board) => {
    try {
      // Fetch the complete board data with columns
      const result = await dispatch(getBoardById(board.id));
      if (getBoardById.fulfilled.match(result)) {
        setSelectedBoard(result.payload);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.board.fetchError(errorMessage);
    }
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setShowEditBoardModal(true);
  };

  const handleUpdateBoard = async (data: UpdateBoardDto) => {
    if (!editingBoard) return;
    
    try {
      await updateBoard(editingBoard.id, data);
      setShowEditBoardModal(false);
      setEditingBoard(null);
      toast.board.updateSuccess();
      
      // Update selected board if it's the one being edited
      if (selectedBoard?.id === editingBoard.id) {
        setSelectedBoard({ ...selectedBoard, ...data });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.board.updateError(errorMessage);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este tablero?')) {
      return;
    }

    try {
      await deleteBoard(boardId);
      // If the deleted board was selected, clear selection
      if (selectedBoard?.id === boardId) {
        setSelectedBoard(null);
      }
      toast.board.deleteSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.board.deleteError(errorMessage);
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
      <div className="h-[calc(100vh-64px)]"> {/* Assuming navbar is 64px */}
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white px-4">
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
          <div className="h-[calc(100%-57px)] flex"> {/* Subtract tab height */}
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <BoardsSidebar
                projectId={currentProject.id}
                selectedBoardId={selectedBoard?.id}
                onSelectBoard={handleSelectBoard}
                isAdmin={isAdmin}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              {selectedBoard ? (
                <div className="h-full p-6">
                  <BoardView
                    board={selectedBoard}
                    isAdmin={isAdmin}
                  />
                  
                  {/* Board Actions */}
                  {isAdmin && (
                    <div className="absolute top-20 right-6 flex space-x-2">
                      <button
                        onClick={() => handleEditBoard(selectedBoard)}
                        className="p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg shadow border border-gray-200 transition-colors"
                        title="Editar tablero"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteBoard(selectedBoard.id)}
                        className="p-2 bg-white hover:bg-red-50 text-red-600 rounded-lg shadow border border-gray-200 transition-colors"
                        title="Eliminar tablero"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un tablero</h3>
                    <p className="text-gray-500">Selecciona un tablero de la barra lateral para ver sus columnas y tareas.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="p-8 overflow-y-auto h-[calc(100%-57px)]">
            <div className="max-w-6xl mx-auto">
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

              {/* Admin Actions */}
              {isAdmin && (
                <div className="bg-white rounded-lg shadow p-6 mt-6">
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
            </div>
          </div>
        )}

        {activeTab === 'invitations' && isAdmin && (
          <div className="p-8 overflow-y-auto h-[calc(100%-57px)]">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Invitaciones Pendientes</h2>
                <InvitationsList
                  invitations={projectInvitations || []}
                  onCancelInvitation={handleCancelInvitation}
                  isLoading={isLoading}
                />
              </div>
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

        {/* Edit Board Modal */}
        <EditBoardModal
          isOpen={showEditBoardModal}
          onClose={() => {
            setShowEditBoardModal(false);
            setEditingBoard(null);
          }}
          onSubmit={handleUpdateBoard}
          isLoading={isLoading}
          initialTitle={editingBoard?.title}
          initialDescription={editingBoard?.description}
        />
      </div>
    </Layout>
  );
};

export default ProjectPage;
