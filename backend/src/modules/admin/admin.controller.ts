import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('Super Admin') // Assuming role name
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- USERS MANAGEMENT ---

  @Get('users')
  async getUsers(
    @Query('query') query?: string,
    @Query('roleId') roleId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getUsers(
      query,
      roleId,
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @Post('users')
  async createUser(@Body() data: any) {
    return this.adminService.createUser(data);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUser(id, data);
  }

  @Patch('users/:id/status')
  async updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // --- ORGANIZATIONS MANAGEMENT ---

  @Get('organizations')
  async getOrganizations(
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getOrganizations(
      query,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }
}
