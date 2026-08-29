import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProjectPriority, ProjectStatus, ProjectRole } from '@prisma/client';

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
  constructor(private prisma: PrismaService) {}

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

  async updateProject(projectId: string, data: UpdateProjectDto) {
    const { startDate, endDate, ...rest } = data;
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...rest,
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
        ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
      },
    });
  }

  async addProjectMember(projectId: string, userId: string, role: ProjectRole) {
    // Check if user exists in the org first (Optional depending on strictly bounded APIs, but good practice)
    
    // Check if already a member
    const existing = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (existing) {
      throw new BadRequestException('User is already a member of this project');
    }

    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
      include: {
        user: { select: { id: true, name: true, email: true, profilePicture: true } }
      }
    });
  }

  async updateMemberRole(projectId: string, userId: string, role: ProjectRole) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) {
      throw new NotFoundException('Project member not found');
    }

    return this.prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true, profilePicture: true } }
      }
    });
  }

  async removeMember(projectId: string, userId: string) {
    try {
      await this.prisma.projectMember.delete({
        where: { projectId_userId: { projectId, userId } },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('Project member not found');
    }
  }
}
