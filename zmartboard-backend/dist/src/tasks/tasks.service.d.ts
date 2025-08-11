import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, MoveTaskDto, AssignUserDto, UnassignUserDto, CreateTimeEntryDto, UpdateTimeEntryDto } from './dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkProjectMemberPermission;
    getTaskById(taskId: string, userId: string): Promise<{
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
    createTask(columnId: string, createTaskDto: CreateTaskDto, userId: string): Promise<{
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
    updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<{
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
    deleteTask(taskId: string, userId: string): Promise<{
        message: string;
    }>;
    moveTask(taskId: string, moveTaskDto: MoveTaskDto, userId: string): Promise<{
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
    archiveTask(taskId: string, userId: string): Promise<{
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
    unarchiveTask(taskId: string, userId: string): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            hours: number;
            date: Date;
            taskId: string;
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
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            userId: string;
            hours: number;
            date: Date;
            taskId: string;
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
    getUserTaskTimeEntries(taskId: string, userId: string): Promise<{
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
