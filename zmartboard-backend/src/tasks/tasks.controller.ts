import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  AssignUserDto,
  UnassignUserDto,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
import {
  TasksBearerAuth,
  TasksCookieAuth,
  GetTaskByIdOperation,
  GetTaskByIdParam,
  GetTaskByIdSuccessResponse,
  GetTaskByIdForbiddenResponse,
  GetTaskByIdNotFoundResponse,
  CreateTaskOperation,
  CreateTaskParam,
  CreateTaskBody,
  CreateTaskSuccessResponse,
  CreateTaskForbiddenResponse,
  CreateTaskNotFoundResponse,
  UpdateTaskOperation,
  UpdateTaskParam,
  UpdateTaskBody,
  UpdateTaskSuccessResponse,
  UpdateTaskForbiddenResponse,
  UpdateTaskNotFoundResponse,
  DeleteTaskOperation,
  DeleteTaskParam,
  DeleteTaskSuccessResponse,
  DeleteTaskForbiddenResponse,
  DeleteTaskNotFoundResponse,
  MoveTaskOperation,
  MoveTaskParam,
  MoveTaskBody,
  MoveTaskSuccessResponse,
  MoveTaskBadRequestResponse,
  MoveTaskForbiddenResponse,
  MoveTaskNotFoundResponse,
  ArchiveTaskOperation,
  ArchiveTaskParam,
  ArchiveTaskSuccessResponse,
  ArchiveTaskForbiddenResponse,
  ArchiveTaskNotFoundResponse,
  UnarchiveTaskOperation,
  UnarchiveTaskParam,
  UnarchiveTaskSuccessResponse,
  UnarchiveTaskForbiddenResponse,
  UnarchiveTaskNotFoundResponse,
  UnauthorizedResponse,
  AssignUserToTaskOperation,
  AssignUserToTaskParam,
  AssignUserToTaskBody,
  AssignUserToTaskSuccessResponse,
  AssignUserToTaskForbiddenResponse,
  AssignUserToTaskNotFoundResponse,
  AssignUserToTaskConflictResponse,
  UnassignUserFromTaskOperation,
  UnassignUserFromTaskParam,
  UnassignUserFromTaskSuccessResponse,
  UnassignUserFromTaskForbiddenResponse,
  UnassignUserFromTaskNotFoundResponse,
  GetTaskAssignmentsOperation,
  GetTaskAssignmentsParam,
  GetTaskAssignmentsSuccessResponse,
  GetTaskAssignmentsForbiddenResponse,
  GetTaskAssignmentsNotFoundResponse,
  CreateTimeEntryOperation,
  CreateTimeEntryParam,
  CreateTimeEntryBody,
  CreateTimeEntrySuccessResponse,
  CreateTimeEntryForbiddenResponse,
  CreateTimeEntryNotFoundResponse,
  UpdateTimeEntryOperation,
  UpdateTimeEntryParam,
  UpdateTimeEntryBody,
  UpdateTimeEntrySuccessResponse,
  UpdateTimeEntryForbiddenResponse,
  UpdateTimeEntryNotFoundResponse,
  DeleteTimeEntryOperation,
  DeleteTimeEntryParam,
  DeleteTimeEntrySuccessResponse,
  DeleteTimeEntryForbiddenResponse,
  DeleteTimeEntryNotFoundResponse,
  GetTaskTimeEntriesOperation,
  GetTaskTimeEntriesParam,
  GetTaskTimeEntriesSuccessResponse,
  GetTaskTimeEntriesForbiddenResponse,
  GetTaskTimeEntriesNotFoundResponse,
  GetUserTaskTimeEntriesOperation,
  GetUserTaskTimeEntriesParam,
  GetUserTaskTimeEntriesSuccessResponse,
  GetUserTaskTimeEntriesForbiddenResponse,
  GetUserTaskTimeEntriesNotFoundResponse,
} from './tasks.swagger';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@TasksBearerAuth
@TasksCookieAuth
@UnauthorizedResponse
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Get task by ID
  @GetTaskByIdOperation
  @GetTaskByIdParam
  @GetTaskByIdSuccessResponse
  @GetTaskByIdForbiddenResponse
  @GetTaskByIdNotFoundResponse
  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string, @Request() req: AuthenticatedRequest) {
    return this.tasksService.getTaskById(taskId, req.user.id);
  }

  // Create task
  @CreateTaskOperation
  @CreateTaskParam
  @CreateTaskBody
  @CreateTaskSuccessResponse
  @CreateTaskForbiddenResponse
  @CreateTaskNotFoundResponse
  @Post('columns/:columnId')
  async createTask(
    @Param('columnId') columnId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.createTask(columnId, createTaskDto, req.user.id);
  }

  // Update task
  @UpdateTaskOperation
  @UpdateTaskParam
  @UpdateTaskBody
  @UpdateTaskSuccessResponse
  @UpdateTaskForbiddenResponse
  @UpdateTaskNotFoundResponse
  @Put(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.updateTask(taskId, updateTaskDto, req.user.id);
  }

  // Delete task
  @DeleteTaskOperation
  @DeleteTaskParam
  @DeleteTaskSuccessResponse
  @DeleteTaskForbiddenResponse
  @DeleteTaskNotFoundResponse
  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: string, @Request() req: AuthenticatedRequest) {
    return this.tasksService.deleteTask(taskId, req.user.id);
  }

  // Move task
  @MoveTaskOperation
  @MoveTaskParam
  @MoveTaskBody
  @MoveTaskSuccessResponse
  @MoveTaskBadRequestResponse
  @MoveTaskForbiddenResponse
  @MoveTaskNotFoundResponse
  @Patch(':taskId/move')
  async moveTask(
    @Param('taskId') taskId: string,
    @Body() moveTaskDto: MoveTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.moveTask(taskId, moveTaskDto, req.user.id);
  }

  // Archive task
  @ArchiveTaskOperation
  @ArchiveTaskParam
  @ArchiveTaskSuccessResponse
  @ArchiveTaskForbiddenResponse
  @ArchiveTaskNotFoundResponse
  @Patch(':taskId/archive')
  async archiveTask(@Param('taskId') taskId: string, @Request() req: AuthenticatedRequest) {
    return this.tasksService.archiveTask(taskId, req.user.id);
  }

  // Unarchive task
  @UnarchiveTaskOperation
  @UnarchiveTaskParam
  @UnarchiveTaskSuccessResponse
  @UnarchiveTaskForbiddenResponse
  @UnarchiveTaskNotFoundResponse
  @Patch(':taskId/unarchive')
  async unarchiveTask(@Param('taskId') taskId: string, @Request() req: AuthenticatedRequest) {
    return this.tasksService.unarchiveTask(taskId, req.user.id);
  }

  // Assign user to task
  @AssignUserToTaskOperation
  @AssignUserToTaskParam
  @AssignUserToTaskBody
  @AssignUserToTaskSuccessResponse
  @AssignUserToTaskForbiddenResponse
  @AssignUserToTaskNotFoundResponse
  @AssignUserToTaskConflictResponse
  @Post(':taskId/assign')
  async assignUserToTask(
    @Param('taskId') taskId: string,
    @Body() assignUserDto: AssignUserDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.assignUserToTask(taskId, assignUserDto, req.user.id);
  }

  // Unassign user from task
  @UnassignUserFromTaskOperation
  @UnassignUserFromTaskSuccessResponse
  @UnassignUserFromTaskForbiddenResponse
  @UnassignUserFromTaskNotFoundResponse
  @Delete(':taskId/assign/:userId')
  async unassignUserFromTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.unassignUserFromTask(taskId, { userId }, req.user.id);
  }

  // Get task assignments
  @GetTaskAssignmentsOperation
  @GetTaskAssignmentsParam
  @GetTaskAssignmentsSuccessResponse
  @GetTaskAssignmentsForbiddenResponse
  @GetTaskAssignmentsNotFoundResponse
  @Get(':taskId/assignments')
  async getTaskAssignments(
    @Param('taskId') taskId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.getTaskAssignments(taskId, req.user.id);
  }

  // Create time entry for task
  @CreateTimeEntryOperation
  @CreateTimeEntryParam
  @CreateTimeEntryBody
  @CreateTimeEntrySuccessResponse
  @CreateTimeEntryForbiddenResponse
  @CreateTimeEntryNotFoundResponse
  @Post(':taskId/time-entries')
  async createTimeEntry(
    @Param('taskId') taskId: string,
    @Body() createTimeEntryDto: CreateTimeEntryDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.createTimeEntry(taskId, createTimeEntryDto, req.user.id);
  }

  // Update time entry
  @UpdateTimeEntryOperation
  @UpdateTimeEntryParam
  @UpdateTimeEntryBody
  @UpdateTimeEntrySuccessResponse
  @UpdateTimeEntryForbiddenResponse
  @UpdateTimeEntryNotFoundResponse
  @Put('time-entries/:timeEntryId')
  async updateTimeEntry(
    @Param('timeEntryId') timeEntryId: string,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.updateTimeEntry(timeEntryId, updateTimeEntryDto, req.user.id);
  }

  // Delete time entry
  @DeleteTimeEntryOperation
  @DeleteTimeEntryParam
  @DeleteTimeEntrySuccessResponse
  @DeleteTimeEntryForbiddenResponse
  @DeleteTimeEntryNotFoundResponse
  @Delete('time-entries/:timeEntryId')
  async deleteTimeEntry(
    @Param('timeEntryId') timeEntryId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.deleteTimeEntry(timeEntryId, req.user.id);
  }

  // Get time entries for a task
  @GetTaskTimeEntriesOperation
  @GetTaskTimeEntriesParam
  @GetTaskTimeEntriesSuccessResponse
  @GetTaskTimeEntriesForbiddenResponse
  @GetTaskTimeEntriesNotFoundResponse
  @Get(':taskId/time-entries')
  async getTaskTimeEntries(
    @Param('taskId') taskId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.getTaskTimeEntries(taskId, req.user.id);
  }

  // Get user's time entries for a task
  @GetUserTaskTimeEntriesOperation
  @GetUserTaskTimeEntriesParam
  @GetUserTaskTimeEntriesSuccessResponse
  @GetUserTaskTimeEntriesForbiddenResponse
  @GetUserTaskTimeEntriesNotFoundResponse
  @Get(':taskId/time-entries/my')
  async getUserTaskTimeEntries(
    @Param('taskId') taskId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.tasksService.getUserTaskTimeEntries(taskId, req.user.id);
  }
}