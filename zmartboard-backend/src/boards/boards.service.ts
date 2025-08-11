import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBoardDto,
  UpdateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
  MoveColumnDto,
} from './dto';
import { ProjectRole } from '@prisma/client';

@Injectable()
export class BoardsService {
  private readonly logger = new Logger(BoardsService.name);
  constructor(private prisma: PrismaService) {}

  /**
   * Check if user is project admin
   */
  private async checkProjectAdminPermission(projectId: string, userId: string) {
    const membership = await this.prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
        role: ProjectRole.ADMIN,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Only project admins can perform this action');
    }

    return membership;
  }

  /**
   * Check if user is project member
   */
  private async checkProjectMemberPermission(projectId: string, userId: string) {
    const membership = await this.prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return membership;
  }

  /**
   * Create a new board (only project admins)
   */
  async createBoard(projectId: string, createBoardDto: CreateBoardDto, userId: string) {
    await this.checkProjectAdminPermission(projectId, userId);

    // Verify project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
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

  /**
   * Get all boards for a project
   */
  async getProjectBoards(projectId: string, userId: string) {
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

  /**
   * Get a specific board by ID
   */
  async getBoardById(boardId: string, userId: string) {
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
      throw new NotFoundException('Board not found');
    }

    if (board.project.members.length === 0) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return board;
  }

  /**
   * Update board (only project admins)
   */
  async updateBoard(boardId: string, updateBoardDto: UpdateBoardDto, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: { project: true },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
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

  /**
   * Delete board (only project admins)
   */
  async deleteBoard(boardId: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: { project: true },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.checkProjectAdminPermission(board.projectId, userId);

    await this.prisma.board.delete({
      where: { id: boardId },
    });

    return { message: 'Board deleted successfully' };
  }

  /**
   * Create a new column (only project admins)
   */
  async createColumn(boardId: string, createColumnDto: CreateColumnDto, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: { project: true },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.checkProjectAdminPermission(board.projectId, userId);

    // Get the next position if not provided
    let position = createColumnDto.position;
    if (position === undefined) {
      const lastColumn = await this.prisma.column.findFirst({
        where: { boardId },
        orderBy: { position: 'desc' },
      });
      position = lastColumn ? lastColumn.position + 1 : 0;
    } else {
      // Shift existing columns to make room
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

  /**
   * Update column (only project admins)
   */
  async updateColumn(columnId: string, updateColumnDto: UpdateColumnDto, userId: string) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: {
        board: {
          include: { project: true },
        },
      },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
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

  /**
   * Delete column (only project admins)
   */
  async deleteColumn(columnId: string, userId: string) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: {
        board: {
          include: { project: true },
        },
      },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.checkProjectAdminPermission(column.board.projectId, userId);

    // Delete column and reorder remaining columns
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

  /**
   * Move column position (only project admins)
   */
  async moveColumn(columnId: string, moveColumnDto: MoveColumnDto, userId: string) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: {
        board: {
          include: { project: true },
        },
      },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.checkProjectAdminPermission(column.board.projectId, userId);

    const { position: newPosition } = moveColumnDto;
    const oldPosition = column.position;

    if (newPosition === oldPosition) {
      return column;
    }

    await this.prisma.$transaction(async (tx) => {
      if (newPosition > oldPosition) {
        // Moving right: shift columns left
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
      } else {
        // Moving left: shift columns right
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


}