import { Expose } from 'class-transformer';

export class TaskResponseDto {
  @Expose() id: string;
  @Expose() projectId: string;
  @Expose() title: string;
  @Expose() description: string | null;
  @Expose() status: string;
  @Expose() priority: string;
  @Expose() assignedToId: string | null;
  @Expose() createdById: string;
  @Expose() dueDate: Date | null;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  
  @Expose() assignedTo: any;
  @Expose() createdBy: any;
}
