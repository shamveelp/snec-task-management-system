import { Module } from '@nestjs/common';
import { OrganizationsModule } from './organization-management/organizations.module';
import { ProjectsModule } from './projects-management/projects.module';
import { TasksModule } from './tasks-management/tasks.module';
import { InvitationsModule } from './invitation-management/invitations.module';

@Module({
  imports: [
    OrganizationsModule,
    ProjectsModule,
    TasksModule,
    InvitationsModule
  ]
})
export class OrganizationModule {}
