import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, data: { name?: string; username?: string; mobile?: string; bio?: string }) {
    // Check if username is taken by someone else
    if (data.username) {
      const existingUser = await this.prisma.user.findUnique({ where: { username: data.username } });
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username is already taken');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        mobile: true,
        bio: true,
        profilePicture: true,
        status: true,
        createdAt: true,
      }
    });
  }

  async updateProfilePicture(userId: string, profilePictureUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture: profilePictureUrl },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        mobile: true,
        bio: true,
        profilePicture: true,
        status: true,
        createdAt: true,
      }
    });
  }

  async checkUsernameAvailability(username: string, userId: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username }
    });
    
    // Available if it doesn't exist, OR if it exists but belongs to the current user
    if (!existingUser) return true;
    return existingUser.id === userId;
  }
}
