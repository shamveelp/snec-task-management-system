import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminUserRepository } from './admin-user.repository';
import { CreateAdminUserDto } from './dtos/create-admin-user.dto';
import { UpdateAdminUserDto } from './dtos/update-admin-user.dto';

@Injectable()
export class AdminUserService {
  constructor(private readonly userRepository: AdminUserRepository) {}

  async checkUsername(username: string) {
    if (!username) return { available: false };
    const user = await this.userRepository.findOne({ where: { username } });
    return { available: !user };
  }

  async checkEmail(email: string) {
    if (!email) return { available: false };
    const user = await this.userRepository.findOne({ where: { email } });
    return { available: !user };
  }

  async getUsers(query?: string, roleId?: string, status?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = { deletedAt: null };
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (roleId) {
      where.roleId = roleId;
    }
    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      this.userRepository.findAll({
        where,
        skip,
        take: limit,
        include: { role: true },
        orderBy: { createdAt: 'desc' }
      }),
      this.userRepository.count({ where })
    ]);

    return {
      data: users.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
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

  async createUser(data: CreateAdminUserDto) {
    const existingEmail = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingEmail) throw new ConflictException('Email already exists');

    if (data.username) {
      const existingUsername = await this.userRepository.findOne({ where: { username: data.username } });
      if (existingUsername) throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password || 'TemporaryPassword123!', 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      status: data.status || 'ACTIVE'
    });

    return user;
  }

  async updateUser(id: string, data: UpdateAdminUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({ where: { email: data.email } });
      if (existingEmail) throw new ConflictException('Email already exists');
    }

    if (data.username && data.username !== user.username) {
      const existingUsername = await this.userRepository.findOne({ where: { username: data.username } });
      if (existingUsername) throw new ConflictException('Username already exists');
    }

    const updated = await this.userRepository.update(id, data);
    return updated;
  }

  async updateUserStatus(id: string, status: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.update(id, { status });
    return { message: 'User status updated successfully' };
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.update(id, { 
      deletedAt: new Date(),
      status: 'INACTIVE'
    });
    return { message: 'User deleted successfully' };
  }
}
