import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsRepository } from './invitations.repository';
import { InvitationsController } from './invitations.controller';

import { DatabaseModule } from '../../../database/database.module';
import { EmailModule } from '../../email/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [InvitationsController],
  providers: [InvitationsService, InvitationsRepository,
  ],
  exports: [InvitationsService],
})
export class InvitationsModule {}
