import { Controller, Post, Body, UseGuards, Req, Res, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../../common/guards/jwt-refresh.guard';
import { AuthGuard } from '@nestjs/passport';

import { RegisterDto } from './dtos/register.dto';
import { VerifyUserRegistrationDto } from './dtos/verify-user-registration.dto';
import { Query } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-registration')
  @HttpCode(HttpStatus.CREATED)
  async verifyRegistration(@Body() dto: VerifyUserRegistrationDto) {
    return this.authService.verifyRegistration(dto);
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.authService.checkUsername(username);
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    return this.authService.checkEmail(email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req) {
    return this.authService.refreshToken(req.user.id, req.user.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(req.user.id, dto);
    return { message: 'Password changed successfully' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return { message: 'If an account exists, a reset token has been sent.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto, dto.email);
    return { message: 'Password reset successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    const { password, hashedRefreshToken, resetToken, resetTokenExpiry, ...user } = req.user;
    return user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { user, tokens } = await this.authService.validateOAuthLogin(req.user);
    
    // Redirect to frontend with tokens (or set cookies).
    // Assuming frontend is running on localhost:3000
    // In production, use env variable for frontend URL.
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Simplest way is to redirect with tokens in query params or set cookies.
    // Let's redirect with tokens as query params for this example (since we are not using cookies for JWT here).
    res.redirect(`${frontendUrl}/login?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
  }
}
