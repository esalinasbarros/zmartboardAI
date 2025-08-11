import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto, AssignUserDto, CreateTimeEntryDto, UpdateTimeEntryDto } from './dto';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getTaskById(taskId: string, req: AuthenticatedRequest): Promise<{
        timeEntries: ({
            user: {
                id: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            hours: number;
            date: Date;
            taskId: string;
        })[];
        column: {
            board: {
                project: {
                    members: {
                        id: string;
                        role: import(".prisma/client").$Enums.ProjectRole;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        projectId: string;
                    }[];
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    title: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                title: string;
                projectId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            position: number;
            boardId: string;
        };
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            userId: string;
            taskId: string;
        }[];
        assignedUsers: ({
            user: {
                id: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            taskId: string;
            assignedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: number;
        columnId: string;
        deadline: Date | null;
        archived: boolean;
        estimatedHours: number | null;
    }>;
    createTask(columnId: string, createTaskDto: CreateTaskDto, req: AuthenticatedRequest): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: number;
        columnId: string;
        deadline: Date | null;
        archived: boolean;
        estimatedHours: number | null;
    }>;
    updateTask(taskId: string, updateTaskDto: UpdateTaskDto, req: AuthenticatedRequest): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: number;
        columnId: string;
        deadline: Date | null;
        archived: boolean;
        estimatedHours: number | null;
    }>;
    deleteTask(taskId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    moveTask(taskId: string, moveTaskDto: MoveTaskDto, req: AuthenticatedRequest): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: number;
        columnId: string;
        deadline: Date | null;
        archived: boolean;
        estimatedHours: number | null;
    } | null>;
    archiveTask(taskId: string, req: AuthenticatedRequest): Promise<{
        message: string;
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            position: number;
            columnId: string;
            deadline: Date | null;
            archived: boolean;
            estimatedHours: number | null;
        };
    }>;
    unarchiveTask(taskId: string, req: AuthenticatedRequest): Promise<{
        message: string;
        task: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            position: number;
            columnId: string;
            deadline: Date | null;
            archived: boolean;
            estimatedHours: number | null;
        };
    }>;
    assignUserToTask(taskId: string, assignUserDto: AssignUserDto, req: AuthenticatedRequest): Promise<{
        message: string;
        assignment: {
            user: {
                id: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            taskId: string;
            assignedAt: Date;
        };
    }>;
    unassignUserFromTask(taskId: string, userId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    getTaskAssignments(taskId: string, req: AuthenticatedRequest): Promise<({
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        taskId: string;
        assignedAt: Date;
    })[]>;
    createTimeEntry(taskId: string, createTimeEntryDto: CreateTimeEntryDto, req: AuthenticatedRequest): Promise<{
        message: string;
        timeEntry: {
            user: {
                id: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            hours: number;
            date: Date;
            taskId: string;
        };
    }>;
    updateTimeEntry(timeEntryId: string, updateTimeEntryDto: UpdateTimeEntryDto, req: AuthenticatedRequest): Promise<{
        message: string;
        timeEntry: {
            user: {
                id: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            hours: number;
            date: Date;
            taskId: string;
        };
    }>;
    deleteTimeEntry(timeEntryId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    getTaskTimeEntries(taskId: string, req: AuthenticatedRequest): Promise<{
        timeEntries: ({
            user: {
                id: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            hours: number;
            date: Date;
            taskId: string;
        })[];
        totalHours: number;
        entryCount: number;
    }>;
    getUserTaskTimeEntries(taskId: string, req: AuthenticatedRequest): Promise<{
        timeEntries: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            hours: number;
            date: Date;
            taskId: string;
        }[];
        totalHours: number;
        entryCount: number;
    }>;
}
