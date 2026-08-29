import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from '../../database/database.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    DatabaseModule,
    ProjectsModule,
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
