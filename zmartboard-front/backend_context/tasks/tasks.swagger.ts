import { ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import {
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  AssignUserDto,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
} from './dto';

// Common Auth Decorators
export const TasksBearerAuth = ApiBearerAuth();
export const TasksCookieAuth = ApiCookieAuth();

// Task Decorators
export const GetTaskByIdOperation = ApiOperation({
  summary: 'Get a specific task',
  description: 'Retrieve a specific task with all its details, comments, and assigned users.',
});
export const GetTaskByIdParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const GetTaskByIdSuccessResponse = ApiResponse({
  status: 200,
  description: 'Task retrieved successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clp1234567890' },
      title: { type: 'string', example: 'Implement user authentication' },
      description: { type: 'string', example: 'Create JWT-based auth system' },
      position: { type: 'number', example: 0 },
      columnId: { type: 'string', example: 'clp1234567890' },
      deadline: { type: 'string', format: 'date-time', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      column: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          board: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              project: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                },
              },
            },
          },
        },
      },
      comments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            content: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      assignedUsers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
      timeEntries: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            hours: { type: 'number', example: 2.5 },
            description: { type: 'string', example: 'Worked on authentication logic' },
            date: { type: 'string', format: 'date' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
});
export const GetTaskByIdForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const GetTaskByIdNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

export const CreateTaskOperation = ApiOperation({
  summary: 'Create a new task',
  description: 'Create a new task in a column. Any project member can create tasks.',
});
export const CreateTaskParam = ApiParam({ name: 'columnId', description: 'Column ID' });
export const CreateTaskBody = ApiBody({ type: CreateTaskDto });
export const CreateTaskSuccessResponse = ApiResponse({
  status: 201,
  description: 'Task created successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clp1234567890' },
      title: { type: 'string', example: 'Implement user authentication' },
      description: { type: 'string', example: 'Create JWT-based auth system' },
      position: { type: 'number', example: 0 },
      columnId: { type: 'string', example: 'clp1234567890' },
      deadline: { type: 'string', format: 'date-time', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
});
export const CreateTaskForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const CreateTaskNotFoundResponse = ApiResponse({ status: 404, description: 'Column not found' });

export const UpdateTaskOperation = ApiOperation({
  summary: 'Update a task',
  description: 'Update task details. Any project member can update tasks.',
});
export const UpdateTaskParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const UpdateTaskBody = ApiBody({ type: UpdateTaskDto });
export const UpdateTaskSuccessResponse = ApiResponse({ status: 200, description: 'Task updated successfully' });
export const UpdateTaskForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const UpdateTaskNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

export const DeleteTaskOperation = ApiOperation({
  summary: 'Delete a task',
  description: 'Delete a task. Any project member can delete tasks.',
});
export const DeleteTaskParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const DeleteTaskSuccessResponse = ApiResponse({
  status: 200,
  description: 'Task deleted successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Task deleted successfully' },
    },
  },
});
export const DeleteTaskForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const DeleteTaskNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

export const MoveTaskOperation = ApiOperation({
  summary: 'Move a task',
  description: 'Move a task within the same column or to a different column. Any project member can move tasks.',
});
export const MoveTaskParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const MoveTaskBody = ApiBody({ type: MoveTaskDto });
export const MoveTaskSuccessResponse = ApiResponse({ status: 200, description: 'Task moved successfully' });
export const MoveTaskBadRequestResponse = ApiResponse({ status: 400, description: 'Cannot move task to a column in a different board' });
export const MoveTaskForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const MoveTaskNotFoundResponse = ApiResponse({ status: 404, description: 'Task or target column not found' });

export const ArchiveTaskOperation = ApiOperation({
  summary: 'Archive a task',
  description: 'Archive a task. Any project member can archive tasks.',
});
export const ArchiveTaskParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const ArchiveTaskSuccessResponse = ApiResponse({
  status: 200,
  description: 'Task archived successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Task archived successfully' },
      task: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clp1234567890' },
          title: { type: 'string', example: 'Implement user authentication' },
          description: { type: 'string', example: 'Create JWT-based auth system' },
          position: { type: 'number', example: 0 },
          columnId: { type: 'string', example: 'clp1234567890' },
          archived: { type: 'boolean', example: true },
          deadline: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
});
export const ArchiveTaskForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const ArchiveTaskNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

export const UnarchiveTaskOperation = ApiOperation({
  summary: 'Unarchive a task',
  description: 'Unarchive a task. Any project member can unarchive tasks.',
});
export const UnarchiveTaskParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const UnarchiveTaskSuccessResponse = ApiResponse({
  status: 200,
  description: 'Task unarchived successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Task unarchived successfully' },
      task: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clp1234567890' },
          title: { type: 'string', example: 'Implement user authentication' },
          description: { type: 'string', example: 'Create JWT-based auth system' },
          position: { type: 'number', example: 0 },
          columnId: { type: 'string', example: 'clp1234567890' },
          archived: { type: 'boolean', example: false },
          deadline: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
});
export const UnarchiveTaskForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const UnarchiveTaskNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

// Task Assignment Decorators
export const AssignUserToTaskOperation = ApiOperation({
  summary: 'Assign user to task',
  description: 'Assign a user to a task. Any project member can assign users to tasks.',
});
export const AssignUserToTaskParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const AssignUserToTaskBody = ApiBody({ type: AssignUserDto });
export const AssignUserToTaskSuccessResponse = ApiResponse({
  status: 201,
  description: 'User assigned to task successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'User assigned to task successfully' },
    },
  },
});
export const AssignUserToTaskForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const AssignUserToTaskNotFoundResponse = ApiResponse({ status: 404, description: 'Task or user not found' });
export const AssignUserToTaskConflictResponse = ApiResponse({ status: 409, description: 'User is already assigned to this task' });

