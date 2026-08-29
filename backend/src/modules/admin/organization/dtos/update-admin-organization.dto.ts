import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminOrganizationDto } from './create-admin-organization.dto';

export class UpdateAdminOrganizationDto extends PartialType(CreateAdminOrganizationDto) {}
