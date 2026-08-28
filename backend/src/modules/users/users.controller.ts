import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('users')
// 1. First, verify the user is logged in
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UsersController {
  
  @Get()
  // 2. Only users with the 'MANAGE_USERS' permission can access this route
  // The PermissionsGuard will check if the user's role has this permission
  @Permissions('MANAGE_USERS')
  getUsers() {
    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
  }

  @Get('admins-only')
  // 3. Alternatively, you can restrict by Role explicitly
  @Roles('Super Admin', 'Admin')
  getAdmins() {
    return [{ id: 1, name: 'System Admin' }];
  }
}
