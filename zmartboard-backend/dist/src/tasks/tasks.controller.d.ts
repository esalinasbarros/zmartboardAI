import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto, AssignUserDto, CreateTimeEntryDto, UpdateTimeEntryDto } from './dto';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getTaskById(taskId: string, req: AuthenticatedRequest): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            taskId: string;
        }[];
        column: {
            board: {
                project: {
                    members: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        role: import(".prisma/client").$Enums.ProjectRole;
                        projectId: string;
                    }[];
                } & {
                    id: string;
                    title: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                projectId: string;
            };
        } & {
            id: string;
            position: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            boardId: string;
        };
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
        timeEntries: ({
            user: {
                id: string;
                username: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            taskId: string;
            hours: number;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        position: number;
        columnId: string;
        deadline: Date | null;
        archived: boolean;
        estimatedHours: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createTask(columnId: string, createTaskDto: CreateTaskDto, req: AuthenticatedRequest): Promise<{
        id: string;
        title: string;
        description: string | null;
        position: number;
        columnId: string;
        deadline: Date | null;
        archived: boolean;
        estimatedHours: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTask(taskId: string, updateTaskDto: UpdateTaskDto, req: AuthenticatedRequest): Promise<{
        id: string;
        title: string;
        description: string | null;
        position: number;
        columnId: string;
        deadline: Date | null;
        archived: boolean;
        estimatedHours: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTask(taskId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    moveTask(taskId: string, moveTaskDto: MoveTaskDto, req: AuthenticatedRequest): Promise<{
        id: string;
        title: string;
        description: string | null;
        position: number;
        columnId: string;
        deadline: Date | null;
        archived: boolean;
        estimatedHours: number | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    archiveTask(taskId: string, req: AuthenticatedRequest): Promise<{
        message: string;
        task: {
            id: string;
            title: string;
            description: string | null;
            position: number;
            columnId: string;
            deadline: Date | null;
            archived: boolean;
            estimatedHours: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    unarchiveTask(taskId: string, req: AuthenticatedRequest): Promise<{
        message: string;
        task: {
            id: string;
            title: string;
            description: string | null;
            position: number;
            columnId: string;
            deadline: Date | null;
            archived: boolean;
            estimatedHours: number | null;
            createdAt: Date;
            updatedAt: Date;
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
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            taskId: string;
            hours: number;
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
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            taskId: string;
            hours: number;
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
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            taskId: string;
            hours: number;
        })[];
        totalHours: number;
        entryCount: number;
    }>;
    getUserTaskTimeEntries(taskId: string, req: AuthenticatedRequest): Promise<{
        timeEntries: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            date: Date;
            taskId: string;
            hours: number;
        }[];
        totalHours: number;
        entryCount: number;
    }>;
}
