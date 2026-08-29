import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserDashboardService } from './user-dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('user/dashboard')
export class UserDashboardController {
  constructor(private readonly userdashboardService: UserDashboardService) {}

  @Get()
  async getDetails(@Req() req) {
    return { message: 'UserDashboard API' };
  }
}
