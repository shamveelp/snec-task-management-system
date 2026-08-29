import { Expose } from 'class-transformer';

export class InvitationResponseDto {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() token: string;
  @Expose() organizationId: string;
  @Expose() roleId: string;
  @Expose() status: string;
  @Expose() expiresAt: Date;
  @Expose() createdAt: Date;
  
  @Expose() organization: any;
  @Expose() role: any;
}
