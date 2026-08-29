import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { OrganizationDashboardService } from './organization-dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('organization/dashboard')
export class OrganizationDashboardController {
  constructor(private readonly organizationdashboardService: OrganizationDashboardService) {}

  @Get()
  async getDetails(@Req() req) {
    if (!req.user?.organizationId) {
      return { recentProjects: [], recentTasks: [], yourUpcomingTask: null, storageInfo: { available: '0 GB', used: '0 GB' } };
    }
    return this.organizationdashboardService.getDashboardData(req.user.organizationId, req.user.id);
  }
}
