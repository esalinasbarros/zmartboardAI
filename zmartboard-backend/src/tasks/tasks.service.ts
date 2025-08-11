import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  AssignUserDto,
  UnassignUserDto,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
} from './dto';
import { ProjectRole } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

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
   * Get a specific task by ID
   */
  async getTaskById(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: {
                project: {
                  include: {
                    members: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
        },
        assignedUsers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        timeEntries: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.column.board.project.members.length === 0) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return task;
  }

  /**
   * Create a new task (any project member)
   */
  async createTask(columnId: string, createTaskDto: CreateTaskDto, userId: string) {
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

    await this.checkProjectMemberPermission(column.board.projectId, userId);

    // Get the next position if not provided
    let position = createTaskDto.position;
    if (position === undefined) {
      const lastTask = await this.prisma.task.findFirst({
        where: { columnId },
        orderBy: { position: 'desc' },
      });
      position = lastTask ? lastTask.position + 1 : 0;
    } else {
      // Shift existing tasks to make room
      await this.prisma.task.updateMany({
        where: {
          columnId,
          position: { gte: position },
        },
        data: {
          position: { increment: 1 },
        },
      });
    }

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        position,
        columnId,
      },
    });

    return task;
  }

  /**
   * Update task (any project member)
   */
  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: updateTaskDto,
    });

    return updatedTask;
  }

  /**
   * Delete task (any project member)
   */
  async deleteTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    // Delete task and reorder remaining tasks
    await this.prisma.$transaction(async (tx) => {
      await tx.task.delete({
        where: { id: taskId },
      });

      await tx.task.updateMany({
        where: {
          columnId: task.columnId,
          position: { gt: task.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });
    });

    return { message: 'Task deleted successfully' };
  }

  /**
   * Move task (any project member)
   */
  async moveTask(taskId: string, moveTaskDto: MoveTaskDto, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    const { targetColumnId, position: newPosition } = moveTaskDto;
    const sourceColumnId = task.columnId;
    const oldPosition = task.position;

    // If moving to a different column, verify it exists and belongs to the same board
    if (targetColumnId && targetColumnId !== sourceColumnId) {
      const targetColumn = await this.prisma.column.findUnique({
        where: { id: targetColumnId },
      });

      if (!targetColumn) {
        throw new NotFoundException('Target column not found');
      }

      if (targetColumn.boardId !== task.column.boardId) {
        throw new BadRequestException('Cannot move task to a column in a different board');
      }
    }

    const finalTargetColumnId = targetColumnId || sourceColumnId;

    await this.prisma.$transaction(async (tx) => {
      if (targetColumnId && targetColumnId !== sourceColumnId) {
        // Moving to different column
        // Remove from source column
        await tx.task.updateMany({
          where: {
            columnId: sourceColumnId,
            position: { gt: oldPosition },
          },
          data: {
            position: { decrement: 1 },
          },
        });

        // Make room in target column
        await tx.task.updateMany({
          where: {
            columnId: finalTargetColumnId,
            position: { gte: newPosition },
          },
          data: {
            position: { increment: 1 },
          },
        });

        await tx.task.update({
          where: { id: taskId },
          data: {
            columnId: finalTargetColumnId,
            position: newPosition,
          },
        });
      } else {
        // Moving within same column
        if (newPosition > oldPosition) {
          // Moving down: shift tasks up
          await tx.task.updateMany({
            where: {
              columnId: finalTargetColumnId,
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
          // Moving up: shift tasks down
          await tx.task.updateMany({
            where: {
              columnId: finalTargetColumnId,
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

        await tx.task.update({
          where: { id: taskId },
          data: { position: newPosition },
        });
      }
    });

    return this.prisma.task.findUnique({
      where: { id: taskId },
    });
  }

  /**
   * Archive task (any project member)
   */
  async archiveTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    if (task.archived) {
      throw new BadRequestException('Task is already archived');
    }

    const archivedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { archived: true },
    });

    return { message: 'Task archived successfully', task: archivedTask };
  }

  /**
   * Unarchive task (any project member)
   */
  async unarchiveTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    if (!task.archived) {
      throw new BadRequestException('Task is not archived');
    }

    const unarchivedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { archived: false },
    });

    return { message: 'Task unarchived successfully', task: unarchivedTask };
  }

  /**
   * Assign user to task (any project member)
   */
  async assignUserToTask(taskId: string, assignUserDto: AssignUserDto, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    // Check if the user to be assigned is also a project member
    const targetUserMembership = await this.prisma.projectMember.findFirst({
      where: {
        projectId: task.column.board.projectId,
        userId: assignUserDto.userId,
      },
    });

    if (!targetUserMembership) {
      throw new BadRequestException('User is not a member of this project');
    }

    // Check if user is already assigned
    const existingAssignment = await this.prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: assignUserDto.userId,
          taskId,
        },
      },
    });

    if (existingAssignment) {
      throw new BadRequestException('User is already assigned to this task');
    }

    const assignment = await this.prisma.userTask.create({
      data: {
        userId: assignUserDto.userId,
        taskId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return { message: 'User assigned successfully', assignment };
  }

  /**
   * Unassign user from task (any project member)
   */
  async unassignUserFromTask(taskId: string, unassignUserDto: UnassignUserDto, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    const assignment = await this.prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: unassignUserDto.userId,
          taskId,
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('User is not assigned to this task');
    }

    await this.prisma.userTask.delete({
      where: {
        userId_taskId: {
          userId: unassignUserDto.userId,
          taskId,
        },
      },
    });

    return { message: 'User unassigned successfully' };
  }

  /**
   * Get task assignments
   */
  async getTaskAssignments(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
        assignedUsers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    return task.assignedUsers;
  }

  /**
   * Create time entry for task
   */
  async createTimeEntry(taskId: string, createTimeEntryDto: CreateTimeEntryDto, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
        assignedUsers: {
          where: { userId },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    // Check if user is assigned to the task
    if (task.assignedUsers.length === 0) {
      throw new ForbiddenException('You must be assigned to this task to create time entries');
    }

    const timeEntry = await this.prisma.timeEntry.create({
      data: {
        userId,
        taskId,
        hours: createTimeEntryDto.hours,
        description: createTimeEntryDto.description,
        date: createTimeEntryDto.date ? new Date(createTimeEntryDto.date) : new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return { message: 'Time entry created successfully', timeEntry };
  }

  /**
   * Update time entry
   */
  async updateTimeEntry(timeEntryId: string, updateTimeEntryDto: UpdateTimeEntryDto, userId: string) {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id: timeEntryId },
      include: {
        task: {
          include: {
            column: {
              include: {
                board: {
                  include: { project: true },
                },
              },
            },
          },
        },
      },
    });

    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }

    // Only the user who created the time entry can update it
    if (timeEntry.userId !== userId) {
      throw new ForbiddenException('You can only update your own time entries');
    }

    const updatedTimeEntry = await this.prisma.timeEntry.update({
      where: { id: timeEntryId },
      data: {
        ...(updateTimeEntryDto.hours && { hours: updateTimeEntryDto.hours }),
        ...(updateTimeEntryDto.description !== undefined && { description: updateTimeEntryDto.description }),
        ...(updateTimeEntryDto.date && { date: new Date(updateTimeEntryDto.date) }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return { message: 'Time entry updated successfully', timeEntry: updatedTimeEntry };
  }

  /**
   * Delete time entry
   */
  async deleteTimeEntry(timeEntryId: string, userId: string) {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id: timeEntryId },
    });

    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }

    // Only the user who created the time entry can delete it
    if (timeEntry.userId !== userId) {
      throw new ForbiddenException('You can only delete your own time entries');
    }

    await this.prisma.timeEntry.delete({
      where: { id: timeEntryId },
    });

    return { message: 'Time entry deleted successfully' };
  }

  /**
   * Get time entries for a task
   */
  async getTaskTimeEntries(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    const timeEntries = await this.prisma.timeEntry.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

    return {
      timeEntries,
      totalHours,
      entryCount: timeEntries.length,
    };
  }

  /**
   * Get user's time entries for a task
   */
  async getUserTaskTimeEntries(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: { project: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectMemberPermission(task.column.board.projectId, userId);

    const timeEntries = await this.prisma.timeEntry.findMany({
      where: {
        taskId,
        userId,
      },
      orderBy: { date: 'desc' },
    });

    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

    return {
      timeEntries,
      totalHours,
      entryCount: timeEntries.length,
    };
  }
}