import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getProjectProgress(organizationId: string) {
    const projects = await this.prisma.project.findMany({
      where: { organizationId },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          }
        }
      }
    });

    return projects.map(project => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      return {
        projectId: project.id,
        projectName: project.name,
        status: project.status,
        totalTasks,
        completedTasks,
        progress: Math.round(progress),
      };
    });
  }

  async getUserProductivity(organizationId: string) {
    // Get all users in the organization and their completed tasks within this organization's projects
    const members = await this.prisma.projectMember.findMany({
      where: { project: { organizationId } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          }
        }
      }
    });

    const uniqueUsers = Array.from(new Map(members.map(m => [m.userId, m.user])).values());

    const productivity = await Promise.all(uniqueUsers.map(async (user) => {
      const tasksCompleted = await this.prisma.task.count({
        where: {
          assigneeId: user.id,
          project: { organizationId },
          status: 'DONE',
        }
      });
      const tasksAssigned = await this.prisma.task.count({
        where: {
          assigneeId: user.id,
          project: { organizationId },
        }
      });

      return {
        user,
        tasksCompleted,
        tasksAssigned,
        completionRate: tasksAssigned > 0 ? Math.round((tasksCompleted / tasksAssigned) * 100) : 0,
      };
    }));

    return productivity.sort((a, b) => b.tasksCompleted - a.tasksCompleted);
  }

  async getTaskCompletionStats(organizationId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { project: { organizationId } },
      select: { status: true }
    });

    const stats = {
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      DONE: 0,
      TOTAL: tasks.length
    };

    tasks.forEach(task => {
      if (stats[task.status] !== undefined) {
        stats[task.status]++;
      }
    });

    return stats;
  }

  async getOverdueTasks(organizationId: string) {
    const now = new Date();
    return this.prisma.task.findMany({
      where: {
        project: { organizationId },
        dueDate: { lt: now },
        status: { not: 'DONE' }
      },
      include: {
        assignee: {
          select: { id: true, name: true, profilePicture: true }
        },
        project: {
          select: { id: true, name: true }
        }
      },
      orderBy: { dueDate: 'asc' },
      take: 20
    });
  }
}
