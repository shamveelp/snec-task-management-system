import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Organization Admin')
  @Post()
  async createInvitation(@Req() req, @Body() body: { email: string, roleId: string }) {
    // Organization Admin's organization ID is stored in req.user.organizationId
    const organizationId = req.user.organizationId;
    return this.invitationsService.createInvitation(organizationId, body.email, body.roleId);
  }

  @Get(':token')
  async getInvitation(@Param('token') token: string) {
    return this.invitationsService.getInvitation(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':token/accept')
  async acceptInvitation(@Param('token') token: string, @Req() req) {
    const userId = req.user.id;
    return this.invitationsService.acceptInvitation(token, userId);
  }
}
