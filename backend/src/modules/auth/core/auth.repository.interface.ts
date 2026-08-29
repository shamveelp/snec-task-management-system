import { User } from '@prisma/client';

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findByEmailOrUsername(identifier: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: any): Promise<User>;
  updateRefreshToken(userId: string, hashedRefreshToken: string | null): Promise<void>;
  updateResetToken(userId: string, resetToken: string | null, resetTokenExpiry: Date | null): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}
