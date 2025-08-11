"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnassignUserFromTaskParam = exports.UnassignUserFromTaskOperation = exports.AssignUserToTaskConflictResponse = exports.AssignUserToTaskNotFoundResponse = exports.AssignUserToTaskForbiddenResponse = exports.AssignUserToTaskSuccessResponse = exports.AssignUserToTaskBody = exports.AssignUserToTaskParam = exports.AssignUserToTaskOperation = exports.UnarchiveTaskNotFoundResponse = exports.UnarchiveTaskForbiddenResponse = exports.UnarchiveTaskSuccessResponse = exports.UnarchiveTaskParam = exports.UnarchiveTaskOperation = exports.ArchiveTaskNotFoundResponse = exports.ArchiveTaskForbiddenResponse = exports.ArchiveTaskSuccessResponse = exports.ArchiveTaskParam = exports.ArchiveTaskOperation = exports.MoveTaskNotFoundResponse = exports.MoveTaskForbiddenResponse = exports.MoveTaskBadRequestResponse = exports.MoveTaskSuccessResponse = exports.MoveTaskBody = exports.MoveTaskParam = exports.MoveTaskOperation = exports.DeleteTaskNotFoundResponse = exports.DeleteTaskForbiddenResponse = exports.DeleteTaskSuccessResponse = exports.DeleteTaskParam = exports.DeleteTaskOperation = exports.UpdateTaskNotFoundResponse = exports.UpdateTaskForbiddenResponse = exports.UpdateTaskSuccessResponse = exports.UpdateTaskBody = exports.UpdateTaskParam = exports.UpdateTaskOperation = exports.CreateTaskNotFoundResponse = exports.CreateTaskForbiddenResponse = exports.CreateTaskSuccessResponse = exports.CreateTaskBody = exports.CreateTaskParam = exports.CreateTaskOperation = exports.GetTaskByIdNotFoundResponse = exports.GetTaskByIdForbiddenResponse = exports.GetTaskByIdSuccessResponse = exports.GetTaskByIdParam = exports.GetTaskByIdOperation = exports.TasksCookieAuth = exports.TasksBearerAuth = void 0;
exports.UnauthorizedResponse = exports.GetUserTaskTimeEntriesNotFoundResponse = exports.GetUserTaskTimeEntriesForbiddenResponse = exports.GetUserTaskTimeEntriesSuccessResponse = exports.GetUserTaskTimeEntriesParam = exports.GetUserTaskTimeEntriesOperation = exports.GetTaskTimeEntriesNotFoundResponse = exports.GetTaskTimeEntriesForbiddenResponse = exports.GetTaskTimeEntriesSuccessResponse = exports.GetTaskTimeEntriesParam = exports.GetTaskTimeEntriesOperation = exports.DeleteTimeEntryNotFoundResponse = exports.DeleteTimeEntryForbiddenResponse = exports.DeleteTimeEntrySuccessResponse = exports.DeleteTimeEntryParam = exports.DeleteTimeEntryOperation = exports.UpdateTimeEntryNotFoundResponse = exports.UpdateTimeEntryForbiddenResponse = exports.UpdateTimeEntrySuccessResponse = exports.UpdateTimeEntryBody = exports.UpdateTimeEntryParam = exports.UpdateTimeEntryOperation = exports.CreateTimeEntryNotFoundResponse = exports.CreateTimeEntryForbiddenResponse = exports.CreateTimeEntrySuccessResponse = exports.CreateTimeEntryBody = exports.CreateTimeEntryParam = exports.CreateTimeEntryOperation = exports.GetTaskAssignmentsNotFoundResponse = exports.GetTaskAssignmentsForbiddenResponse = exports.GetTaskAssignmentsSuccessResponse = exports.GetTaskAssignmentsParam = exports.GetTaskAssignmentsOperation = exports.UnassignUserFromTaskNotFoundResponse = exports.UnassignUserFromTaskForbiddenResponse = exports.UnassignUserFromTaskSuccessResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
exports.TasksBearerAuth = (0, swagger_1.ApiBearerAuth)();
exports.TasksCookieAuth = (0, swagger_1.ApiCookieAuth)();
exports.GetTaskByIdOperation = (0, swagger_1.ApiOperation)({
    summary: 'Get a specific task',
    description: 'Retrieve a specific task with all its details, comments, and assigned users.',
});
exports.GetTaskByIdParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.GetTaskByIdSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.GetTaskByIdForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.GetTaskByIdNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.CreateTaskOperation = (0, swagger_1.ApiOperation)({
    summary: 'Create a new task',
    description: 'Create a new task in a column. Any project member can create tasks.',
});
exports.CreateTaskParam = (0, swagger_1.ApiParam)({ name: 'columnId', description: 'Column ID' });
exports.CreateTaskBody = (0, swagger_1.ApiBody)({ type: dto_1.CreateTaskDto });
exports.CreateTaskSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.CreateTaskForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.CreateTaskNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Column not found' });
exports.UpdateTaskOperation = (0, swagger_1.ApiOperation)({
    summary: 'Update a task',
    description: 'Update task details. Any project member can update tasks.',
});
exports.UpdateTaskParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.UpdateTaskBody = (0, swagger_1.ApiBody)({ type: dto_1.UpdateTaskDto });
exports.UpdateTaskSuccessResponse = (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated successfully' });
exports.UpdateTaskForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.UpdateTaskNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.DeleteTaskOperation = (0, swagger_1.ApiOperation)({
    summary: 'Delete a task',
    description: 'Delete a task. Any project member can delete tasks.',
});
exports.DeleteTaskParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.DeleteTaskSuccessResponse = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Task deleted successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Task deleted successfully' },
        },
    },
});
exports.DeleteTaskForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.DeleteTaskNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.MoveTaskOperation = (0, swagger_1.ApiOperation)({
    summary: 'Move a task',
    description: 'Move a task within the same column or to a different column. Any project member can move tasks.',
});
exports.MoveTaskParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.MoveTaskBody = (0, swagger_1.ApiBody)({ type: dto_1.MoveTaskDto });
exports.MoveTaskSuccessResponse = (0, swagger_1.ApiResponse)({ status: 200, description: 'Task moved successfully' });
exports.MoveTaskBadRequestResponse = (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot move task to a column in a different board' });
exports.MoveTaskForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.MoveTaskNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task or target column not found' });
exports.ArchiveTaskOperation = (0, swagger_1.ApiOperation)({
    summary: 'Archive a task',
    description: 'Archive a task. Any project member can archive tasks.',
});
exports.ArchiveTaskParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.ArchiveTaskSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.ArchiveTaskForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.ArchiveTaskNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.UnarchiveTaskOperation = (0, swagger_1.ApiOperation)({
    summary: 'Unarchive a task',
    description: 'Unarchive a task. Any project member can unarchive tasks.',
});
exports.UnarchiveTaskParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.UnarchiveTaskSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.UnarchiveTaskForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.UnarchiveTaskNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.AssignUserToTaskOperation = (0, swagger_1.ApiOperation)({
    summary: 'Assign user to task',
    description: 'Assign a user to a task. Any project member can assign users to tasks.',
});
exports.AssignUserToTaskParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.AssignUserToTaskBody = (0, swagger_1.ApiBody)({ type: dto_1.AssignUserDto });
exports.AssignUserToTaskSuccessResponse = (0, swagger_1.ApiResponse)({
    status: 201,
    description: 'User assigned to task successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'User assigned to task successfully' },
        },
    },
});
exports.AssignUserToTaskForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.AssignUserToTaskNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task or user not found' });
exports.AssignUserToTaskConflictResponse = (0, swagger_1.ApiResponse)({ status: 409, description: 'User is already assigned to this task' });
exports.UnassignUserFromTaskOperation = (0, swagger_1.ApiOperation)({
    summary: 'Unassign user from task',
    description: 'Remove a user assignment from a task. Any project member can unassign users from tasks.',
});
exports.UnassignUserFromTaskParam = [
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
];
exports.UnassignUserFromTaskSuccessResponse = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'User unassigned from task successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'User unassigned from task successfully' },
        },
    },
});
exports.UnassignUserFromTaskForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.UnassignUserFromTaskNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task, user, or assignment not found' });
exports.GetTaskAssignmentsOperation = (0, swagger_1.ApiOperation)({
    summary: 'Get task assignments',
    description: 'Get all users assigned to a task. Any project member can view task assignments.',
});
exports.GetTaskAssignmentsParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.GetTaskAssignmentsSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.GetTaskAssignmentsForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.GetTaskAssignmentsNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.CreateTimeEntryOperation = (0, swagger_1.ApiOperation)({
    summary: 'Create time entry for task',
    description: 'Log hours worked on a task. Any project member can create time entries.',
});
exports.CreateTimeEntryParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.CreateTimeEntryBody = (0, swagger_1.ApiBody)({ type: dto_1.CreateTimeEntryDto });
exports.CreateTimeEntrySuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.CreateTimeEntryForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.CreateTimeEntryNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.UpdateTimeEntryOperation = (0, swagger_1.ApiOperation)({
    summary: 'Update time entry',
    description: 'Update a time entry. Only the creator of the time entry can update it.',
});
exports.UpdateTimeEntryParam = (0, swagger_1.ApiParam)({ name: 'timeEntryId', description: 'Time Entry ID' });
exports.UpdateTimeEntryBody = (0, swagger_1.ApiBody)({ type: dto_1.UpdateTimeEntryDto });
exports.UpdateTimeEntrySuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.UpdateTimeEntryForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only update your own time entries' });
exports.UpdateTimeEntryNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Time entry not found' });
exports.DeleteTimeEntryOperation = (0, swagger_1.ApiOperation)({
    summary: 'Delete time entry',
    description: 'Delete a time entry. Only the creator of the time entry can delete it.',
});
exports.DeleteTimeEntryParam = (0, swagger_1.ApiParam)({ name: 'timeEntryId', description: 'Time Entry ID' });
exports.DeleteTimeEntrySuccessResponse = (0, swagger_1.ApiResponse)({
    status: 200,
    description: 'Time entry deleted successfully',
    schema: {
        type: 'object',
        properties: {
            message: { type: 'string', example: 'Time entry deleted successfully' },
        },
    },
});
exports.DeleteTimeEntryForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only delete your own time entries' });
exports.DeleteTimeEntryNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Time entry not found' });
exports.GetTaskTimeEntriesOperation = (0, swagger_1.ApiOperation)({
    summary: 'Get time entries for task',
    description: 'Get all time entries for a task. Any project member can view time entries.',
});
exports.GetTaskTimeEntriesParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.GetTaskTimeEntriesSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.GetTaskTimeEntriesForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.GetTaskTimeEntriesNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.GetUserTaskTimeEntriesOperation = (0, swagger_1.ApiOperation)({
    summary: 'Get user\'s time entries for task',
    description: 'Get current user\'s time entries for a specific task.',
});
exports.GetUserTaskTimeEntriesParam = (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task ID' });
exports.GetUserTaskTimeEntriesSuccessResponse = (0, swagger_1.ApiResponse)({
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
exports.GetUserTaskTimeEntriesForbiddenResponse = (0, swagger_1.ApiResponse)({ status: 403, description: 'You are not a member of this project' });
exports.GetUserTaskTimeEntriesNotFoundResponse = (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' });
exports.UnauthorizedResponse = (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' });
//# sourceMappingURL=tasks.swagger.js.map