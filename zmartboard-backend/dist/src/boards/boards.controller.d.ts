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
    getProjectBoards(projectId: string, req: AuthenticatedRequest): Promise<({
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
    getBoardById(boardId: string, req: AuthenticatedRequest): Promise<{
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
    updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, req: AuthenticatedRequest): Promise<{
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
    deleteBoard(boardId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    createColumn(boardId: string, createColumnDto: CreateColumnDto, req: AuthenticatedRequest): Promise<{
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
    updateColumn(columnId: string, updateColumnDto: UpdateColumnDto, req: AuthenticatedRequest): Promise<{
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
    deleteColumn(columnId: string, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    moveColumn(columnId: string, moveColumnDto: MoveColumnDto, req: AuthenticatedRequest): Promise<({
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
