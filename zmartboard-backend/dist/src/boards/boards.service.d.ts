import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto, CreateColumnDto, UpdateColumnDto, MoveColumnDto } from './dto';
export declare class BoardsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private checkProjectAdminPermission;
    private checkProjectMemberPermission;
    createBoard(projectId: string, createBoardDto: CreateBoardDto, userId: string): Promise<{
        columns: ({
            tasks: {
                id: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                position: number;
                columnId: string;
                deadline: Date | null;
                archived: boolean;
                estimatedHours: number | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            position: number;
            name: string;
            boardId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    getProjectBoards(projectId: string, userId: string): Promise<({
        columns: ({
            tasks: {
                id: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                position: number;
                columnId: string;
                deadline: Date | null;
                archived: boolean;
                estimatedHours: number | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            position: number;
            name: string;
            boardId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    })[]>;
    getBoardById(boardId: string, userId: string): Promise<{
        project: {
            members: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                projectId: string;
                userId: string;
                role: import(".prisma/client").$Enums.ProjectRole;
            }[];
        } & {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        columns: ({
            tasks: {
                id: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                position: number;
                columnId: string;
                deadline: Date | null;
                archived: boolean;
                estimatedHours: number | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            position: number;
            name: string;
            boardId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<{
        columns: ({
            tasks: {
                id: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                position: number;
                columnId: string;
                deadline: Date | null;
                archived: boolean;
                estimatedHours: number | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            position: number;
            name: string;
            boardId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    deleteBoard(boardId: string, userId: string): Promise<{
        message: string;
    }>;
    createColumn(boardId: string, createColumnDto: CreateColumnDto, userId: string): Promise<{
        tasks: {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            position: number;
            columnId: string;
            deadline: Date | null;
            archived: boolean;
            estimatedHours: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        position: number;
        name: string;
        boardId: string;
    }>;
    updateColumn(columnId: string, updateColumnDto: UpdateColumnDto, userId: string): Promise<{
        tasks: {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            position: number;
            columnId: string;
            deadline: Date | null;
            archived: boolean;
            estimatedHours: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        position: number;
        name: string;
        boardId: string;
    }>;
    deleteColumn(columnId: string, userId: string): Promise<{
        message: string;
    }>;
    moveColumn(columnId: string, moveColumnDto: MoveColumnDto, userId: string): Promise<({
        board: {
            project: {
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
        createdAt: Date;
        updatedAt: Date;
        position: number;
        name: string;
        boardId: string;
    }) | ({
        tasks: {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            position: number;
            columnId: string;
            deadline: Date | null;
            archived: boolean;
            estimatedHours: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        position: number;
        name: string;
        boardId: string;
    }) | null>;
}
