import { Module } from '@nestjs/common';
import { UserProjectsController } from './user-projects.controller';
import { ProjectsModule } from '../../organization/projects-management/projects.module';

@Module({
  imports: [ProjectsModule],
  controllers: [UserProjectsController],
})
export class UserProjectsModule {}
