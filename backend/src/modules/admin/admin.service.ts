import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // --- USERS MANAGEMENT ---

  async getUsers(query?: string, roleId?: string, status?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (roleId) {
      where.roleId = roleId;
    }
    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { role: true },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      data: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        status: u.status,
        profilePicture: u.profilePicture,
        role: u.role ? { id: u.role.id, name: u.role.name } : null,
        createdAt: u.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async createUser(data: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password || 'TemporaryPassword123!', 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: hashedPassword,
        roleId: data.roleId || null,
        status: data.status || 'ACTIVE'
      },
      include: { role: true }
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        status: user.status,
        profilePicture: user.profilePicture,
        role: user.role ? { id: user.role.id, name: user.role.name } : null,
        createdAt: user.createdAt,
    };
  }

  async updateUser(id: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        mobile: data.mobile,
        roleId: data.roleId,
      },
      include: { role: true }
    });

    return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        mobile: updated.mobile,
        status: updated.status,
        profilePicture: updated.profilePicture,
        role: updated.role ? { id: updated.role.id, name: updated.role.name } : null,
        createdAt: updated.createdAt,
    };
  }

  async updateUserStatus(id: string, status: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id },
      data: { status }
    });

    return { message: 'User status updated successfully' };
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  // --- ORGANIZATIONS MANAGEMENT ---

  async getOrganizations(query?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [orgs, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.organization.count({ where })
    ]);

    return {
      data: orgs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
