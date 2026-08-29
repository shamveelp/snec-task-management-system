import { Module } from '@nestjs/common';
import { UserModule as UserProfileModule } from './profile-management/users.module';
import { UserProjectsModule } from './projects-management/user-projects.module';
import { UserTasksModule } from './tasks-management/user-tasks.module';
import { UserInvitationModule } from './invitation-management/user-invitation.module';

@Module({
  imports: [
    UserProfileModule,
    UserProjectsModule,
    UserTasksModule,
    UserInvitationModule,
  ]
})
export class UserModule {}
