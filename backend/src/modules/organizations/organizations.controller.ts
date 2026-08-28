import { Controller, Post, Body, Get, Query, BadRequestException } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { RegisterOrganizationDto } from './dto/register-organization.dto';
import { SendOtpDto } from './dto/send-otp.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post('register')
  async register(@Body() dto: RegisterOrganizationDto) {
    return this.organizationsService.registerOrganization(dto);
  }

  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.organizationsService.sendOtp(dto.email);
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }
    const isAvailable = await this.organizationsService.isUsernameAvailable(username);
    return { isAvailable };
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const isAvailable = await this.organizationsService.isEmailAvailable(email);
    return { isAvailable };
  }
}
