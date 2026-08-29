import { Module } from '@nestjs/common';
import { AdminUserController } from './user/admin-user.controller';
import { AdminUserService } from './user/admin-user.service';
import { AdminUserRepository } from './user/admin-user.repository';
import { AdminOrganizationController } from './organization/admin-organization.controller';
import { AdminOrganizationService } from './organization/admin-organization.service';
import { AdminOrganizationRepository } from './organization/admin-organization.repository';

@Module({
  controllers: [
    AdminUserController,
    AdminOrganizationController,
  ],
  providers: [
    AdminUserService,
    AdminUserRepository,
    AdminOrganizationService,
    AdminOrganizationRepository,
  ],
})
export class AdminModule {}
