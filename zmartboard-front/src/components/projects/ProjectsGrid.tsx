import React from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '../../types/projects.types';
import type { User } from '../../types/auth.types';

interface ProjectsGridProps {
  projects?: Project[];
  currentUser?: Omit<User, 'password'> | null;
  onCreateProject: () => void;
  onEditProject?: (projectId: string, title: string, description?: string) => void;
  onDeleteProject?: (projectId: string) => void;
  updateLoading?: boolean;
  deleteLoading?: boolean;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  currentUser,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  updateLoading = false,
  deleteLoading = false,
}) => {
  if (projects && projects.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            currentUser={currentUser}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            updateLoading={updateLoading}
            deleteLoading={deleteLoading}
          />
        ))}
      </div>
    );
  }

  // Empty state
  return (
    <div className="text-center py-12">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no tienes proyectos</h3>
        <p className="text-gray-600 mb-6">Crea tu primer proyecto para comenzar con ZmartBoard.</p>
        <button 
          onClick={onCreateProject}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Crear Proyecto
        </button>
      </div>
    </div>
  );
};

export default ProjectsGrid;