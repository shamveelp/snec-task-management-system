import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organization-management/organizations.module';
import { ProjectsModule } from './projects-management/projects.module';
import { TasksModule } from './tasks-management/tasks.module';
import { InvitationsModule } from './invitation-management/invitations.module';
import { OrganizationDashboardModule } from './dashboard/organization-dashboard.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    OrganizationsModule,
    ProjectsModule,
    TasksModule,
    InvitationsModule,
    OrganizationDashboardModule,
    AuditLogsModule,
    ReportsModule,
  ]
})
export class OrganizationModule {}
