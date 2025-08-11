import { useAppDispatch, useAppSelector } from '../hooks';
import {
  createProject,
  getUserProjects,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  sendInvitation,
  getProjectInvitations,
  getUserInvitations,
  respondToInvitation,
  cancelInvitation,
  updateProjectMemberRole,
  removeProjectMember,
  clearError,
  setCurrentProject,
  clearProjects,
} from './projectsSlice';
import type {
  CreateProjectDto,
  UpdateProjectDto,
  CreateInvitationDto,
  InvitationResponseDto,
  UpdateProjectMemberRoleDto,
  Project,
} from '../../types/projects.types';

// Hook to get projects state
export const useProjectsState = () => {
  return useAppSelector((state) => state.projects);
};

// Hook to get current project
export const useCurrentProject = () => {
  return useAppSelector((state) => state.projects.currentProject);
};

// Hook to get projects list
export const useProjects = () => {
  return useAppSelector((state) => state.projects.projects);
};

// Hook to get user invitations
export const useUserInvitations = () => {
  return useAppSelector((state) => state.projects.userInvitations);
};

// Hook to get project invitations
export const useProjectInvitations = () => {
  return useAppSelector((state) => state.projects.projectInvitations);
};

// Hook to get loading state
export const useProjectsLoading = () => {
  return useAppSelector((state) => state.projects.isLoading);
};

// Hook to get error state
export const useProjectsError = () => {
  return useAppSelector((state) => state.projects.error);
};

// Hook for project actions
export const useProjectActions = () => {
  const dispatch = useAppDispatch();

  return {
    createProject: (projectData: CreateProjectDto) => dispatch(createProject(projectData)),
    getUserProjects: () => dispatch(getUserProjects()),
    getAllProjects: () => dispatch(getAllProjects()),
    getProjectById: (id: string) => dispatch(getProjectById(id)),
    updateProject: (id: string, projectData: UpdateProjectDto) => 
      dispatch(updateProject({ id, projectData })),
    deleteProject: (id: string) => dispatch(deleteProject(id)),
    sendInvitation: (projectId: string, invitationData: CreateInvitationDto) => 
      dispatch(sendInvitation({ projectId, invitationData })),
    getProjectInvitations: (projectId: string) => dispatch(getProjectInvitations(projectId)),
    getUserInvitations: () => dispatch(getUserInvitations()),
    respondToInvitation: (invitationId: string, response: InvitationResponseDto) => 
      dispatch(respondToInvitation({ invitationId, response })),
    cancelInvitation: (invitationId: string) => dispatch(cancelInvitation(invitationId)),
    updateProjectMemberRole: (projectId: string, memberId: string, roleData: UpdateProjectMemberRoleDto) => 
      dispatch(updateProjectMemberRole({ projectId, memberId, roleData })),
    removeProjectMember: (projectId: string, memberId: string) => 
      dispatch(removeProjectMember({ projectId, memberId })),
    clearError: () => dispatch(clearError()),
    setCurrentProject: (project: Project | null) => dispatch(setCurrentProject(project)),
    clearProjects: () => dispatch(clearProjects()),
  };
};

// Hook for creating projects
export const useCreateProject = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useProjectsState();

  const createProjectAction = (projectData: CreateProjectDto) => {
    dispatch(clearError());
    return dispatch(createProject(projectData));
  };

  return {
    createProject: createProjectAction,
    isLoading,
    error,
  };
};

// Hook for fetching user projects
export const useFetchUserProjects = () => {
  const dispatch = useAppDispatch();
  const { projects, isLoading, error } = useProjectsState();

  const fetchProjects = () => {
    dispatch(clearError());
    return dispatch(getUserProjects());
  };

  return {
    projects,
    fetchProjects,
    isLoading,
    error,
  };
};

// Hook for fetching all projects (admin)
export const useFetchAllProjects = () => {
  const dispatch = useAppDispatch();
  const { projects, isLoading, error } = useProjectsState();

  const fetchAllProjects = () => {
    dispatch(clearError());
    return dispatch(getAllProjects());
  };

  return {
    projects,
    fetchAllProjects,
    isLoading,
    error,
  };
};

// Hook for fetching project by ID
export const useFetchProjectById = () => {
  const dispatch = useAppDispatch();
  const { currentProject, isLoading, error } = useProjectsState();

  const fetchProject = (id: string) => {
    dispatch(clearError());
    return dispatch(getProjectById(id));
  };

  return {
    project: currentProject,
    fetchProject,
    isLoading,
    error,
  };
};

// Hook for updating projects
export const useUpdateProject = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useProjectsState();

  const updateProjectAction = (id: string, projectData: UpdateProjectDto) => {
    dispatch(clearError());
    return dispatch(updateProject({ id, projectData }));
  };

  return {
    updateProject: updateProjectAction,
    isLoading,
    error,
  };
};

// Hook for deleting projects
export const useDeleteProject = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useProjectsState();

  const deleteProjectAction = (id: string) => {
    dispatch(clearError());
    return dispatch(deleteProject(id));
  };

  return {
    deleteProject: deleteProjectAction,
    isLoading,
    error,
  };
};

// Hook for managing invitations
// export const useInvitations = () => {
//   const dispatch = useAppDispatch();
//   const { userInvitations, projectInvitations, isLoading, error } = useProjectsState();

//   const sendInvitationAction = (projectId: string, invitationData: CreateInvitationDto) => {
//     dispatch(clearError());
//     return dispatch(sendInvitation({ projectId, invitationData }));
//   };

//   const respondToInvitationAction = (invitationId: string, response: InvitationResponseDto) => {
//     dispatch(clearError());
//     return dispatch(respondToInvitation({ invitationId, response }));
//   };

//   const cancelInvitationAction = (invitationId: string) => {
//     dispatch(clearError());
//     return dispatch(cancelInvitation(invitationId));
//   };

//   const fetchUserInvitations = () => {
//     dispatch(clearError());
//     return dispatch(getUserInvitations());
//   };

//   const fetchProjectInvitations = (projectId: string) => {
//     dispatch(clearError());
//     return dispatch(getProjectInvitations(projectId));
//   };

//   return {
//     userInvitations,
//     projectInvitations,
//     sendInvitation: sendInvitationAction,
//     respondToInvitation: respondToInvitationAction,
//     cancelInvitation: cancelInvitationAction,
//     fetchUserInvitations,
//     fetchProjectInvitations,
//     isLoading,
//     error,
//   };
// };

// Hook for managing project members
export const useProjectMembers = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useProjectsState();

  const updateMemberRole = (projectId: string, memberId: string, roleData: UpdateProjectMemberRoleDto) => {
    dispatch(clearError());
    return dispatch(updateProjectMemberRole({ projectId, memberId, roleData }));
  };

  const removeMember = (projectId: string, memberId: string) => {
    dispatch(clearError());
    return dispatch(removeProjectMember({ projectId, memberId }));
  };

  return {
    updateMemberRole,
    removeMember,
    isLoading,
    error,
  };
};