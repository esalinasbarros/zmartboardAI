import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/projects.types';
import type { User } from '../../types/auth.types';

interface ProjectCardProps {
  project: Project;
  currentUser?: Omit<User, 'password'> | null;
  onEdit?: (projectId: string, title: string, description?: string) => void;
  onDelete?: (projectId: string) => void;
  updateLoading?: boolean;
  deleteLoading?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  currentUser,
  onEdit,
  onDelete,
  updateLoading = false,
  deleteLoading = false,
}) => {
  const navigate = useNavigate();

  const canEditProject = () => {
    if (!currentUser) return false;
    // User can edit if they are the owner or have ADMIN role
    if (project.owner?.id === currentUser.id) return true;
    const userMember = project.members.find((member) => member.user.id === currentUser.id);
    return userMember?.role === 'ADMIN';
  };

  const canDeleteProject = () => {
    if (!currentUser) return false;
    // User can delete if they are the owner or have ADMIN role
    if (project.owner?.id === currentUser.id) return true;
    const userMember = project.members.find((member) => member.user.id === currentUser.id);
    return userMember?.role === 'ADMIN';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Project Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
            {project.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
            )}
          </div>
          <div className="flex space-x-2 ml-3">
            {canEditProject() && onEdit && (
              <button
                onClick={() => onEdit(project.id, project.title, project.description)}
                disabled={updateLoading}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50 p-1"
                title="Editar proyecto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {canDeleteProject() && onDelete && (
              <button
                onClick={() => onDelete(project.id)}
                disabled={deleteLoading}
                className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1"
                title="Eliminar proyecto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Project Info */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Propietario: {
              project.owner?.username || 
              project.members.find(m => m.role === 'ADMIN')?.user.username || 
              'Desconocido'
            }
          </span>
          <span>{project.members.length} miembro{project.members.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      {/* Members */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, index) => (
              <div 
                key={index}
                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                title={member.user.username}
              >
                {member.user.username.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate(`/projects/${project.id}`)}
            className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors duration-200"
          >
            Ver Detalles
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-400">
            Creado: {project.createdAt instanceof Date ? project.createdAt.toLocaleDateString() : new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;