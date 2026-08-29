import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { BaseRepository } from '../../../core/repositories/base.repository';

@Injectable()
export class AdminOrganizationRepository extends BaseRepository<any, any, any> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.organization);
  }
}
