"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tasks_swagger_1 = require("./tasks.swagger");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async getTaskById(taskId, req) {
        return this.tasksService.getTaskById(taskId, req.user.id);
    }
    async createTask(columnId, createTaskDto, req) {
        return this.tasksService.createTask(columnId, createTaskDto, req.user.id);
    }
    async updateTask(taskId, updateTaskDto, req) {
        return this.tasksService.updateTask(taskId, updateTaskDto, req.user.id);
    }
    async deleteTask(taskId, req) {
        return this.tasksService.deleteTask(taskId, req.user.id);
    }
    async moveTask(taskId, moveTaskDto, req) {
        return this.tasksService.moveTask(taskId, moveTaskDto, req.user.id);
    }
    async archiveTask(taskId, req) {
        return this.tasksService.archiveTask(taskId, req.user.id);
    }
    async unarchiveTask(taskId, req) {
        return this.tasksService.unarchiveTask(taskId, req.user.id);
    }
    async assignUserToTask(taskId, assignUserDto, req) {
        return this.tasksService.assignUserToTask(taskId, assignUserDto, req.user.id);
    }
    async unassignUserFromTask(taskId, userId, req) {
        return this.tasksService.unassignUserFromTask(taskId, { userId }, req.user.id);
    }
    async getTaskAssignments(taskId, req) {
        return this.tasksService.getTaskAssignments(taskId, req.user.id);
    }
    async createTimeEntry(taskId, createTimeEntryDto, req) {
        return this.tasksService.createTimeEntry(taskId, createTimeEntryDto, req.user.id);
    }
    async updateTimeEntry(timeEntryId, updateTimeEntryDto, req) {
        return this.tasksService.updateTimeEntry(timeEntryId, updateTimeEntryDto, req.user.id);
    }
    async deleteTimeEntry(timeEntryId, req) {
        return this.tasksService.deleteTimeEntry(timeEntryId, req.user.id);
    }
    async getTaskTimeEntries(taskId, req) {
        return this.tasksService.getTaskTimeEntries(taskId, req.user.id);
    }
    async getUserTaskTimeEntries(taskId, req) {
        return this.tasksService.getUserTaskTimeEntries(taskId, req.user.id);
    }
};
exports.TasksController = TasksController;
__decorate([
    tasks_swagger_1.GetTaskByIdOperation,
    tasks_swagger_1.GetTaskByIdParam,
    tasks_swagger_1.GetTaskByIdSuccessResponse,
    tasks_swagger_1.GetTaskByIdForbiddenResponse,
    tasks_swagger_1.GetTaskByIdNotFoundResponse,
    (0, common_1.Get)(':taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTaskById", null);
__decorate([
    tasks_swagger_1.CreateTaskOperation,
    tasks_swagger_1.CreateTaskParam,
    tasks_swagger_1.CreateTaskBody,
    tasks_swagger_1.CreateTaskSuccessResponse,
    tasks_swagger_1.CreateTaskForbiddenResponse,
    tasks_swagger_1.CreateTaskNotFoundResponse,
    (0, common_1.Post)('columns/:columnId'),
    __param(0, (0, common_1.Param)('columnId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "createTask", null);
__decorate([
    tasks_swagger_1.UpdateTaskOperation,
    tasks_swagger_1.UpdateTaskParam,
    tasks_swagger_1.UpdateTaskBody,
    tasks_swagger_1.UpdateTaskSuccessResponse,
    tasks_swagger_1.UpdateTaskForbiddenResponse,
    tasks_swagger_1.UpdateTaskNotFoundResponse,
    (0, common_1.Put)(':taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateTask", null);
__decorate([
    tasks_swagger_1.DeleteTaskOperation,
    tasks_swagger_1.DeleteTaskParam,
    tasks_swagger_1.DeleteTaskSuccessResponse,
    tasks_swagger_1.DeleteTaskForbiddenResponse,
    tasks_swagger_1.DeleteTaskNotFoundResponse,
    (0, common_1.Delete)(':taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "deleteTask", null);
__decorate([
    tasks_swagger_1.MoveTaskOperation,
    tasks_swagger_1.MoveTaskParam,
    tasks_swagger_1.MoveTaskBody,
    tasks_swagger_1.MoveTaskSuccessResponse,
    tasks_swagger_1.MoveTaskBadRequestResponse,
    tasks_swagger_1.MoveTaskForbiddenResponse,
    tasks_swagger_1.MoveTaskNotFoundResponse,
    (0, common_1.Patch)(':taskId/move'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.MoveTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "moveTask", null);
__decorate([
    tasks_swagger_1.ArchiveTaskOperation,
    tasks_swagger_1.ArchiveTaskParam,
    tasks_swagger_1.ArchiveTaskSuccessResponse,
    tasks_swagger_1.ArchiveTaskForbiddenResponse,
    tasks_swagger_1.ArchiveTaskNotFoundResponse,
    (0, common_1.Patch)(':taskId/archive'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "archiveTask", null);
__decorate([
    tasks_swagger_1.UnarchiveTaskOperation,
    tasks_swagger_1.UnarchiveTaskParam,
    tasks_swagger_1.UnarchiveTaskSuccessResponse,
    tasks_swagger_1.UnarchiveTaskForbiddenResponse,
    tasks_swagger_1.UnarchiveTaskNotFoundResponse,
    (0, common_1.Patch)(':taskId/unarchive'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "unarchiveTask", null);
__decorate([
    tasks_swagger_1.AssignUserToTaskOperation,
    tasks_swagger_1.AssignUserToTaskParam,
    tasks_swagger_1.AssignUserToTaskBody,
    tasks_swagger_1.AssignUserToTaskSuccessResponse,
    tasks_swagger_1.AssignUserToTaskForbiddenResponse,
    tasks_swagger_1.AssignUserToTaskNotFoundResponse,
    tasks_swagger_1.AssignUserToTaskConflictResponse,
    (0, common_1.Post)(':taskId/assign'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AssignUserDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "assignUserToTask", null);
__decorate([
    tasks_swagger_1.UnassignUserFromTaskOperation,
    tasks_swagger_1.UnassignUserFromTaskSuccessResponse,
    tasks_swagger_1.UnassignUserFromTaskForbiddenResponse,
    tasks_swagger_1.UnassignUserFromTaskNotFoundResponse,
    (0, common_1.Delete)(':taskId/assign/:userId'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "unassignUserFromTask", null);
__decorate([
    tasks_swagger_1.GetTaskAssignmentsOperation,
    tasks_swagger_1.GetTaskAssignmentsParam,
    tasks_swagger_1.GetTaskAssignmentsSuccessResponse,
    tasks_swagger_1.GetTaskAssignmentsForbiddenResponse,
    tasks_swagger_1.GetTaskAssignmentsNotFoundResponse,
    (0, common_1.Get)(':taskId/assignments'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTaskAssignments", null);
__decorate([
    tasks_swagger_1.CreateTimeEntryOperation,
    tasks_swagger_1.CreateTimeEntryParam,
    tasks_swagger_1.CreateTimeEntryBody,
    tasks_swagger_1.CreateTimeEntrySuccessResponse,
    tasks_swagger_1.CreateTimeEntryForbiddenResponse,
    tasks_swagger_1.CreateTimeEntryNotFoundResponse,
    (0, common_1.Post)(':taskId/time-entries'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateTimeEntryDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "createTimeEntry", null);
__decorate([
    tasks_swagger_1.UpdateTimeEntryOperation,
    tasks_swagger_1.UpdateTimeEntryParam,
    tasks_swagger_1.UpdateTimeEntryBody,
    tasks_swagger_1.UpdateTimeEntrySuccessResponse,
    tasks_swagger_1.UpdateTimeEntryForbiddenResponse,
    tasks_swagger_1.UpdateTimeEntryNotFoundResponse,
    (0, common_1.Put)('time-entries/:timeEntryId'),
    __param(0, (0, common_1.Param)('timeEntryId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateTimeEntryDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateTimeEntry", null);
__decorate([
    tasks_swagger_1.DeleteTimeEntryOperation,
    tasks_swagger_1.DeleteTimeEntryParam,
    tasks_swagger_1.DeleteTimeEntrySuccessResponse,
    tasks_swagger_1.DeleteTimeEntryForbiddenResponse,
    tasks_swagger_1.DeleteTimeEntryNotFoundResponse,
    (0, common_1.Delete)('time-entries/:timeEntryId'),
    __param(0, (0, common_1.Param)('timeEntryId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "deleteTimeEntry", null);
__decorate([
    tasks_swagger_1.GetTaskTimeEntriesOperation,
    tasks_swagger_1.GetTaskTimeEntriesParam,
    tasks_swagger_1.GetTaskTimeEntriesSuccessResponse,
    tasks_swagger_1.GetTaskTimeEntriesForbiddenResponse,
    tasks_swagger_1.GetTaskTimeEntriesNotFoundResponse,
    (0, common_1.Get)(':taskId/time-entries'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTaskTimeEntries", null);
__decorate([
    tasks_swagger_1.GetUserTaskTimeEntriesOperation,
    tasks_swagger_1.GetUserTaskTimeEntriesParam,
    tasks_swagger_1.GetUserTaskTimeEntriesSuccessResponse,
    tasks_swagger_1.GetUserTaskTimeEntriesForbiddenResponse,
    tasks_swagger_1.GetUserTaskTimeEntriesNotFoundResponse,
    (0, common_1.Get)(':taskId/time-entries/my'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getUserTaskTimeEntries", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tasks_swagger_1.TasksBearerAuth,
    tasks_swagger_1.TasksCookieAuth,
    tasks_swagger_1.UnauthorizedResponse,
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map