"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveColumnForbiddenResponse = exports.MoveColumnSuccessResponse = exports.MoveColumnBody = exports.MoveColumnParam = exports.MoveColumnOperation = exports.DeleteColumnNotFoundResponse = exports.DeleteColumnForbiddenResponse = exports.DeleteColumnSuccessResponse = exports.DeleteColumnParam = exports.DeleteColumnOperation = exports.UpdateColumnNotFoundResponse = exports.UpdateColumnForbiddenResponse = exports.UpdateColumnSuccessResponse = exports.UpdateColumnBody = exports.UpdateColumnParam = exports.UpdateColumnOperation = exports.CreateColumnNotFoundResponse = exports.CreateColumnForbiddenResponse = exports.CreateColumnSuccessResponse = exports.CreateColumnBody = exports.CreateColumnParam = exports.CreateColumnOperation = exports.DeleteBoardNotFoundResponse = exports.DeleteBoardForbiddenResponse = exports.DeleteBoardSuccessResponse = exports.DeleteBoardParam = exports.DeleteBoardOperation = exports.UpdateBoardNotFoundResponse = exports.UpdateBoardForbiddenResponse = exports.UpdateBoardSuccessResponse = exports.UpdateBoardBody = exports.UpdateBoardParam = exports.UpdateBoardOperation = exports.GetBoardByIdNotFoundResponse = exports.GetBoardByIdForbiddenResponse = exports.GetBoardByIdSuccessResponse = exports.GetBoardByIdParam = exports.GetBoardByIdOperation = exports.GetProjectBoardsForbiddenResponse = exports.GetProjectBoardsSuccessResponse = exports.GetProjectBoardsParam = exports.GetProjectBoardsOperation = exports.CreateBoardNotFoundResponse = exports.CreateBoardForbiddenResponse = exports.CreateBoardSuccessResponse = exports.CreateBoardBody = exports.CreateBoardParam = exports.CreateBoardOperation = exports.BoardsCookieAuth = exports.BoardsBearerAuth = void 0;
exports.UnauthorizedResponse = exports.MoveColumnNotFoundResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
exports.BoardsBearerAuth = (0, swagger_1.ApiBearerAuth)();
exports.BoardsCookieAuth = (0, swagger_1.ApiCookieAuth)();
exports.CreateBoardOperation = (0, swagger_1.ApiOperation)({
    summary: 'Create a new board',
    description: 'Create a new board in a project. Only project admins can create boards.',
});
exports.CreateBoardParam = (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' });
exports.CreateBoardBody = (0, swagger_1.ApiBody)({ type: dto_1.CreateBoardDto });
exports.CreateBoardSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.CreateBoardForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Only project admins can create boards' });
exports.CreateBoardNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' });
exports.GetProjectBoardsOperation = (0, swagger_1.ApiOperation)({
    summary: 'Get all boards for a project',
    description: 'Retrieve all boards for a specific project. Only project members can access.',
});
exports.GetProjectBoardsParam = (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project ID' });
exports.GetProjectBoardsSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.GetProjectBoardsForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.GetBoardByIdOperation = (0, swagger_1.ApiOperation)({
    summary: 'Get a specific board',
    description: 'Retrieve a specific board with all its columns and tasks.',
});
exports.GetBoardByIdParam = (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' });
exports.GetBoardByIdSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.GetBoardByIdForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.GetBoardByIdNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Board not found' });
exports.UpdateBoardOperation = (0, swagger_1.ApiOperation)({
    summary: 'Update a board',
    description: 'Update board details. Only project admins can update boards.',
});
exports.UpdateBoardParam = (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' });
exports.UpdateBoardBody = (0, swagger_1.ApiBody)({ type: dto_1.UpdateBoardDto });
exports.UpdateBoardSuccessResponse = (0, swagger_1.ApiResponse)({ status: 200, description: 'Board updated successfully' });
exports.UpdateBoardForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Only project admins can update boards' });
exports.UpdateBoardNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Board not found' });
exports.DeleteBoardOperation = (0, swagger_1.ApiOperation)({
    summary: 'Delete a board',
    description: 'Delete a board and all its columns and tasks. Only project admins can delete boards.',
});
exports.DeleteBoardParam = (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' });
exports.DeleteBoardSuccessResponse = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Board deleted successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Board deleted successfully' },
        },
    },
});
exports.DeleteBoardForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Only project admins can delete boards' });
exports.DeleteBoardNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Board not found' });
exports.CreateColumnOperation = (0, swagger_1.ApiOperation)({
    summary: 'Create a new column',
    description: 'Create a new column in a board. Only project admins can create columns.',
});
exports.CreateColumnParam = (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' });
exports.CreateColumnBody = (0, swagger_1.ApiBody)({ type: dto_1.CreateColumnDto });
exports.CreateColumnSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.CreateColumnForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Only project admins can create columns' });
exports.CreateColumnNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Board not found' });
exports.UpdateColumnOperation = (0, swagger_1.ApiOperation)({
    summary: 'Update a column',
    description: 'Update column details. Only project admins can update columns.',
});
exports.UpdateColumnParam = (0, swagger_1.ApiParam)({ name: 'columnId', description: 'Column ID' });
exports.UpdateColumnBody = (0, swagger_1.ApiBody)({ type: dto_1.UpdateColumnDto });
exports.UpdateColumnSuccessResponse = (0, swagger_1.ApiResponse)({ status: 200, description: 'Column updated successfully' });
exports.UpdateColumnForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Only project admins can update columns' });
exports.UpdateColumnNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Column not found' });
exports.DeleteColumnOperation = (0, swagger_1.ApiOperation)({
    summary: 'Delete a column',
    description: 'Delete a column and all its tasks. Only project admins can delete columns.',
});
exports.DeleteColumnParam = (0, swagger_1.ApiParam)({ name: 'columnId', description: 'Column ID' });
exports.DeleteColumnSuccessResponse = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Column deleted successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Column deleted successfully' },
        },
    },
});
exports.DeleteColumnForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Only project admins can delete columns' });
exports.DeleteColumnNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Column not found' });
exports.MoveColumnOperation = (0, swagger_1.ApiOperation)({
    summary: 'Move a column',
    description: 'Change the position of a column within a board. Only project admins can move columns.',
});
exports.MoveColumnParam = (0, swagger_1.ApiParam)({ name: 'columnId', description: 'Column ID' });
exports.MoveColumnBody = (0, swagger_1.ApiBody)({ type: dto_1.MoveColumnDto });
exports.MoveColumnSuccessResponse = (0, swagger_1.ApiResponse)({ status: 200, description: 'Column moved successfully' });
exports.MoveColumnForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'Only project admins can move columns' });
exports.MoveColumnNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Column not found' });
exports.UnauthorizedResponse = (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' });
//# sourceMappingURL=boards.swagger.js.map