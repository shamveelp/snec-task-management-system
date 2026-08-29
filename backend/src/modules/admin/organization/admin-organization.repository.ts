import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AdminOrganizationRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findAll(args?: any): Promise<any> {
    return this.prisma.organization.findMany(args);
  }

  async count(args?: any): Promise<number> {
    return this.prisma.organization.count(args);
  }

  async findById(id: string): Promise<any> {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  async findOne(args: any): Promise<any> {
    return this.prisma.organization.findFirst(args);
  }

  async create(data: any): Promise<any> {
    return this.prisma.organization.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
