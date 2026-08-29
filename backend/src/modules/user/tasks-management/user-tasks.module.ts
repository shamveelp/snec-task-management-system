import { Module } from '@nestjs/common';
import { UserTasksController } from './user-tasks.controller';
import { TasksModule } from '../../organization/tasks-management/tasks.module';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [TasksModule, CloudinaryModule],
  controllers: [UserTasksController],
})
export class UserTasksModule {}
