import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../store/auth/authHooks';
import { useFetchUserProjects, useCreateProject, useDeleteProject, useUpdateProject } from '../store/projects/projectsHooks';
import { useNavigate } from 'react-router-dom';
import { Layout, ProjectsGrid, CreateProjectModal, EditProjectModal } from '../components';
import { useToastNotifications } from '../hooks/useToastNotifications';
import type { CreateProjectDto, UpdateProjectDto } from '../types/projects.types';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { projects, fetchProjects, isLoading, error } = useFetchUserProjects();
  const { createProject, isLoading: createLoading } = useCreateProject();
  const { deleteProject, isLoading: deleteLoading } = useDeleteProject();
  const { updateProject, isLoading: updateLoading } = useUpdateProject();
  const navigate = useNavigate();
  const toast = useToastNotifications();

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<CreateProjectDto>({
    title: '',
    description: '',
  });
  const [editFormData, setEditFormData] = React.useState<UpdateProjectDto>({
    title: '',
    description: '',
  });
  const handleFetchProjects = useCallback(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await createProject(formData);
      setFormData({ title: '', description: '' });
      setShowCreateForm(false);
      fetchProjects(); // Refresh the list
      toast.project.createSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.project.createError(errorMessage);
    }
  };

  const handleEditProject = (projectId: string, title: string, description?: string) => {
    setEditingProject(projectId);
    setEditFormData({ title, description: description || '' });
    setShowEditForm(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.title?.trim() || !editingProject) return;

    try {
      await updateProject(editingProject, editFormData);
      setEditFormData({ title: '', description: '' });
      setShowEditForm(false);
      setEditingProject(null);
      fetchProjects(); // Refresh the list
      toast.project.updateSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : undefined;
      toast.project.updateError(errorMessage);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
      try {
        await deleteProject(projectId);
        fetchProjects(); // Refresh the list
        toast.project.deleteSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        toast.project.deleteError(errorMessage);
      }
    }
  };



  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    handleFetchProjects();
  }, [isAuthenticated, navigate]);

  // Handle fetch errors with toast
  useEffect(() => {
    if (error) {
      toast.project.fetchError(error);
    }
  }, [error, toast]);

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Cargando proyectos...</div>
        </div>
      </Layout>
    );
  }

  const handleOpenCreateForm = () => {
    setShowCreateForm(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isAuthenticated ? `¡Bienvenido de vuelta, ${user?.username}!` : '¡Bienvenido a ZmartBoard!'}
              </h1>
              <p className="mt-2 text-gray-600">
                Gestiona tus proyectos con nuestro moderno tablero kanban
              </p>
            </div>
            <button 
              onClick={handleOpenCreateForm}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nuevo Proyecto</span>
            </button>
          </div>
        </div>



        {/* Projects Grid */}
        <ProjectsGrid
          projects={projects}
          currentUser={user}
          onCreateProject={handleOpenCreateForm}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          updateLoading={updateLoading}
          deleteLoading={deleteLoading}
        />

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateProject}
          formData={formData}
          setFormData={setFormData}
          isLoading={createLoading}
        />

        {/* Edit Project Modal */}
        <EditProjectModal
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setEditingProject(null);
          }}
          onSubmit={handleUpdateProject}
          formData={editFormData}
          setFormData={setEditFormData}
          isLoading={updateLoading}
        />

      </div>
    </Layout>
  );
};

export default HomePage;