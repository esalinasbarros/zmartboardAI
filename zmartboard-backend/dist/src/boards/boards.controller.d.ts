import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto, CreateColumnDto, UpdateColumnDto, MoveColumnDto } from './dto';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    createBoard(projectId: string, createBoardDto: CreateBoardDto, req: AuthenticatedRequest): Promise<{
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
    getProjectBoards(projectId: string, req: AuthenticatedRequest): Promise<({
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
    getBoardById(boardId: string, req: AuthenticatedRequest): Promise<{
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
    updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, req: AuthenticatedRequest): Promise<{
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
    deleteBoard(boardId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    createColumn(boardId: string, createColumnDto: CreateColumnDto, req: AuthenticatedRequest): Promise<{
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
    updateColumn(columnId: string, updateColumnDto: UpdateColumnDto, req: AuthenticatedRequest): Promise<{
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
    deleteColumn(columnId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    moveColumn(columnId: string, moveColumnDto: MoveColumnDto, req: AuthenticatedRequest): Promise<({
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
