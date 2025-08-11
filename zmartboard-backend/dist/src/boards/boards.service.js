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
var BoardsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BoardsService = BoardsService_1 = class BoardsService {
    prisma;
    logger = new common_1.Logger(BoardsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkProjectAdminPermission(projectId, userId) {
        const membership = await this.prisma.projectMember.findFirst({
            where: {
                projectId,
                userId,
                role: client_1.ProjectRole.ADMIN,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Only project admins can perform this action');
        }
        return membership;
    }
    async checkProjectMemberPermission(projectId, userId) {
        const membership = await this.prisma.projectMember.findFirst({
            where: {
                projectId,
                userId,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        return membership;
    }
    async createBoard(projectId, createBoardDto, userId) {
        await this.checkProjectAdminPermission(projectId, userId);
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const board = await this.prisma.board.create({
            data: {
                title: createBoardDto.title,
                description: createBoardDto.description,
                projectId,
            },
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        tasks: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
            },
        });
        return board;
    }
    async getProjectBoards(projectId, userId) {
        await this.checkProjectMemberPermission(projectId, userId);
        this.logger.log(`Fetching boards for project ${projectId}`);
        const boards = await this.prisma.board.findMany({
            where: { projectId },
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        tasks: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return boards;
    }
    async getBoardById(boardId, userId) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            include: {
                project: {
                    include: {
                        members: {
                            where: { userId },
                        },
                    },
                },
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        tasks: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
            },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        if (board.project.members.length === 0) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        return board;
    }
    async updateBoard(boardId, updateBoardDto, userId) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            include: { project: true },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        await this.checkProjectAdminPermission(board.projectId, userId);
        const updatedBoard = await this.prisma.board.update({
            where: { id: boardId },
            data: updateBoardDto,
            include: {
                columns: {
                    orderBy: { position: 'asc' },
                    include: {
                        tasks: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
            },
        });
        return updatedBoard;
    }
    async deleteBoard(boardId, userId) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            include: { project: true },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        await this.checkProjectAdminPermission(board.projectId, userId);
        await this.prisma.board.delete({
            where: { id: boardId },
        });
        return { message: 'Board deleted successfully' };
    }
    async createColumn(boardId, createColumnDto, userId) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            include: { project: true },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        await this.checkProjectAdminPermission(board.projectId, userId);
        let position = createColumnDto.position;
        if (position === undefined) {
            const lastColumn = await this.prisma.column.findFirst({
                where: { boardId },
                orderBy: { position: 'desc' },
            });
            position = lastColumn ? lastColumn.position + 1 : 0;
        }
        else {
            await this.prisma.column.updateMany({
                where: {
                    boardId,
                    position: { gte: position },
                },
                data: {
                    position: { increment: 1 },
                },
            });
        }
        const column = await this.prisma.column.create({
            data: {
                name: createColumnDto.name,
                position,
                boardId,
            },
            include: {
                tasks: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return column;
    }
    async updateColumn(columnId, updateColumnDto, userId) {
        const column = await this.prisma.column.findUnique({
            where: { id: columnId },
            include: {
                board: {
                    include: { project: true },
                },
            },
        });
        if (!column) {
            throw new common_1.NotFoundException('Column not found');
        }
        await this.checkProjectAdminPermission(column.board.projectId, userId);
        const updatedColumn = await this.prisma.column.update({
            where: { id: columnId },
            data: updateColumnDto,
            include: {
                tasks: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return updatedColumn;
    }
    async deleteColumn(columnId, userId) {
        const column = await this.prisma.column.findUnique({
            where: { id: columnId },
            include: {
                board: {
                    include: { project: true },
                },
            },
        });
        if (!column) {
            throw new common_1.NotFoundException('Column not found');
        }
        await this.checkProjectAdminPermission(column.board.projectId, userId);
        await this.prisma.$transaction(async (tx) => {
            await tx.column.delete({
                where: { id: columnId },
            });
            await tx.column.updateMany({
                where: {
                    boardId: column.boardId,
                    position: { gt: column.position },
                },
                data: {
                    position: { decrement: 1 },
                },
            });
        });
        return { message: 'Column deleted successfully' };
    }
    async moveColumn(columnId, moveColumnDto, userId) {
        const column = await this.prisma.column.findUnique({
            where: { id: columnId },
            include: {
                board: {
                    include: { project: true },
                },
            },
        });
        if (!column) {
            throw new common_1.NotFoundException('Column not found');
        }
        await this.checkProjectAdminPermission(column.board.projectId, userId);
        const { position: newPosition } = moveColumnDto;
        const oldPosition = column.position;
        if (newPosition === oldPosition) {
            return column;
        }
        await this.prisma.$transaction(async (tx) => {
            if (newPosition > oldPosition) {
                await tx.column.updateMany({
                    where: {
                        boardId: column.boardId,
                        position: {
                            gt: oldPosition,
                            lte: newPosition,
                        },
                    },
                    data: {
                        position: { decrement: 1 },
                    },
                });
            }
            else {
                await tx.column.updateMany({
                    where: {
                        boardId: column.boardId,
                        position: {
                            gte: newPosition,
                            lt: oldPosition,
                        },
                    },
                    data: {
                        position: { increment: 1 },
                    },
                });
            }
            await tx.column.update({
                where: { id: columnId },
                data: { position: newPosition },
            });
        });
        return this.prisma.column.findUnique({
            where: { id: columnId },
            include: {
                tasks: {
                    orderBy: { position: 'asc' },
                },
            },
        });
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = BoardsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map