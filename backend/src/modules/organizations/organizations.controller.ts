import { Controller, Post, Body, Get, Query, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
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

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllOrganizations() {
    return this.organizationsService.getAllOrganizations();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin')
  @Get('members')
  async getMembers(@Req() req) {
    return this.organizationsService.getMembers(req.user.organizationId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin')
  @Get('invitations')
  async getInvitations(@Req() req) {
    return this.organizationsService.getInvitations(req.user.organizationId);
  }

  @Get('roles')
  async getRoles() {
    return this.organizationsService.getRoles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin')
  @Get('search-developers')
  async searchDevelopers(@Query('q') query: string, @Req() req) {
    return this.organizationsService.searchDevelopers(query, req.user.organizationId);
  }
}
