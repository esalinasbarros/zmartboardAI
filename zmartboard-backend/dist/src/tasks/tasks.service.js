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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
    async getTaskById(taskId, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.column.board.project.members.length === 0) {
            throw new common_1.ForbiddenException('You are not a member of this project');
        }
        return task;
    }
    async createTask(columnId, createTaskDto, userId) {
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
        await this.checkProjectMemberPermission(column.board.projectId, userId);
        let position = createTaskDto.position;
        if (position === undefined) {
            const lastTask = await this.prisma.task.findFirst({
                where: { columnId },
                orderBy: { position: 'desc' },
            });
            position = lastTask ? lastTask.position + 1 : 0;
        }
        else {
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
    async updateTask(taskId, updateTaskDto, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.checkProjectMemberPermission(task.column.board.projectId, userId);
        const updatedTask = await this.prisma.task.update({
            where: { id: taskId },
            data: updateTaskDto,
        });
        return updatedTask;
    }
    async deleteTask(taskId, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.checkProjectMemberPermission(task.column.board.projectId, userId);
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
    async moveTask(taskId, moveTaskDto, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.checkProjectMemberPermission(task.column.board.projectId, userId);
        const { targetColumnId, position: newPosition } = moveTaskDto;
        const sourceColumnId = task.columnId;
        const oldPosition = task.position;
        if (targetColumnId && targetColumnId !== sourceColumnId) {
            const targetColumn = await this.prisma.column.findUnique({
                where: { id: targetColumnId },
            });
            if (!targetColumn) {
                throw new common_1.NotFoundException('Target column not found');
            }
            if (targetColumn.boardId !== task.column.boardId) {
                throw new common_1.BadRequestException('Cannot move task to a column in a different board');
            }
        }
        const finalTargetColumnId = targetColumnId || sourceColumnId;
        await this.prisma.$transaction(async (tx) => {
            if (targetColumnId && targetColumnId !== sourceColumnId) {
                await tx.task.updateMany({
                    where: {
                        columnId: sourceColumnId,
                        position: { gt: oldPosition },
                    },
                    data: {
                        position: { decrement: 1 },
                    },
                });
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
            }
            else {
                if (newPosition > oldPosition) {
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
                }
                else {
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
    async archiveTask(taskId, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.checkProjectMemberPermission(task.column.board.projectId, userId);
        if (task.archived) {
            throw new common_1.BadRequestException('Task is already archived');
        }
        const archivedTask = await this.prisma.task.update({
            where: { id: taskId },
            data: { archived: true },
        });
        return { message: 'Task archived successfully', task: archivedTask };
    }
    async unarchiveTask(taskId, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.checkProjectMemberPermission(task.column.board.projectId, userId);
        if (!task.archived) {
            throw new common_1.BadRequestException('Task is not archived');
        }
        const unarchivedTask = await this.prisma.task.update({
            where: { id: taskId },
            data: { archived: false },
        });
        return { message: 'Task unarchived successfully', task: unarchivedTask };
    }
    async assignUserToTask(taskId, assignUserDto, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.checkProjectMemberPermission(task.column.board.projectId, userId);
        const targetUserMembership = await this.prisma.projectMember.findFirst({
            where: {
                projectId: task.column.board.projectId,
                userId: assignUserDto.userId,
            },
        });
        if (!targetUserMembership) {
            throw new common_1.BadRequestException('User is not a member of this project');
        }
        const existingAssignment = await this.prisma.userTask.findUnique({
            where: {
                userId_taskId: {
                    userId: assignUserDto.userId,
                    taskId,
                },
            },
        });
        if (existingAssignment) {
            throw new common_1.BadRequestException('User is already assigned to this task');
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
    async unassignUserFromTask(taskId, unassignUserDto, userId) {
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
            throw new common_1.NotFoundException('Task not found');
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
            throw new common_1.NotFoundException('User is not assigned to this task');
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
    async getTaskAssignments(taskId, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.checkProjectMemberPermission(task.column.board.projectId, userId);
        return task.assignedUsers;
    }
    async createTimeEntry(taskId, createTimeEntryDto, userId) {
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
            throw new common_1.NotFoundException('Task not found');
        }
        await this.checkProjectMemberPermission(task.column.board.projectId, userId);
        if (task.assignedUsers.length === 0) {
            throw new common_1.ForbiddenException('You must be assigned to this task to create time entries');
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
    async updateTimeEntry(timeEntryId, updateTimeEntryDto, userId) {
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
            throw new common_1.NotFoundException('Time entry not found');
        }
        if (timeEntry.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own time entries');
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
    async deleteTimeEntry(timeEntryId, userId) {
        const timeEntry = await this.prisma.timeEntry.findUnique({
            where: { id: timeEntryId },
        });
        if (!timeEntry) {
            throw new common_1.NotFoundException('Time entry not found');
        }
        if (timeEntry.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own time entries');
        }
        await this.prisma.timeEntry.delete({
            where: { id: timeEntryId },
        });
        return { message: 'Time entry deleted successfully' };
    }
    async getTaskTimeEntries(taskId, userId) {
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
            throw new common_1.NotFoundException('Task not found');
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
    async getUserTaskTimeEntries(taskId, userId) {
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
            throw new common_1.NotFoundException('Task not found');
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
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map