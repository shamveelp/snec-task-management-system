import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserOrganizationService } from './user-organization.service';

@UseGuards(JwtAuthGuard)
@Controller('user/organization')
export class UserOrganizationController {
  constructor(private readonly userorganizationService: UserOrganizationService) {}

  @Get()
  async getDetails(@Req() req) {
    return { message: 'UserOrganization API' };
  }
}
