import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('organization/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('project-progress')
  @Roles('Organization Admin', 'Project Manager')
  async getProjectProgress(@Req() req: any) {
    if (!req.user.organizationId) return [];
    return this.reportsService.getProjectProgress(req.user.organizationId);
  }

  @Get('user-productivity')
  @Roles('Organization Admin', 'Project Manager')
  async getUserProductivity(@Req() req: any) {
    if (!req.user.organizationId) return [];
    return this.reportsService.getUserProductivity(req.user.organizationId);
  }

  @Get('task-completion')
  @Roles('Organization Admin', 'Project Manager')
  async getTaskCompletion(@Req() req: any) {
    if (!req.user.organizationId) return null;
    return this.reportsService.getTaskCompletionStats(req.user.organizationId);
  }

  @Get('overdue-tasks')
  @Roles('Organization Admin', 'Project Manager')
  async getOverdueTasks(@Req() req: any) {
    if (!req.user.organizationId) return [];
    return this.reportsService.getOverdueTasks(req.user.organizationId);
  }
}
