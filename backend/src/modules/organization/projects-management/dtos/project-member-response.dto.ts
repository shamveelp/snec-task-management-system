import { Expose, Type } from 'class-transformer';

export class ProjectMemberResponseDto {
  @Expose() id: string;
  @Expose() userId: string;
  @Expose() role: string;
  @Expose() user: any; // Simplified for now
}

export class ProjectResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description: string | null;
  @Expose() startDate: Date | null;
  @Expose() endDate: Date | null;
  @Expose() priority: string;
  @Expose() status: string;
  @Expose() organizationId: string;
  @Expose() createdById: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() _count: any;
  
  @Expose()
  @Type(() => ProjectMemberResponseDto)
  members: ProjectMemberResponseDto[];
}
