import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto, AssignUserDto, UnassignUserDto, CreateTimeEntryDto, UpdateTimeEntryDto } from './dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkProjectMemberPermission;
    getTaskById(taskId: string, userId: string): Promise<{
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
    createTask(columnId: string, createTaskDto: CreateTaskDto, userId: string): Promise<{
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
    updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<{
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
    deleteTask(taskId: string, userId: string): Promise<{
        message: string;
    }>;
    moveTask(taskId: string, moveTaskDto: MoveTaskDto, userId: string): Promise<{
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
    archiveTask(taskId: string, userId: string): Promise<{
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
    unarchiveTask(taskId: string, userId: string): Promise<{
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
    assignUserToTask(taskId: string, assignUserDto: AssignUserDto, userId: string): Promise<{
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
    unassignUserFromTask(taskId: string, unassignUserDto: UnassignUserDto, userId: string): Promise<{
        message: string;
    }>;
    getTaskAssignments(taskId: string, userId: string): Promise<({
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
    createTimeEntry(taskId: string, createTimeEntryDto: CreateTimeEntryDto, userId: string): Promise<{
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
    updateTimeEntry(timeEntryId: string, updateTimeEntryDto: UpdateTimeEntryDto, userId: string): Promise<{
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
    deleteTimeEntry(timeEntryId: string, userId: string): Promise<{
        message: string;
    }>;
    getTaskTimeEntries(taskId: string, userId: string): Promise<{
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
    getUserTaskTimeEntries(taskId: string, userId: string): Promise<{
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
