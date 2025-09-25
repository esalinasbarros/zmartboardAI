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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                title: string;
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
            name: string;
            position: number;
            boardId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        projectId: string;
    }>;
    getProjectBoards(projectId: string, userId: string): Promise<({
        columns: ({
            tasks: {
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
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            position: number;
            boardId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        projectId: string;
    })[]>;
    getBoardById(boardId: string, userId: string): Promise<{
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
        columns: ({
            tasks: {
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
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            position: number;
            boardId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        projectId: string;
    }>;
    updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<{
        columns: ({
            tasks: {
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
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            position: number;
            boardId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        projectId: string;
    }>;
    deleteBoard(boardId: string, userId: string): Promise<{
        message: string;
    }>;
    createColumn(boardId: string, createColumnDto: CreateColumnDto, userId: string): Promise<{
        tasks: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        position: number;
        boardId: string;
    }>;
    updateColumn(columnId: string, updateColumnDto: UpdateColumnDto, userId: string): Promise<{
        tasks: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        position: number;
        boardId: string;
    }>;
    deleteColumn(columnId: string, userId: string): Promise<{
        message: string;
    }>;
    moveColumn(columnId: string, moveColumnDto: MoveColumnDto, userId: string): Promise<({
        board: {
            project: {
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
    }) | ({
        tasks: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        position: number;
        boardId: string;
    }) | null>;
}
