import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { TasksRepository } from './tasks.repository';
import { TaskPriority, TaskStatus, ProjectRole, AuditAction } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  estimatedHours?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assigneeId?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
}

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService
  ) {}

  async getProjectMemberRole(projectId: string, userId: string): Promise<ProjectRole | null> {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    return member?.role || null;
  }

  async checkAccess(projectId: string, userId: string, userOrgRole: string, requiredRoles: string[]) {
    // Org admin can do everything
    if (userOrgRole === 'Organization Admin') return true;

    const role = await this.getProjectMemberRole(projectId, userId);
    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException(`Access denied. Requires project role: ${requiredRoles.join(', ')}`);
    }
    return true;
  }

  async createTask(userId: string, userOrgRole: string, data: CreateTaskDto) {
    // Only ORG ADMIN or PROJECT_MANAGER can create tasks
    await this.checkAccess(data.projectId, userId, userOrgRole, [ProjectRole.PROJECT_MANAGER]);

    const { dueDate, ...rest } = data;

    const project = await this.prisma.project.findUnique({ where: { id: data.projectId } });

    const task = await this.prisma.task.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        reporterId: userId,
      },
      include: {
        assignee: { select: { id: true, name: true, profilePicture: true } },
        reporter: { select: { id: true, name: true, profilePicture: true } },
      }
    });

    if (project) {
      await this.prisma.notification.create({
        data: {
          type: 'TASK_CREATED',
          title: `Task created: ${task.title}`,
          organizationId: project.organizationId,
          actorId: userId,
          metadata: { projectId: project.id, projectName: project.name, taskId: task.id, taskTitle: task.title }
        }
      });

      await this.auditLogsService.logAction({
        userId,
        organizationId: project.organizationId,
        action: AuditAction.CREATE,
        entityType: 'TASK',
        entityId: task.id,
        details: `Task "${task.title}" created`,
      });
    }

    return task;
  }

  async getTasksByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        project: { select: { id: true, name: true, organizationId: true } },
        assignee: { select: { id: true, name: true, profilePicture: true } },
        reporter: { select: { id: true, name: true, profilePicture: true } },
        _count: { select: { comments: true, attachments: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { assigneeId: userId },
      include: {
        project: { select: { id: true, name: true, organizationId: true } },
        assignee: { select: { id: true, name: true, profilePicture: true } },
        reporter: { select: { id: true, name: true, profilePicture: true } },
        _count: { select: { comments: true, attachments: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { select: { id: true, name: true, profilePicture: true } },
        reporter: { select: { id: true, name: true, profilePicture: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, profilePicture: true } }
          },
          orderBy: { createdAt: 'asc' }
        },
        attachments: true
      },
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async updateTask(taskId: string, userId: string, userOrgRole: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    // DEVELOPER can only change STATUS and ACTUAL HOURS.
    // TEAM_LEAD can assign tasks and change status.
    // PROJECT_MANAGER can do everything.

    const role = await this.getProjectMemberRole(task.projectId, userId);
    const isOrgAdmin = userOrgRole === 'Organization Admin';

    if (!isOrgAdmin) {
      if (!role) throw new ForbiddenException('You are not a member of this project.');
      
      if (role === ProjectRole.DEVELOPER) {
        // Enforce Developer limits
        const allowedKeys = ['status', 'actualHours'];
        const dataKeys = Object.keys(data);
        const hasDisallowed = dataKeys.some(key => !allowedKeys.includes(key));
        if (hasDisallowed) {
          throw new ForbiddenException('Developers can only update task status and actual hours.');
        }
      } else if (role === ProjectRole.TEAM_LEAD) {
        // Team Lead can update status, assignee, priority, hours. Cannot change title/desc (maybe we allow it, but let's restrict title/desc just in case).
        const allowedKeys = ['status', 'assigneeId', 'priority', 'dueDate', 'estimatedHours', 'actualHours'];
        const dataKeys = Object.keys(data);
        const hasDisallowed = dataKeys.some(key => !allowedKeys.includes(key));
        if (hasDisallowed) {
          throw new ForbiddenException('Team Leads cannot modify task title or description.');
        }
      }
    }

    const { dueDate, ...rest } = data;

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...rest,
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      },
      include: {
        assignee: { select: { id: true, name: true, profilePicture: true } },
        reporter: { select: { id: true, name: true, profilePicture: true } },
        project: { select: { organizationId: true } }
      }
    });

    await this.auditLogsService.logAction({
      userId,
      organizationId: updatedTask.project.organizationId,
      action: AuditAction.UPDATE,
      entityType: 'TASK',
      entityId: taskId,
      details: `Task "${updatedTask.title}" updated`,
    });

    return updatedTask;
  }

  async addComment(taskId: string, userId: string, content: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) throw new NotFoundException('Task not found');

    const comment = await this.prisma.taskComment.create({
      data: { taskId, userId, content },
      include: {
        user: { select: { id: true, name: true, profilePicture: true } }
      }
    });

    await this.prisma.notification.create({
      data: {
        type: 'COMMENT_ADDED',
        title: `New comment on: ${task.title}`,
        description: content,
        organizationId: task.project.organizationId,
        actorId: userId,
        metadata: { projectId: task.projectId, projectName: task.project.name, taskId: task.id, taskTitle: task.title }
      }
    });

    return comment;
  }

  async addAttachment(taskId: string, userId: string, fileUrl: string, fileName: string, fileSize?: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) throw new NotFoundException('Task not found');

    const attachment = await this.prisma.taskAttachment.create({
      data: { taskId, userId, fileUrl, fileName, fileSize },
      include: {
        user: { select: { id: true, name: true, profilePicture: true } }
      }
    });

    await this.prisma.notification.create({
      data: {
        type: 'ATTACHMENT_UPLOADED',
        title: `Attachment added to: ${task.title}`,
        description: fileName,
        organizationId: task.project.organizationId,
        actorId: userId,
        metadata: { projectId: task.projectId, projectName: task.project.name, taskId: task.id, taskTitle: task.title }
      }
    });

    return attachment;
  }

  async deleteAttachment(attachmentId: string, userId: string) {
    const attachment = await this.prisma.taskAttachment.findUnique({ where: { id: attachmentId } });
    if (!attachment) throw new NotFoundException('Attachment not found');
    if (attachment.userId !== userId) throw new ForbiddenException('You can only delete your own attachments');
    await this.prisma.taskAttachment.delete({ where: { id: attachmentId } });
    return { success: true };
  }

  async getUserProjectRole(projectId: string, userId: string, userOrgRole: string): Promise<string> {
    if (userOrgRole === 'Organization Admin') return 'ORG_ADMIN';
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    return member?.role || 'NONE';
  }
}
