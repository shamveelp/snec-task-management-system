import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class InvitationsRepository {
  constructor(protected readonly prisma: PrismaService) {
      }
}
