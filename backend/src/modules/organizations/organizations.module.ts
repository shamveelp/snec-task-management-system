import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { EmailModule } from '../email/email.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [EmailModule, DatabaseModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
