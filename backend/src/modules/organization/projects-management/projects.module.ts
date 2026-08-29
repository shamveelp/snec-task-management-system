import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { ProjectsController } from './projects.controller';
import { DatabaseModule } from '../../../database/database.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [DatabaseModule, AuditLogsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
