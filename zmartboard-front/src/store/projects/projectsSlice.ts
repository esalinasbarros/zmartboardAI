import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { projectsApi } from '../../services/projects.api';
import type {
  Project,
  Invitation,
  CreateProjectDto,
  UpdateProjectDto,
  CreateInvitationDto,
  InvitationResponseDto,
  UpdateProjectMemberRoleDto,
} from '../../types/projects.types';

// Define the initial state
interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  userInvitations: Invitation[];
  projectInvitations: Invitation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  userInvitations: [],
  projectInvitations: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: CreateProjectDto, { rejectWithValue }) => {
    try {
      const response = await projectsApi.createProject(projectData);
      return response; // Backend returns project directly
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserProjects = createAsyncThunk(
  'projects/getUserProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsApi.getUserProjects();
      return response; // Backend returns projects array directly
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllProjects = createAsyncThunk(
  'projects/getAllProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsApi.getAllProjects();
      return response; // Backend returns projects array directly
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch all projects';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProjectById = createAsyncThunk(
  'projects/getProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await projectsApi.getProjectById(id);
      return response; // Backend returns project directly
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }: { id: string; projectData: UpdateProjectDto }, { rejectWithValue }) => {
    try {
      const response = await projectsApi.updateProject(id, projectData);
      return response; // Backend returns project directly
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectsApi.deleteProject(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      return rejectWithValue(errorMessage);
    }
  }
);

export const sendInvitation = createAsyncThunk(
  'projects/sendInvitation',
  async ({ projectId, invitationData }: { projectId: string; invitationData: CreateInvitationDto }, { rejectWithValue }) => {
    try {
      const response = await projectsApi.sendInvitation(projectId, invitationData);
      return response.invitation;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send invitation';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProjectInvitations = createAsyncThunk(
  'projects/getProjectInvitations',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await projectsApi.getProjectInvitations(projectId);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project invitations';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserInvitations = createAsyncThunk(
  'projects/getUserInvitations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsApi.getUserInvitations();
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user invitations';
      return rejectWithValue(errorMessage);
    }
  }
);

export const respondToInvitation = createAsyncThunk(
  'projects/respondToInvitation',
  async ({ invitationId, response }: { invitationId: string; response: InvitationResponseDto }, { rejectWithValue }) => {
    try {
      await projectsApi.respondToInvitation(invitationId, response);
      return { invitationId, response: response.response };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to respond to invitation';
      return rejectWithValue(errorMessage);
    }
  }
);

export const cancelInvitation = createAsyncThunk(
  'projects/cancelInvitation',
  async (invitationId: string, { rejectWithValue }) => {
    try {
      await projectsApi.cancelInvitation(invitationId);
      return invitationId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel invitation';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProjectMemberRole = createAsyncThunk(
  'projects/updateProjectMemberRole',
  async ({ projectId, memberId, roleData }: { projectId: string; memberId: string; roleData: UpdateProjectMemberRoleDto }, { rejectWithValue }) => {
    try {
      const response = await projectsApi.updateProjectMemberRole(projectId, memberId, roleData);
      return { projectId, member: response.member };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update member role';
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeProjectMember = createAsyncThunk(
  'projects/removeProjectMember',
  async ({ projectId, memberId }: { projectId: string; memberId: string }, { rejectWithValue }) => {
    try {
      await projectsApi.removeProjectMember(projectId, memberId);
      return { projectId, memberId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove project member';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create the slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    clearProjects: (state) => {
      state.projects = [];
      state.currentProject = null;
      state.userInvitations = [];
      state.projectInvitations = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure projects array exists before pushing
        if (!state.projects) {
          state.projects = [];
        }
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Get user projects
      .addCase(getUserProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(getUserProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Get all projects
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Get project by ID
      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure projects array exists before searching
        if (!state.projects) {
          state.projects = [];
        }
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure projects array exists before filtering
        if (!state.projects) {
          state.projects = [];
        }
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Send invitation
      .addCase(sendInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure projectInvitations array exists before pushing
        if (!state.projectInvitations) {
          state.projectInvitations = [];
        }
        state.projectInvitations.push(action.payload);
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Get project invitations
      .addCase(getProjectInvitations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectInvitations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectInvitations = action.payload;
      })
      .addCase(getProjectInvitations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Get user invitations
      .addCase(getUserInvitations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserInvitations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInvitations = action.payload;
      })
      .addCase(getUserInvitations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Respond to invitation
      .addCase(respondToInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(respondToInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        const { invitationId, response } = action.payload;
        // Ensure userInvitations array exists before searching
        if (!state.userInvitations) {
          state.userInvitations = [];
        }
        const invitation = state.userInvitations.find(inv => inv.id === invitationId);
        if (invitation) {
          invitation.status = response === 'accept' ? 'ACCEPTED' : 'REJECTED';
        }
        state.userInvitations = state.userInvitations.filter(inv => inv.id !== invitationId);
      })
      .addCase(respondToInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Cancel invitation
      .addCase(cancelInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure invitation arrays exist before filtering
        if (!state.projectInvitations) {
          state.projectInvitations = [];
        }
        if (!state.userInvitations) {
          state.userInvitations = [];
        }
        state.projectInvitations = state.projectInvitations.filter(inv => inv.id !== action.payload);
        state.userInvitations = state.userInvitations.filter(inv => inv.id !== action.payload);
      })
      .addCase(cancelInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Update project member role
      .addCase(updateProjectMemberRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProjectMemberRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const { projectId, member } = action.payload;
        // Ensure projects array exists before searching
        if (!state.projects) {
          state.projects = [];
        }
        const project = state.projects.find(p => p.id === projectId);
        if (project && project.members) {
          const memberIndex = project.members.findIndex(m => m.id === member.id);
          if (memberIndex !== -1) {
            project.members[memberIndex] = member;
          }
        }
        if (state.currentProject?.id === projectId && state.currentProject.members) {
          const memberIndex = state.currentProject.members.findIndex(m => m.id === member.id);
          if (memberIndex !== -1) {
            state.currentProject.members[memberIndex] = member;
          }
        }
      })
      .addCase(updateProjectMemberRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Remove project member
      .addCase(removeProjectMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeProjectMember.fulfilled, (state, action) => {
        state.isLoading = false;
        const { projectId, memberId } = action.payload;
        // Ensure projects array exists before searching
        if (!state.projects) {
          state.projects = [];
        }
        const project = state.projects.find(p => p.id === projectId);
        if (project && project.members) {
          project.members = project.members.filter(m => m.user.id !== memberId);
        }
        if (state.currentProject?.id === projectId && state.currentProject.members) {
          state.currentProject.members = state.currentProject.members.filter(m => m.user.id !== memberId);
        }
      })
      .addCase(removeProjectMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentProject, clearProjects } = projectsSlice.actions;
export default projectsSlice.reducer;