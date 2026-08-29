import { Controller, Get, Put, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UsersController {
  
  constructor(
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService
  ) {}

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: { name?: string; username?: string; mobile?: string; bio?: string }) {
    try {
      const user = await this.usersService.updateProfile(req.user.userId, body);
      return { message: 'Profile updated successfully', user };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update profile');
    }
  }

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    
    try {
      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadImage(file);
      
      // Update User DB record
      const user = await this.usersService.updateProfilePicture(req.user.userId, result.secure_url);
      
      return { message: 'Profile picture updated successfully', user };
    } catch (error) {
      throw new BadRequestException('Failed to upload profile picture');
    }
  }

  @Get()
  @Permissions('MANAGE_USERS')
  getUsers() {
    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
  }

  @Get('admins-only')
  @Roles('Super Admin', 'Admin')
  getAdmins() {
    return [{ id: 1, name: 'System Admin' }];
  }
}
