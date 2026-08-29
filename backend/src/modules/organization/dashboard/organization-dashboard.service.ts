import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class OrganizationDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(organizationId: string, userId: string) {
    // 1. Fetch 3 most recent projects for the "Folders" widget
    const recentProjects = await this.prisma.project.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        members: {
          take: 4,
          include: {
            user: {
              select: { id: true, name: true, profilePicture: true }
            }
          }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    // 2. Fetch 3 most recent tasks for the "Recent Files" widget
    const recentTasks = await this.prisma.task.findMany({
      where: { projectId: { in: recentProjects.map(p => p.id) } },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } }
      }
    });

    // 3. Fetch 1 upcoming task for the "Your Task" widget
    const yourUpcomingTask = await this.prisma.task.findFirst({
      where: { 
        assigneeId: userId, 
        status: { notIn: ['DONE'] }
      },
      orderBy: { dueDate: 'asc' },
      include: {
        project: { select: { id: true, name: true } }
      }
    });

    return {
      recentProjects,
      recentTasks,
      yourUpcomingTask,
      storageInfo: {
        available: '73 GB',
        used: '27 GB'
      }
    };
  }
}
