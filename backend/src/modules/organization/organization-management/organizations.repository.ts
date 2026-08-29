import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class OrganizationsRepository {
  constructor(protected readonly prisma: PrismaService) {
      }
}
