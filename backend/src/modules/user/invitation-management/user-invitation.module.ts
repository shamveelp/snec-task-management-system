import { Module } from '@nestjs/common';
import { UserInvitationController } from './user-invitation.controller';
import { InvitationsModule } from '../../organization/invitation-management/invitations.module';

@Module({
  imports: [InvitationsModule],
  controllers: [UserInvitationController],
})
export class UserInvitationModule {}
