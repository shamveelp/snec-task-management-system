import { Controller, Get, Query } from '@nestjs/common';
import { AdminOrganizationService } from './admin-organization.service';

@Controller('admin/organizations')
export class AdminOrganizationController {
  constructor(private readonly adminOrganizationService: AdminOrganizationService) {}

  @Get()
  async getOrganizations(
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminOrganizationService.getOrganizations(
      query,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }
}
