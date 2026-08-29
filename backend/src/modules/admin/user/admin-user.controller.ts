import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { CreateAdminUserDto } from './dtos/create-admin-user.dto';
import { UpdateAdminUserDto } from './dtos/update-admin-user.dto';

@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.adminUserService.checkUsername(username);
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    return this.adminUserService.checkEmail(email);
  }

  @Get()
  async getUsers(
    @Query('query') query?: string,
    @Query('roleId') roleId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminUserService.getUsers(
      query,
      roleId,
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @Post()
  async createUser(@Body() data: CreateAdminUserDto) {
    return this.adminUserService.createUser(data);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: UpdateAdminUserDto) {
    return this.adminUserService.updateUser(id, data);
  }

  @Patch(':id/status')
  async updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminUserService.updateUserStatus(id, status);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.adminUserService.deleteUser(id);
  }
}
