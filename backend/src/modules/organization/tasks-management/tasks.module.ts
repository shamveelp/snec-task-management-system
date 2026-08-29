import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from '../../../database/database.module';
import { ProjectsModule } from '../projects-management/projects.module';

import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    DatabaseModule,
    ProjectsModule,
    AuditLogsModule,
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository,
  ],
  exports: [TasksService],
})
export class TasksModule {}
