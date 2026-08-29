import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(data: {
    userId: string;
    organizationId?: string;
    action: AuditAction;
    entityType: string;
    entityId?: string;
    details?: string;
  }) {
    try {
      return await this.prisma.auditLog.create({
        data,
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`);
    }
  }

  async getLogs(organizationId: string, skip: number = 0, take: number = 50) {
    return this.prisma.auditLog.findMany({
      where: { organizationId },
      include: {
        user: { select: { id: true, name: true, email: true, profilePicture: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }
}
