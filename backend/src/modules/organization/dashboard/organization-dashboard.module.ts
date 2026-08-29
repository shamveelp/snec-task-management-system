import { Module } from '@nestjs/common';
import { OrganizationDashboardController } from './organization-dashboard.controller';
import { OrganizationDashboardService } from './organization-dashboard.service';
import { OrganizationDashboardRepository } from './organization-dashboard.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OrganizationDashboardController],
  providers: [OrganizationDashboardService, OrganizationDashboardRepository],
  exports: [OrganizationDashboardService],
})
export class OrganizationDashboardModule {}
