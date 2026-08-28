import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { IAuthRepository } from '../repositories/auth.repository.interface';
import { TokenService } from './token.service';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: any) {
    const existingUser = await this.authRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.authRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      mobile: registerDto.mobileNumber,
      password: hashedPassword,
    });
    
    // Automatically login the user after registration
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
