import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { IAuthRepository } from '../repositories/auth.repository.interface';
import { TokenService } from './token.service';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

import { EmailService } from '../../../modules/email/email.service';
import { VerifyUserRegistrationDto } from '../dto/verify-user-registration.dto';
import { PrismaService } from '../../../database/prisma.service'; // Needed to fetch Role

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async checkUsername(username: string) {
    const user = await this.authRepository.findByEmailOrUsername(username); // Wait, we might need a dedicated findByUsername, but Prisma can do it. Actually let's use Prisma directly or add a method. For now, since findByEmailOrUsername exists, it checks both!
    return { isUnique: !user };
  }

  async checkEmail(email: string) {
    const user = await this.authRepository.findByEmail(email);
    return { isUnique: !user };
  }

  async register(registerDto: any) {
    const existingEmail = await this.authRepository.findByEmail(registerDto.email);
    if (existingEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingUsername = await this.authRepository.findByEmailOrUsername(registerDto.username);
    if (existingUsername) {
       throw new BadRequestException('User with this username already exists');
    }

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.prisma.otp.upsert({
      where: { email: registerDto.email },
      update: { otp, expiresAt, createdAt: new Date() },
      create: { email: registerDto.email, otp, expiresAt },
    });

    await this.emailService.sendOtpEmail(registerDto.email, otp);

    return { message: 'OTP sent to email successfully' };
  }

  async verifyRegistration(dto: VerifyUserRegistrationDto) {
    const storedOtp = await this.prisma.otp.findUnique({ where: { email: dto.email } });
    if (!storedOtp || storedOtp.otp !== dto.otp || storedOtp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const existingEmail = await this.authRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Find or create User Role
    let userRole = await this.prisma.role.findUnique({ where: { name: 'Developer' } });
    if (!userRole) {
      userRole = await this.prisma.role.create({
        data: {
          name: 'Developer',
          description: 'Developer role',
        },
      });
    }
    const roleId = userRole.id;

    const user = await this.authRepository.create({
      name: dto.name,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      roleId,
    });

    await this.prisma.otp.delete({ where: { email: dto.email } });
    
    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.authRepository.updateRefreshToken(user.id, hashedRefreshToken);
    
    const { password, hashedRefreshToken: _, resetToken, resetTokenExpiry, ...userWithoutSecrets } = user as any;
    
    return {
      user: userWithoutSecrets,
      tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findByEmailOrUsername(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is inactive');
    }

    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.authRepository.updateRefreshToken(user.id, hashedRefreshToken);

    // Filter out password before sending
    const { password, hashedRefreshToken: _, resetToken, resetTokenExpiry, ...userWithoutSecrets } = user;

    return {
      user: userWithoutSecrets,
      tokens,
    };
  }

  async logout(userId: string) {
    await this.authRepository.updateRefreshToken(userId, null);
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.authRepository.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    const newHashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.authRepository.updateRefreshToken(user.id, newHashedRefreshToken);

    return tokens;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.authRepository.updatePassword(user.id, hashedPassword);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      // Don't leak whether user exists
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await this.authRepository.updateResetToken(user.id, hashedResetToken, resetTokenExpiry);

    // Mock Email sending
    console.log(`[Mock Email] Password reset token for ${user.email}: ${resetToken}`);
    // In production, send email with a link like: `https://frontend.com/reset-password?token=${resetToken}&email=${user.email}`
  }

  async resetPassword(dto: ResetPasswordDto, email: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Reset token has expired');
    }

    const isValidToken = await bcrypt.compare(dto.token, user.resetToken);
    if (!isValidToken) {
      throw new BadRequestException('Invalid reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.authRepository.updatePassword(user.id, hashedPassword);
  }
}
