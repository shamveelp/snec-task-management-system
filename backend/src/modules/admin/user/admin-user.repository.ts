import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AdminUserRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findAll(args?: any): Promise<any> {
    return this.prisma.user.findMany(args);
  }

  async count(args?: any): Promise<number> {
    return this.prisma.user.count(args);
  }

  async findById(id: string): Promise<any> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOne(args: any): Promise<any> {
    return this.prisma.user.findFirst(args);
  }

  async create(data: any): Promise<any> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
