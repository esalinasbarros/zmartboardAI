import { ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import {
  CreateBoardDto,
  UpdateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
  MoveColumnDto,
} from './dto';

// Common Auth Decorators
export const BoardsBearerAuth = ApiBearerAuth();
export const BoardsCookieAuth = ApiCookieAuth();

// Board Decorators
export const CreateBoardOperation = ApiOperation({
  summary: 'Create a new board',
  description: 'Create a new board in a project. Only project admins can create boards.',
});
export const CreateBoardParam = ApiParam({ name: 'projectId', description: 'Project ID' });
export const CreateBoardBody = ApiBody({ type: CreateBoardDto });
export const CreateBoardSuccessResponse = ApiResponse({
  status: 201,
  description: 'Board created successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clp1234567890' },
      title: { type: 'string', example: 'Sprint Planning Board' },
      description: { type: 'string', example: 'Board for managing sprint tasks' },
      projectId: { type: 'string', example: 'clp1234567890' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      columns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            position: { type: 'number' },
            tasks: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  },
});
export const CreateBoardForbiddenResponse = ApiResponse({ status: 403, description: 'Only project admins can create boards' });
export const CreateBoardNotFoundResponse = ApiResponse({ status: 404, description: 'Project not found' });

export const GetProjectBoardsOperation = ApiOperation({
  summary: 'Get all boards for a project',
  description: 'Retrieve all boards for a specific project. Only project members can access.',
});
export const GetProjectBoardsParam = ApiParam({ name: 'projectId', description: 'Project ID' });
export const GetProjectBoardsSuccessResponse = ApiResponse({
  status: 200,
  description: 'Boards retrieved successfully',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        projectId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        columns: { type: 'array', items: { type: 'object' } },
      },
    },
  },
});
export const GetProjectBoardsForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });

export const GetBoardByIdOperation = ApiOperation({
  summary: 'Get a specific board',
  description: 'Retrieve a specific board with all its columns and tasks.',
});
export const GetBoardByIdParam = ApiParam({ name: 'boardId', description: 'Board ID' });
export const GetBoardByIdSuccessResponse = ApiResponse({
  status: 200,
  description: 'Board retrieved successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      projectId: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      columns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            position: { type: 'number' },
            tasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  position: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  },
});
export const GetBoardByIdForbiddenResponse = ApiResponse({ status: 403, description: 'You are not a member of this project' });
export const GetBoardByIdNotFoundResponse = ApiResponse({ status: 404, description: 'Board not found' });

export const UpdateBoardOperation = ApiOperation({
  summary: 'Update a board',
  description: 'Update board details. Only project admins can update boards.',
});
export const UpdateBoardParam = ApiParam({ name: 'boardId', description: 'Board ID' });
export const UpdateBoardBody = ApiBody({ type: UpdateBoardDto });
export const UpdateBoardSuccessResponse = ApiResponse({ status: 200, description: 'Board updated successfully' });
export const UpdateBoardForbiddenResponse = ApiResponse({ status: 403, description: 'Only project admins can update boards' });
export const UpdateBoardNotFoundResponse = ApiResponse({ status: 404, description: 'Board not found' });

export const DeleteBoardOperation = ApiOperation({
  summary: 'Delete a board',
  description: 'Delete a board and all its columns and tasks. Only project admins can delete boards.',
});
export const DeleteBoardParam = ApiParam({ name: 'boardId', description: 'Board ID' });
export const DeleteBoardSuccessResponse = ApiResponse({
  status: 200,
  description: 'Board deleted successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Board deleted successfully' },
    },
  },
});
export const DeleteBoardForbiddenResponse = ApiResponse({ status: 403, description: 'Only project admins can delete boards' });
export const DeleteBoardNotFoundResponse = ApiResponse({ status: 404, description: 'Board not found' });

// Column Decorators
export const CreateColumnOperation = ApiOperation({
  summary: 'Create a new column',
  description: 'Create a new column in a board. Only project admins can create columns.',
});
export const CreateColumnParam = ApiParam({ name: 'boardId', description: 'Board ID' });
export const CreateColumnBody = ApiBody({ type: CreateColumnDto });
export const CreateColumnSuccessResponse = ApiResponse({
  status: 201,
  description: 'Column created successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clp1234567890' },
      name: { type: 'string', example: 'To Do' },
      position: { type: 'number', example: 0 },
      boardId: { type: 'string', example: 'clp1234567890' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      tasks: { type: 'array', items: { type: 'object' } },
    },
  },
});
export const CreateColumnForbiddenResponse = ApiResponse({ status: 403, description: 'Only project admins can create columns' });
export const CreateColumnNotFoundResponse = ApiResponse({ status: 404, description: 'Board not found' });

export const UpdateColumnOperation = ApiOperation({
  summary: 'Update a column',
  description: 'Update column details. Only project admins can update columns.',
});
export const UpdateColumnParam = ApiParam({ name: 'columnId', description: 'Column ID' });
export const UpdateColumnBody = ApiBody({ type: UpdateColumnDto });
export const UpdateColumnSuccessResponse = ApiResponse({ status: 200, description: 'Column updated successfully' });
export const UpdateColumnForbiddenResponse = ApiResponse({ status: 403, description: 'Only project admins can update columns' });
export const UpdateColumnNotFoundResponse = ApiResponse({ status: 404, description: 'Column not found' });

export const DeleteColumnOperation = ApiOperation({
  summary: 'Delete a column',
  description: 'Delete a column and all its tasks. Only project admins can delete columns.',
});
export const DeleteColumnParam = ApiParam({ name: 'columnId', description: 'Column ID' });
export const DeleteColumnSuccessResponse = ApiResponse({
  status: 200,
  description: 'Column deleted successfully',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Column deleted successfully' },
    },
  },
});
export const DeleteColumnForbiddenResponse = ApiResponse({ status: 403, description: 'Only project admins can delete columns' });
export const DeleteColumnNotFoundResponse = ApiResponse({ status: 404, description: 'Column not found' });

export const MoveColumnOperation = ApiOperation({
  summary: 'Move a column',
  description: 'Change the position of a column within a board. Only project admins can move columns.',
});
export const MoveColumnParam = ApiParam({ name: 'columnId', description: 'Column ID' });
export const MoveColumnBody = ApiBody({ type: MoveColumnDto });
export const MoveColumnSuccessResponse = ApiResponse({ status: 200, description: 'Column moved successfully' });
export const MoveColumnForbiddenResponse = ApiResponse({ status: 403, description: 'Only project admins can move columns' });
export const MoveColumnNotFoundResponse = ApiResponse({ status: 404, description: 'Column not found' });



// Common Error Responses
export const UnauthorizedResponse = ApiResponse({ status: 401, description: 'Unauthorized' });