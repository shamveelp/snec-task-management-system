import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ProjectsRepository } from './projects.repository';
import { ProjectPriority, ProjectStatus, ProjectRole, AuditAction } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

export interface CreateProjectDto {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  priority?: ProjectPriority;
  status?: ProjectStatus;
  memberIds?: string[];
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  priority?: ProjectPriority;
  status?: ProjectStatus;
}

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) {}

  async createProject(organizationId: string, createdById: string, data: CreateProjectDto) {
    const { memberIds, startDate, endDate, ...projectData } = data;

    // Create the project and automatically add the creator as a PROJECT_MANAGER
    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        organizationId,
        createdById,
        members: {
          create: [
            {
              userId: createdById,
              role: ProjectRole.PROJECT_MANAGER,
            },
            // Map any additionally requested members (filtering out the creator if they were passed)
            ...(memberIds?.filter(id => id !== createdById).map(id => ({
              userId: id,
              role: ProjectRole.DEVELOPER,
            })) || []),
          ],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, profilePicture: true },
            },
          },
        },
      },
    });

    // Log notification
    await this.prisma.notification.create({
      data: {
        type: 'PROJECT_CREATED',
        title: `Project created: ${project.name}`,
        organizationId: project.organizationId,
        actorId: createdById,
        metadata: {
          projectId: project.id,
          projectName: project.name
        }
      }
    });

    await this.auditLogsService.logAction({
      userId: createdById,
      organizationId,
      action: AuditAction.CREATE,
      entityType: 'PROJECT',
      entityId: project.id,
      details: `Project "${project.name}" created`,
    });

    return project;
  }

  async getProjectsByOrganization(organizationId: string) {
    return this.prisma.project.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: { members: true, tasks: true },
        },
        members: {
          take: 5,
          include: {
            user: { select: { id: true, name: true, profilePicture: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectsByUser(userId: string) {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: { members: true, tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, profilePicture: true },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async updateProject(projectId: string, data: UpdateProjectDto, userId?: string, organizationId?: string) {
    const { startDate, endDate, ...rest } = data;
    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...rest,
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
        ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
      },
    });

    if (userId && organizationId) {
      await this.auditLogsService.logAction({
        userId,
        organizationId,
        action: AuditAction.UPDATE,
        entityType: 'PROJECT',
        entityId: projectId,
        details: `Project "${project.name}" updated`,
      });
    }

    return project;
  }

  async addProjectMember(projectId: string, targetUserId: string, role: ProjectRole, actorId?: string, organizationId?: string) {
    // Check if user exists in the org first (Optional depending on strictly bounded APIs, but good practice)
    
    // Check if already a member
    const existing = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId: targetUserId },
      },
    });

    if (existing) {
      throw new BadRequestException('User is already a member of this project');
    }

    const member = await this.prisma.projectMember.create({
      data: {
        projectId,
        userId: targetUserId,
        role,
      },
      include: {
        user: { select: { id: true, name: true, email: true, profilePicture: true } }
      }
    });

    if (actorId && organizationId) {
      await this.auditLogsService.logAction({
        userId: actorId,
        organizationId,
        action: AuditAction.UPDATE,
        entityType: 'PROJECT',
        entityId: projectId,
        details: `Added user ${member.user.name} to project with role ${role}`,
      });
    }

    return member;
  }

  async updateMemberRole(projectId: string, targetUserId: string, role: ProjectRole, actorId?: string, organizationId?: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });

    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    const updated = await this.prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId: targetUserId } },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true, profilePicture: true } }
      }
    });

    if (actorId && organizationId) {
      await this.auditLogsService.logAction({
        userId: actorId,
        organizationId,
        action: AuditAction.UPDATE,
        entityType: 'PROJECT',
        entityId: projectId,
        details: `Updated user ${updated.user.name} role to ${role}`,
      });
    }

    return updated;
  }

  async removeMember(projectId: string, targetUserId: string, actorId?: string, organizationId?: string) {
    try {
      const deleted = await this.prisma.projectMember.delete({
        where: { projectId_userId: { projectId, userId: targetUserId } },
        include: { user: { select: { name: true } } }
      });

      if (actorId && organizationId) {
        await this.auditLogsService.logAction({
          userId: actorId,
          organizationId,
          action: AuditAction.UPDATE,
          entityType: 'PROJECT',
          entityId: projectId,
          details: `Removed user ${deleted.user.name} from project`,
        });
      }

      return { success: true };
    } catch (error) {
      throw new NotFoundException('Project member not found');
    }
  }
}
