import { Expose } from 'class-transformer';

export class AdminUserResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() email: string;
  @Expose() mobile: string | null;
  @Expose() status: string;
  @Expose() role: { id: string; name: string } | null;
  @Expose() organizationId: string | null;
  @Expose() profilePicture: string | null;
  @Expose() createdAt: Date;
}
