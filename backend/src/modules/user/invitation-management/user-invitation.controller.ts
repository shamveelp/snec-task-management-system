import { Controller, Get, Param, Put, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { InvitationsService } from '../../organization/invitation-management/invitations.service';

@UseGuards(JwtAuthGuard)
@Controller('user/invitations')
export class UserInvitationController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get('me')
  async getMyInvitations(@Req() req) {
    return this.invitationsService.getMyInvitations(req.user.id);
  }

  @Put(':id/accept')
  async acceptInvitation(@Param('id') id: string, @Req() req) {
    return this.invitationsService.acceptInvitation(id, req.user.id);
  }

  
}