export const UnassignUserFromTaskOperation = ApiOperation({
  summary: 'Unassign user from task',
  description: 'Remove a user assignment from a task. Any project member can unassign users from tasks.',
});
export const UnassignUserFromTaskParam = [
  ApiParam({ name: 'taskId', description: 'Task ID' }),
  ApiParam({ name: 'userId', description: 'User ID' }),
];
export const UnassignUserFromTaskSuccessResponse = ApiResponse({
  status: 200,
  description: 'User unassigned from task successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'User unassigned from task successfully' },
    },
  },
});
export const UnassignUserFromTaskForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const UnassignUserFromTaskNotFoundResponse = ApiResponse({ status: 404, description: 'Task, user, or assignment not found' });

export const GetTaskAssignmentsOperation = ApiOperation({
  summary: 'Get task assignments',
  description: 'Get all users assigned to a task. Any project member can view task assignments.',
});
export const GetTaskAssignmentsParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const GetTaskAssignmentsSuccessResponse = ApiResponse({
  status: 200,
  description: 'Task assignments retrieved successfully',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
      },
    },
  },
});
export const GetTaskAssignmentsForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const GetTaskAssignmentsNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

// Time Entry Decorators
export const CreateTimeEntryOperation = ApiOperation({
  summary: 'Create time entry for task',
  description: 'Log hours worked on a task. Any project member can create time entries.',
});
export const CreateTimeEntryParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const CreateTimeEntryBody = ApiBody({ type: CreateTimeEntryDto });
export const CreateTimeEntrySuccessResponse = ApiResponse({
  status: 201,
  description: 'Time entry created successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clp1234567890' },
      hours: { type: 'number', example: 2.5 },
      description: { type: 'string', example: 'Worked on authentication logic' },
      date: { type: 'string', format: 'date' },
      taskId: { type: 'string', example: 'clp1234567890' },
      userId: { type: 'string', example: 'clp1234567890' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
});
export const CreateTimeEntryForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const CreateTimeEntryNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

export const UpdateTimeEntryOperation = ApiOperation({
  summary: 'Update time entry',
  description: 'Update a time entry. Only the creator of the time entry can update it.',
});
export const UpdateTimeEntryParam = ApiParam({ name: 'timeEntryId', description: 'Time Entry ID' });
export const UpdateTimeEntryBody = ApiBody({ type: UpdateTimeEntryDto });
export const UpdateTimeEntrySuccessResponse = ApiResponse({
  status: 200,
  description: 'Time entry updated successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clp1234567890' },
      hours: { type: 'number', example: 3.0 },
      description: { type: 'string', example: 'Updated: Worked on authentication logic and testing' },
      date: { type: 'string', format: 'date' },
      taskId: { type: 'string', example: 'clp1234567890' },
      userId: { type: 'string', example: 'clp1234567890' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
});
export const UpdateTimeEntryForbiddenResponse = ApiResponse({ status: 403, description: 'You can only update your own time entries' });
export const UpdateTimeEntryNotFoundResponse = ApiResponse({ status: 404, description: 'Time entry not found' });

export const DeleteTimeEntryOperation = ApiOperation({
  summary: 'Delete time entry',
  description: 'Delete a time entry. Only the creator of the time entry can delete it.',
});
export const DeleteTimeEntryParam = ApiParam({ name: 'timeEntryId', description: 'Time Entry ID' });
export const DeleteTimeEntrySuccessResponse = ApiResponse({
  status: 200,
  description: 'Time entry deleted successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Time entry deleted successfully' },
    },
  },
});
export const DeleteTimeEntryForbiddenResponse = ApiResponse({ status: 403, description: 'You can only delete your own time entries' });
export const DeleteTimeEntryNotFoundResponse = ApiResponse({ status: 404, description: 'Time entry not found' });

export const GetTaskTimeEntriesOperation = ApiOperation({
  summary: 'Get time entries for task',
  description: 'Get all time entries for a task. Any project member can view time entries.',
});
export const GetTaskTimeEntriesParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const GetTaskTimeEntriesSuccessResponse = ApiResponse({
  status: 200,
  description: 'Time entries retrieved successfully',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        hours: { type: 'number', example: 2.5 },
        description: { type: 'string', example: 'Worked on authentication logic' },
        date: { type: 'string', format: 'date' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
      },
    },
  },
});
export const GetTaskTimeEntriesForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const GetTaskTimeEntriesNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

export const GetUserTaskTimeEntriesOperation = ApiOperation({
  summary: 'Get user\'s time entries for task',
  description: 'Get current user\'s time entries for a specific task.',
});
export const GetUserTaskTimeEntriesParam = ApiParam({ name: 'taskId', description: 'Task ID' });
export const GetUserTaskTimeEntriesSuccessResponse = ApiResponse({
  status: 200,
  description: 'User time entries retrieved successfully',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        hours: { type: 'number', example: 2.5 },
        description: { type: 'string', example: 'Worked on authentication logic' },
        date: { type: 'string', format: 'date' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  },
});
export const GetUserTaskTimeEntriesForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const GetUserTaskTimeEntriesNotFoundResponse = ApiResponse({ status: 404, description: 'Task not found' });

// Common Error Responses
export const UnauthorizedResponse = ApiResponse({ status: 401, description: 'Unauthorized' });