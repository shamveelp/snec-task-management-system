import { Expose } from 'class-transformer';

export class AdminOrganizationResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() category: string;
  @Expose() memberCount: number;
  @Expose() createdAt: Date;
}
